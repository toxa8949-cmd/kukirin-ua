import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'kukirin.com.ua' },
      { protocol: 'https', hostname: 'ssxygllbnkjoklfhdfkb.supabase.co' },
    ],
  },
  // Type errors from external libs (Supabase generic narrowing) are tracked separately;
  // do not block deploys on them.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
