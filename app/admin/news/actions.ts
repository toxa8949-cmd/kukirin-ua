'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type NewsFormInput = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string;
  published: boolean;
};

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Не залогінений.' };
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { ok: false, error: 'Немає прав адміністратора.' };
  return { ok: true };
}

function parse(formData: FormData): NewsFormInput {
  return {
    id: (formData.get('id') as string) || undefined,
    slug: String(formData.get('slug') ?? '').trim(),
    title: String(formData.get('title') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    cover_url: String(formData.get('cover_url') ?? '').trim(),
    published: formData.get('published') === 'on',
  };
}

function validate(i: NewsFormInput): string | null {
  if (i.slug.length < 2) return 'Введіть slug (мін 2 символи).';
  if (!/^[a-z0-9-]+$/.test(i.slug)) return 'Slug може містити лише латинські літери, цифри й тире.';
  if (i.title.length < 3) return 'Введіть заголовок (мін 3 символи).';
  return null;
}

export async function createNews(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parse(formData);
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('news')
    .select('id')
    .eq('slug', input.slug)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Стаття з таким slug вже існує.' };

  const insert = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt || null,
    content: input.content || null,
    cover_url: input.cover_url || null,
    published: input.published,
    published_at: input.published ? new Date().toISOString() : null,
  };

  const { data: created, error: insErr } = await supabase
    .from('news')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(insert as any)
    .select('id')
    .single();

  if (insErr || !created) {
    console.error('createNews:', insErr);
    return { ok: false, error: `Не вдалось створити: ${insErr?.message ?? 'unknown'}` };
  }

  const id = (created as { id: string }).id;
  revalidatePath('/admin/news');
  revalidatePath('/blog');
  if (input.published) revalidatePath(`/blog/${input.slug}`);
  redirect(`/admin/news/${id}/edit?created=1`);
}

export async function updateNews(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parse(formData);
  if (!input.id) return { ok: false, error: 'Відсутній id.' };
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('news')
    .select('id')
    .eq('slug', input.slug)
    .neq('id', input.id)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Стаття з таким slug вже існує.' };

  // Load existing record to keep `published_at` stable when re-saving.
  const { data: prev } = await supabase
    .from('news')
    .select('published, published_at')
    .eq('id', input.id)
    .maybeSingle();
  const prevRow = prev as { published: boolean | null; published_at: string | null } | null;

  let publishedAt: string | null = prevRow?.published_at ?? null;
  if (input.published && !prevRow?.published) {
    // Just got published — set the date.
    publishedAt = new Date().toISOString();
  } else if (!input.published) {
    // Reverted to draft — clear the date.
    publishedAt = null;
  }

  const update = {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt || null,
    content: input.content || null,
    cover_url: input.cover_url || null,
    published: input.published,
    published_at: publishedAt,
  };

  const { error: updErr } = await supabase
    .from('news')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(update as any)
    .eq('id', input.id);

  if (updErr) {
    console.error('updateNews:', updErr);
    return { ok: false, error: `Не вдалось зберегти: ${updErr.message}` };
  }

  revalidatePath('/admin/news');
  revalidatePath('/blog');
  revalidatePath(`/blog/${input.slug}`);
  return { ok: true, id: input.id };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: 'Відсутній id.' };

  const supabase = createAdminClient();

  const { data: row } = await supabase
    .from('news')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  const slug = (row as { slug: string } | null)?.slug;

  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) {
    console.error('deleteNews:', error);
    return { ok: false, error: `Не вдалось видалити: ${error.message}` };
  }

  revalidatePath('/admin/news');
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
  return { ok: true, id };
}
