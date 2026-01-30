import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logodetimes.com',
        pathname: '/times/**',
      },
    ],
  },
};

export default nextConfig;
