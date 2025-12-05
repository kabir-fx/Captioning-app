import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import * as path from 'path';
import * as fs from 'fs';
import { Caption, CaptionStyle } from '@/lib/types';
import type { WebpackOverrideFn } from '@remotion/bundler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, filename, captions, style } = body as {
      videoId: string;
      filename: string;
      captions: Caption[];
      style: CaptionStyle;
    };

    if (!videoId || !filename || !captions || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const videoPath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    if (!fs.existsSync(videoPath)) {
      return NextResponse.json(
        { error: 'Video file not found' },
        { status: 404 }
      );
    }

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilename = `${videoId}-${style}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    // Configure webpack to ignore README and other non-JS files
    const webpackOverride: WebpackOverrideFn = (config) => {
      return {
        ...config,
        module: {
          ...config.module,
          rules: [
            ...(config.module?.rules || []),
            {
              test: /\.(md|txt)$/,
              type: 'asset/source',
            },
          ],
        },
      };
    };

    // Bundle Remotion project
    console.log('Bundling Remotion project...');
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), 'remotion', 'index.ts'),
      webpackOverride,
    });

    // Get composition
    console.log('Selecting composition...');
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'CaptionedVideo',
      inputProps: {
        videoSrc: `/uploads/${filename}`,
        captions,
        style,
      },
    });

    // Render video
    console.log('Rendering video...');
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        videoSrc: `/uploads/${filename}`,
        captions,
        style,
      },
    });

    return NextResponse.json({
      success: true,
      outputPath: `/outputs/${outputFilename}`,
      outputUrl: `/outputs/${outputFilename}`,
    });
  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json(
      { error: `Video rendering failed: ${error}` },
      { status: 500 }
    );
  }
}
