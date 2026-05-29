'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createHash } from 'crypto';

export type ReviewSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

/**
 * Server action: користувач надсилає відгук про товар.
 * Створюється запис з is_published=false (модерація через адмінку).
 *
 * Anti-spam: один відгук з IP на товар на 24 години.
 */
export async function submitReview(formData: FormData): Promise<ReviewSubmitResult> {
  const productId = String(formData.get('product_id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const ratingRaw = String(formData.get('rating') ?? '').trim();
  const text = String(formData.get('text') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();

  // Honeypot: приховане поле "website" — боти його заповнюють, люди ні
  const honeypot = String(formData.get('website') ?? '').trim();
  if (honeypot) return { ok: false, error: 'Спам виявлено' };

  if (!productId) return { ok: false, error: 'Помилка: не вказано товар' };
  if (!name || name.length > 80) return { ok: false, error: "Ім'я: 1–80 символів" };
  const rating = Number.parseInt(ratingRaw, 10);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Оцінка: від 1 до 5 зірок' };
  }
  if (!text || text.length < 5 || text.length > 2000) {
    return { ok: false, error: 'Текст відгуку: від 5 до 2000 символів' };
  }

  // IP для anti-spam
  const hdrs = await headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? hdrs.get('x-real-ip') ?? null;
  const ipHash = hashIp(ip);

  const supabase = await createClient();

  // Anti-spam: вже подавав з цього IP цей товар за останні 24 год?
  if (ipHash) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('ip_hash', ipHash)
      .gte('created_at', dayAgo)
      .limit(1);
    if (recent && recent.length > 0) {
      return { ok: false, error: 'Ви вже залишили відгук на цей товар. Дякуємо!' };
    }
  }

  // INSERT — RLS дозволяє anon з is_published=false (модерація)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('product_reviews')
    .insert({
      product_id: productId,
      name,
      rating,
      text,
      is_published: false,
      ip_hash: ipHash,
    });

  if (error) {
    console.error('[submitReview]', error);
    return { ok: false, error: 'Не вдалося зберегти відгук. Спробуйте ще раз.' };
  }

  if (slug) revalidatePath(`/product/${slug}`);
  return { ok: true };
}
