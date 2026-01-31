import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logodetimes.com',
        pathname: '/times/**',
      },
      {
        protocol: 'https',
        hostname: 'tmssl.akamaized.net',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
