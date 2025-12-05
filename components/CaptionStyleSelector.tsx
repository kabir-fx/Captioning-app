'use client';

import React from 'react';
import { CaptionStyle } from '@/lib/types';

interface CaptionStyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
}

const styles = [
  {
    id: 'standard' as CaptionStyle,
    name: 'Standard',
    description: 'Bottom-centered subtitles',
    icon: '💬',
  },
  {
    id: 'news' as CaptionStyle,
    name: 'News',
    description: 'Top-bar ticker style',
    icon: '📰',
  },
  {
    id: 'karaoke' as CaptionStyle,
    name: 'Karaoke',
    description: 'Word-by-word highlight',
    icon: '🎤',
  },
];

export const CaptionStyleSelector: React.FC<CaptionStyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleChange(style.id)}
          className={`
            p-5 rounded-xl text-left transition-all duration-200
            ${
              selectedStyle === style.id
                ? 'bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border-2 border-cyan-400/50 ring-1 ring-cyan-400/20'
                : 'bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10'
            }
          `}
        >
          <div className="text-3xl mb-3">{style.icon}</div>
          <h3 className="text-lg font-semibold text-white mb-1">{style.name}</h3>
          <p className="text-gray-400 text-sm">{style.description}</p>
          {selectedStyle === style.id && (
            <div className="mt-3 flex items-center text-cyan-400 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Selected
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
