import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.night-api.com", "cdn.night-api.com"],
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
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
  ],
};

export default nextConfig;
