import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type ProductReview = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
  published_at: string | null;
};

/**
 * Отримати опубліковані відгуки конкретного товара.
 * RLS пропускає тільки is_published=true для anon/authenticated.
 */
export async function getReviewsForProduct(productId: string): Promise<ProductReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_reviews')
    .select('id, product_id, name, rating, text, created_at, published_at')
    .eq('product_id', productId)
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(50);
  if (error) {
    console.error('[getReviewsForProduct]', error);
    return [];
  }
  return (data ?? []) as unknown as ProductReview[];
}

/**
 * Сума по відгуках для AggregateRating у Product schema.
 * Повертає { ratingValue, ratingCount } якщо відгуків >= 1.
 */
export async function getAggregateRating(productId: string): Promise<{
  ratingValue: number;
  ratingCount: number;
} | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_published', true);
  if (error || !data || data.length === 0) return null;
  const ratings = (data as Array<{ rating: number }>).map((r) => r.rating);
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return {
    ratingValue: Math.round(avg * 10) / 10, // 1 знак після коми
    ratingCount: ratings.length,
  };
}

/**
 * Адмін: усі відгуки з можливістю фільтру за статусом.
 * Використовує service-role клієнт (обхід RLS).
 */
export async function getAllReviewsForAdmin(filter: 'pending' | 'published' | 'all' = 'all'): Promise<
  (ProductReview & { is_published: boolean; product_name: string | null; product_slug: string | null })[]
> {
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from('product_reviews')
    .select('id, product_id, name, rating, text, is_published, created_at, published_at, products(name, slug)')
    .order('created_at', { ascending: false });
  if (filter === 'pending')   q = q.eq('is_published', false);
  if (filter === 'published') q = q.eq('is_published', true);
  const { data, error } = await q;
  if (error) {
    console.error('[getAllReviewsForAdmin]', error);
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data ?? []) as any[]).map((r) => ({
    id: r.id,
    product_id: r.product_id,
    name: r.name,
    rating: r.rating,
    text: r.text,
    is_published: r.is_published,
    created_at: r.created_at,
    published_at: r.published_at,
    product_name: r.products?.name ?? null,
    product_slug: r.products?.slug ?? null,
  }));
}
