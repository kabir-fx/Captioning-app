'use client';

import React, { useEffect, useRef } from 'react';
import { Caption, CaptionStyle } from '@/lib/types';

interface VideoPreviewProps {
  videoPath: string;
  captions: Caption[];
  style: CaptionStyle;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoPath,
  captions,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentCaption, setCurrentCaption] = React.useState<Caption | null>(
    null
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      
      // Debug: log current time and captions
      console.log('Current video time:', currentTime);
      console.log('Available captions:', captions.map(c => ({
        text: c.text.substring(0, 30) + '...',
        start: c.startTime,
        end: c.endTime
      })));
      
      const caption = captions.find(
        (c) => currentTime >= c.startTime && currentTime < c.endTime
      );
      
      if (caption) {
        console.log('Showing caption:', {
          text: caption.text,
          start: caption.startTime,
          end: caption.endTime
        });
      }
      
      setCurrentCaption(caption || null);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [captions]);

  const getCaptionStyle = () => {
    if (!currentCaption) return {};

    switch (style) {
      case 'standard':
        return {
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: `
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 4px 8px rgba(0, 0, 0, 0.8)
          `,
          textAlign: 'center' as const,
          padding: '0 60px',
          maxWidth: '90%',
        };
      case 'news':
        return {
          top: '0',
          left: '0',
          right: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '20px 0',
          borderBottom: '3px solid #e63946',
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center' as const,
          textTransform: 'uppercase' as const,
        };
      case 'karaoke':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffd60a',
          textShadow: `
            -2px -2px 0 #000,
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 0 20px rgba(255, 214, 10, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.8)
          `,
          textAlign: 'center' as const,
          padding: '0 60px',
          maxWidth: '90%',
        };
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          src={videoPath}
          controls
          className="w-full h-full"
        />

        {currentCaption && (
          <div
            className="absolute pointer-events-none"
            style={{
              fontFamily:
                'var(--font-noto-sans), var(--font-noto-sans-devanagari), sans-serif',
              ...getCaptionStyle(),
            }}
          >
            {currentCaption.text}
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-gray-300 text-sm">
        Preview shows approximate caption styling. Final render may vary slightly.
      </div>
    </div>
  );
};
