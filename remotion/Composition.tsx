import React from 'react';
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { Caption, CaptionStyle } from '@/lib/types';
import { StandardCaption } from './captions/StandardCaption';
import { NewsCaption } from './captions/NewsCaption';
import { KaraokeCaption } from './captions/KaraokeCaption';

interface CaptionedVideoProps {
  videoSrc: string;
  captions: Caption[];
  style: CaptionStyle;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoSrc,
  captions,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the current caption based on time
  const currentCaption = captions.find(
    (caption) =>
      currentTime >= caption.startTime && currentTime < caption.endTime
  );

  // Select caption component based on style
  const CaptionComponent = {
    standard: StandardCaption,
    news: NewsCaption,
    karaoke: KaraokeCaption,
  }[style];

  return (
    <AbsoluteFill>
      {/* Background video */}
      <Video src={staticFile(videoSrc)} />

      {/* Caption overlay */}
      {currentCaption && (
        <CaptionComponent
          text={currentCaption.text}
          currentTime={currentTime}
          startTime={currentCaption.startTime}
          endTime={currentCaption.endTime}
        />
      )}
    </AbsoluteFill>
  );
};
