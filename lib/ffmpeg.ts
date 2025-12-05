import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { VideoMetadata } from './types';

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

