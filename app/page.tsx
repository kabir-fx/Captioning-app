'use client';

import React, { useState } from 'react';
import { VideoUploader } from '@/components/VideoUploader';
import { CaptionStyleSelector } from '@/components/CaptionStyleSelector';
import { VideoPreview } from '@/components/VideoPreview';
import { ExportButton } from '@/components/ExportButton';
import { Caption, CaptionStyle } from '@/lib/types';

export default function Home() {
  const [videoId, setVideoId] = useState<string>('');
  const [videoFilename, setVideoFilename] = useState<string>('');
  const [videoPath, setVideoPath] = useState<string>('');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUploadComplete = (data: {
    videoId: string;
    filename: string;
    path: string;
  }) => {
    setVideoId(data.videoId);
    setVideoFilename(data.filename);
    setVideoPath(data.path);
    setCaptions([]);
    setError('');
  };

  const handleGenerateCaptions = async () => {
    if (!videoId || !videoFilename) return;

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, filename: videoFilename, videoUrl: videoPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate captions');
      }

      const data = await response.json();
      setCaptions(data.captions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Caption generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-cyan-950/20 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-gray-400">AI-Powered Video Captioning</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Caption<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Studio</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Transform your videos with AI-generated captions. Upload, style, and export in minutes.
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Step 1: Upload */}
          <section className="bg-[#111118] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                1
              </span>
              Upload Video
            </h2>
            <VideoUploader onUploadComplete={handleUploadComplete} />
          </section>

          {/* Step 2: Generate Captions */}
          {videoPath && (
            <section className="bg-[#111118] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Generate Captions
              </h2>
              <button
                onClick={handleGenerateCaptions}
                disabled={isGenerating}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/20"
              >
                {isGenerating ? (
                  <span className="flex items-center">
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
                    Generating Captions...
                  </span>
                ) : (
                  '✨ Auto-Generate Captions'
                )}
              </button>
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
              {captions.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Successfully generated {captions.length} caption segments!
                </div>
              )}
            </section>
          )}

          {/* Step 3: Choose Style */}
          {captions.length > 0 && (
            <section className="bg-[#111118] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Choose Caption Style
              </h2>
              <CaptionStyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
              />
            </section>
          )}

          {/* Step 4: Preview & Export */}
          {captions.length > 0 && (
            <section className="bg-[#111118] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Preview & Export
              </h2>
              <VideoPreview
                videoPath={videoPath}
                captions={captions}
                style={selectedStyle}
              />
              <div className="mt-8">
                <ExportButton
                  videoId={videoId}
                  videoFilename={videoFilename}
                  captions={captions}
                  style={selectedStyle}
                  videoUrl={videoPath}
                />
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-20 text-gray-500 text-sm">
          <p>Built with Next.js, Remotion & Gemini AI</p>
        </footer>
      </div>
    </div>
  );
}
