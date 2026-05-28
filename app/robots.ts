import type { MetadataRoute } from 'next';

const BASE = 'https://kukirinstore.com.ua';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Не індексувати службові сторінки
        disallow: [
          '/admin',
          '/admin/',
          '/account',
          '/cart',
          '/checkout',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
