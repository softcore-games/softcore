import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.night-api.com",
      "cdn.night-api.com",
      "placehold.co",
      "im.runware.ai",
      "fal.media",
      "fal-cdn.com",
      "v3.fal.media",
      "www.softcore.games",
      "softcore.games",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.night-api.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.night-api.com",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "im.runware.ai",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "fal.media",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "fal-cdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v3.fal.media",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "www.softcore.games",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "softcore.games",
        pathname: "/images/**",
      },
    ],
  },
  // Ensure proper security headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
      ],
    },
  ],
  serverRuntimeConfig: {
    maxDuration: 90,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
