import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/data/products';
import { createClient } from '@/lib/supabase/server';

const BASE = 'https://kukirinstore.com.ua';

// Регенерувати карту сайту раз на годину (замість force-dynamic — швидше)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Статичні сторінки
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/catalog`,     changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/accessories`, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/service`,     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/contacts`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/delivery`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/warranty`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/test-drive`,  changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/category/urban`,     changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/category/offroad`,   changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/category/flagship`,  changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/privacy`,     changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,       changeFrequency: 'yearly',  priority: 0.2 },
  ];

  // Динамічні сторінки товарів з БД
  const products = await getAllProducts().catch(() => []);
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: 'weekly' as const,
    priority: p.badge === 'hit' || p.badge === 'top' ? 0.9 : 0.8,
  }));

  // Динамічні статті блогу з БД
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('news')
      .select('slug, published_at')
      .eq('published', true);
    if (data) {
      blogPages = (data as Array<{ slug: string; published_at: string | null }>).map((n) => ({
        url: `${BASE}/blog/${n.slug}`,
        lastModified: n.published_at ? new Date(n.published_at) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // якщо БД недоступна — sitemap все одно віддасть статичні + товари
  }

  return [...staticPages, ...productPages, ...blogPages];
}
