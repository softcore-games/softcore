import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["api.night-api.com", "cdn.night-api.com", "placehold.co"],
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
};

export default nextConfig;
