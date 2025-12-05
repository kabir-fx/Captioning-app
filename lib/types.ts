// Shared TypeScript types for the application

export interface Caption {
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  words?: Word[];
}

export interface Word {
  text: string;
  startTime: number;
  endTime: number;
}

export type CaptionStyle = 'standard' | 'news' | 'karaoke';

export interface VideoMetadata {
  id: string;
  filename: string;
  path: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
}

export interface CaptionGenerationRequest {
  videoId: string;
  videoPath: string;
}

export interface CaptionGenerationResponse {
  captions: Caption[];
  videoMetadata: VideoMetadata;
}

export interface RenderRequest {
  videoId: string;
  videoPath: string;
  captions: Caption[];
  style: CaptionStyle;
}

export interface RenderResponse {
  outputPath: string;
  outputUrl: string;
  duration: number;
}
