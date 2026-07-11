import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['yahoo-finance2', 'nodemailer'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
