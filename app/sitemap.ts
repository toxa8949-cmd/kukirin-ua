import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE = 'https://kukirinstore.com.ua';

// Регенерувати карту сайту раз на годину
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Статичні сторінки ────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/catalog`,     changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/blog`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/accessories`, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/service`,     changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/test-drive`,  changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/delivery`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/warranty`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contacts`,    changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`,     changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,       changeFrequency: 'yearly',  priority: 0.2 },
  ];

  // ─── Динамічні: товари, категорії, блог ───────────────────────────────
  let productPages:  MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];
  let blogPages:     MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();

    // Товари — slug + updated_at для lastModified
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, featured')
      .eq('is_active', true);

    if (products) {
      productPages = (products as Array<{
        slug: string;
        updated_at: string | null;
        featured: boolean | null;
      }>).map((p) => ({
        url: `${BASE}/product/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
        changeFrequency: 'weekly' as const,
        priority: p.featured ? 0.9 : 0.8,
      }));
    }

    // Категорії — динамічно з БД + legacy (urban/offroad/flagship)
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    const dbSlugs = new Set(
      ((categories ?? []) as Array<{ slug: string }>).map((c) => c.slug)
    );
    // Legacy категорії додаємо тільки якщо їх немає в БД
    const allCatSlugs = new Set<string>(dbSlugs);
    for (const legacy of ['urban', 'offroad', 'flagship']) {
      allCatSlugs.add(legacy);
    }
    categoryPages = Array.from(allCatSlugs).map((slug) => ({
      url: `${BASE}/category/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Блог — slug + published_at для lastModified
    const { data: news } = await supabase
      .from('news')
      .select('slug, published_at')
      .eq('published', true);

    if (news) {
      blogPages = (news as Array<{
        slug: string;
        published_at: string | null;
      }>).map((n) => ({
        url: `${BASE}/blog/${n.slug}`,
        lastModified: n.published_at ? new Date(n.published_at) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (e) {
    // При недоступності БД — sitemap все одно віддасть статичні сторінки
    console.error('[sitemap] failed to load dynamic pages', e);
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
