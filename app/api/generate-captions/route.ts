import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import * as fs from "fs";
import { extractAudioFromVideo, getVideoMetadata } from "@/lib/ffmpeg";
import {
  generateCaptionsFromAudio,
  generateSimpleCaptions,
} from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, filename } = body;

    if (!videoId || !filename) {
      return NextResponse.json(
        { error: "Missing videoId or filename" },
        { status: 400 }
      );
    }

    // Get video path
    const videoPath = path.join(process.cwd(), "public", "uploads", filename);

    if (!fs.existsSync(videoPath)) {
      return NextResponse.json(
        { error: "Video file not found" },
        { status: 404 }
      );
    }

    // Create temp directory for audio extraction
    const tempDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const audioPath = path.join(tempDir, `${videoId}.mp3`);

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
    }
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: `Caption generation failed: ${error}` },
      { status: 500 }
    );
  }
}
