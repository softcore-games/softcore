/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ["oaidalleapiprodscus.blob.core.windows.net"], // Add other domains as needed
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
