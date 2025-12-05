import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { VideoMetadata } from './types';
// @ts-ignore - No types available for static binaries
import ffmpegPath from 'ffmpeg-static';
// @ts-ignore - No types available for static binaries
import { path as ffprobePath } from 'ffprobe-static';
import * as fs from 'fs';

// Helper to find correct binary path
const getBinaryPath = (importedPath: string | null, binaryName: string) => {
  if (importedPath && fs.existsSync(importedPath)) {
    return importedPath;
  }

  if (importedPath) {
    // Attempt to fix path by resolving relative to local node_modules
    const marker = 'node_modules';
    const markerIndex = importedPath.lastIndexOf(marker);
    
    if (markerIndex !== -1) {
      const relativePath = importedPath.substring(markerIndex + marker.length);
      // Remove leading slash if present
      const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath; // Actually path.join handles this, but careful
      const fixedPath = path.join(process.cwd(), 'node_modules', cleanRelativePath);
      
      console.log(`Attempting fixed path for ${binaryName}:`, fixedPath);
      if (fs.existsSync(fixedPath)) {
        return fixedPath;
      }
    }
  }

  // Fallback: Try to find in node_modules relative to CWD (works for local dev simple cases)
  const localSimplePath = path.join(process.cwd(), 'node_modules', `${binaryName}-static`, binaryName);
  if (fs.existsSync(localSimplePath)) {
    return localSimplePath;
  }
  
  return importedPath;
};

const resolvedFfmpegPath = getBinaryPath(ffmpegPath, 'ffmpeg');
const resolvedFfprobePath = getBinaryPath(ffprobePath, 'ffprobe');

if (resolvedFfmpegPath) {
  console.log('Setting custom ffmpeg path:', resolvedFfmpegPath);
  ffmpeg.setFfmpegPath(resolvedFfmpegPath);
}

if (resolvedFfprobePath) {
  console.log('Setting custom ffprobe path:', resolvedFfprobePath);
  ffmpeg.setFfprobePath(resolvedFfprobePath);
}

/**
 * Extract audio from video file
 * @param videoPath Path to input video file
 * @param outputPath Path for output audio file
 * @returns Promise that resolves when extraction is complete
 */
export function extractAudioFromVideo(
  videoPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vn') // Disable video
      .audioCodec('libmp3lame') // Use MP3 codec
      .audioBitrate('128k')
      .output(outputPath)
      .on('end', () => {
        console.log('Audio extraction completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error extracting audio:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Get video metadata (duration, dimensions, fps)
 * @param videoPath Path to video file
 * @returns Video metadata
 */
export function getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      // Calculate FPS
      const fpsString = videoStream.r_frame_rate || '30/1';
      const [num, den] = fpsString.split('/').map(Number);
      const fps = den ? num / den : 30;

      const videoMetadata: VideoMetadata = {
        id: path.basename(videoPath, path.extname(videoPath)),
        filename: path.basename(videoPath),
        path: videoPath,
        duration: metadata.format.duration || 0,
        width: videoStream.width || 1920,
        height: videoStream.height || 1080,
        fps: Math.round(fps),
      };

      resolve(videoMetadata);
    });
  });
}

