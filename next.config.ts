import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [new URL('https://image.tmdb.org/**')],
  },
};

export default nextConfig;
