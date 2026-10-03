import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript errors থাকলেও Vercel build সফল করবে
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint warnings/errors ইগনোর করবে
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
