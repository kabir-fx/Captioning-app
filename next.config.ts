import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable serving static files from public directory
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // Exclude server-side packages from bundling
  serverExternalPackages: [
    '@remotion/bundler',
    '@remotion/renderer',
    'esbuild',
    '@remotion/compositor-linux-arm64-gnu',
    '@remotion/compositor-linux-arm64-musl',
    '@remotion/compositor-linux-x64-gnu',
    '@remotion/compositor-linux-x64-musl',
    '@remotion/compositor-win32-x64-msvc',
    '@remotion/compositor-darwin-x64',
  ],
  // Turbopack configuration
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Keep webpack externals as a fallback for the standard bundler
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        '@remotion/bundler',
        '@remotion/renderer',
        'esbuild',
      ];
    }
    return config;
  },
};

export default nextConfig;
