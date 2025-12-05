'use client';

import React, { useState } from 'react';
import { Caption, CaptionStyle } from '@/lib/types';

interface ExportButtonProps {
  videoId: string;
  videoFilename: string;
  captions: Caption[];
  style: CaptionStyle;
  videoUrl: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  videoId,
  videoFilename,
  captions,
  style,
  videoUrl,
}) => {
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleExport = async () => {
    setIsRendering(true);
    setRenderProgress(0);
    setError('');
    setOutputUrl('');

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          filename: videoFilename,
          captions,
          style,
          videoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rendering failed');
      }

      const data = await response.json();
      setRenderProgress(100);
      setOutputUrl(data.outputUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rendering failed');
      console.error('Render error:', err);
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="space-y-4">
      {!outputUrl && (
        <button
          onClick={handleExport}
          disabled={isRendering}
          className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/20"
        >
          {isRendering ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Rendering Video...
            </span>
          ) : (
            '🎬 Export Captioned Video'
          )}
        </button>
      )}

      {isRendering && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Rendering in progress...</span>
            <span>{renderProgress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {outputUrl && (
        <div className="space-y-4">
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-lg font-semibold text-white">Video Rendered Successfully!</p>
            </div>
            <a
              href={outputUrl}
              download
              className="block w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold px-6 py-3 rounded-xl text-center hover:opacity-90 hover:scale-[1.01] transition-all shadow-lg shadow-cyan-500/20"
            >
              📥 Download Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
