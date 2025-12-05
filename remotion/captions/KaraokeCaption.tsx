import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

interface KaraokeCaptionProps {
  text: string;
  currentTime: number;
  startTime: number;
  endTime: number;
}

export const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({
  text,
  currentTime,
  startTime,
  endTime,
}) => {
  // Calculate progress through the caption (0 to 1)
  const progress = interpolate(
    currentTime,
    [startTime, endTime],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Split text into words
  const words = text.split(' ');

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
          fontSize: 56,
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0 100px',
          maxWidth: '90%',
          lineHeight: 1.5,
        }}
      >
        {words.map((word, index) => {
          // Calculate when this word should be highlighted
          const wordStartProgress = index / words.length;
          const isHighlighted = progress >= wordStartProgress;

          return (
            <span
              key={index}
              style={{
                color: isHighlighted ? '#ffd60a' : 'white',
                textShadow: isHighlighted
                  ? `
                    -2px -2px 0 #000,
                    2px -2px 0 #000,
                    -2px 2px 0 #000,
                    2px 2px 0 #000,
                    0 0 20px rgba(255, 214, 10, 0.8),
                    0 4px 8px rgba(0, 0, 0, 0.8)
                  `
                  : `
                    -2px -2px 0 #000,
                    2px -2px 0 #000,
                    -2px 2px 0 #000,
                    2px 2px 0 #000,
                    0 4px 8px rgba(0, 0, 0, 0.8)
                  `,
                transition: 'all 0.2s ease',
                marginRight: index < words.length - 1 ? '12px' : '0',
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
