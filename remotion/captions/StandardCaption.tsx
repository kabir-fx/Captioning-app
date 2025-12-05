import React from 'react';
import { AbsoluteFill } from 'remotion';

interface StandardCaptionProps {
  text: string;
  currentTime: number;
  startTime: number;
  endTime: number;
}

export const StandardCaption: React.FC<StandardCaptionProps> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
          fontSize: 48,
          fontWeight: 'bold',
          color: 'white',
          textShadow: `
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 4px 8px rgba(0, 0, 0, 0.8)
          `,
          textAlign: 'center',
          padding: '0 100px',
          maxWidth: '90%',
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
