import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // WebP + AVIF — Next.js серверує найкращий формат який браузер підтримує
    formats: ['image/avif', 'image/webp'],
    // Domains for product/category images
    remotePatterns: [
      { protocol: 'https', hostname: 'kukirin.com.ua' },
      { protocol: 'https', hostname: 'ssxygllbnkjoklfhdfkb.supabase.co' },
    ],
    // Розміри пристроїв для srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Розміри для прев'юх товарів
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Кеш на 60 днів
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
  // Compression — gzip/brotli (Vercel робить це автоматично, але вмикаємо явно)
  compress: true,
  // Production source maps вимикаємо (швидший build, менший bundle)
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
