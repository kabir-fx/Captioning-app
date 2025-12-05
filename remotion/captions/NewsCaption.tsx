import React from 'react';
import { AbsoluteFill } from 'remotion';

interface NewsCaptionProps {
  text: string;
  currentTime: number;
  startTime: number;
  endTime: number;
}

export const NewsCaption: React.FC<NewsCaptionProps> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '30px 0',
          borderBottom: '4px solid #e63946',
        }}
      >
        <div
          style={{
            fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
            fontSize: 52,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            padding: '0 100px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
