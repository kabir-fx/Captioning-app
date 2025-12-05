import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { extractAudioFromVideo, getVideoMetadata } from "@/lib/ffmpeg";
import {
  generateCaptionsFromAudio,
  generateSimpleCaptions,
} from "@/lib/gemini";
import { downloadToTemp } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, filename, videoUrl } = body;

    if (!videoId || !filename) {
      return NextResponse.json(
        { error: "Missing videoId or filename" },
        { status: 400 }
      );
    }

    // Determine video path
    let videoPath: string;
    let isTempVideo = false;

    if (videoUrl) {
      // It's a URL (Vercel Blob), download to temp
      console.log('Downloading video from URL...');
      const ext = path.extname(filename);
      videoPath = await downloadToTemp(videoUrl, ext);
      isTempVideo = true;
    } else if (videoId.startsWith('http')) {
       // Fallback if videoId is the URL (legacy)
       console.log('Downloading video from URL (legacy)...');
       const ext = path.extname(filename);
       videoPath = await downloadToTemp(videoId, ext);
       isTempVideo = true;
    } else {
      // Local file (fallback)
      videoPath = path.join(process.cwd(), "public", "uploads", filename);
      if (!fs.existsSync(videoPath)) {
        return NextResponse.json(
          { error: "Video file not found" },
          { status: 404 }
        );
      }
    }

    // Create temp directory for audio extraction
    const tempDir = os.tmpdir();
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const audioPath = path.join(tempDir, `${path.basename(videoPath, path.extname(videoPath))}.mp3`);

    try {
      // Extract audio from video
      console.log("Extracting audio from video...");
      await extractAudioFromVideo(videoPath, audioPath);

      // Get video metadata
      console.log("Getting video metadata...");
      const metadata = await getVideoMetadata(videoPath);

      // Generate captions using Gemini
      console.log("Generating captions with Gemini...");
      let captions;
      try {
        captions = await generateCaptionsFromAudio(audioPath);
      } catch {
        console.log('Primary method failed, trying fallback...');
        captions = await generateSimpleCaptions(audioPath);
      }

      return NextResponse.json({
        success: true,
        captions,
        videoMetadata: metadata,
      });
    } finally {
      // Clean up audio file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
      // Clean up temp video file if downloaded
      if (isTempVideo && fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: `Caption generation failed: ${error}` },
      { status: 500 }
    );
  }
}
