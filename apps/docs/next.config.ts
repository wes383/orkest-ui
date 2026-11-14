import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  trailingSlash: true,
  ...(isProduction ? { output: 'export' as const } : {}),
};

export default nextConfig;
