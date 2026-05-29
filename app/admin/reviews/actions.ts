'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveReview(id: string): Promise<void> {
  if (!id) return;
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('product_reviews')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('[approveReview]', error);
  revalidatePath('/admin/reviews');
  revalidatePath('/product/[slug]', 'page');
}

export async function unpublishReview(id: string): Promise<void> {
  if (!id) return;
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('product_reviews')
    .update({ is_published: false, published_at: null })
    .eq('id', id);
  if (error) console.error('[unpublishReview]', error);
  revalidatePath('/admin/reviews');
  revalidatePath('/product/[slug]', 'page');
}

export async function deleteReview(id: string): Promise<void> {
  if (!id) return;
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('product_reviews').delete().eq('id', id);
  if (error) console.error('[deleteReview]', error);
  revalidatePath('/admin/reviews');
}
