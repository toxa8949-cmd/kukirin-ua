'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type CategoryFormInput = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: string;
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

function parse(formData: FormData): CategoryFormInput {
  return {
    id: (formData.get('id') as string) || undefined,
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    image_url: String(formData.get('image_url') ?? '').trim(),
    sort_order: String(formData.get('sort_order') ?? '0').trim(),
  };
}

function validate(i: CategoryFormInput): string | null {
  if (i.slug.length < 2) return 'Введіть slug (мін 2 символи).';
  if (!/^[a-z0-9-]+$/.test(i.slug)) return 'Slug може містити лише латинські літери, цифри й тире.';
  if (i.name.length < 2) return 'Введіть назву категорії.';
  const so = Number(i.sort_order);
  if (!Number.isFinite(so)) return 'Невірний порядок сортування.';
  return null;
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parse(formData);
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', input.slug)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Категорія з таким slug вже існує.' };

  const insert = {
    slug: input.slug,
    name: input.name,
    description: input.description || null,
    image_url: input.image_url || null,
    sort_order: Number(input.sort_order),
  };

  const { data: created, error: insErr } = await supabase
    .from('categories')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(insert as any)
    .select('id')
    .single();

  if (insErr || !created) {
    console.error('createCategory:', insErr);
    return { ok: false, error: `Не вдалось створити: ${insErr?.message ?? 'unknown'}` };
  }

  const id = (created as { id: string }).id;
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
  revalidatePath(`/category/${input.slug}`);
  redirect(`/admin/categories/${id}/edit?created=1`);
}

export async function updateCategory(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parse(formData);
  if (!input.id) return { ok: false, error: 'Відсутній id.' };
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', input.slug)
    .neq('id', input.id)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Категорія з таким slug вже існує.' };

  const update = {
    slug: input.slug,
    name: input.name,
    description: input.description || null,
    image_url: input.image_url || null,
    sort_order: Number(input.sort_order),
  };

  const { error: updErr } = await supabase
    .from('categories')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(update as any)
    .eq('id', input.id);

  if (updErr) {
    console.error('updateCategory:', updErr);
    return { ok: false, error: `Не вдалось зберегти: ${updErr.message}` };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
  revalidatePath(`/category/${input.slug}`);
  return { ok: true, id: input.id };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: 'Відсутній id.' };

  const supabase = createAdminClient();

  // Block delete if any products still reference this category
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Не можна видалити: у категорії ${count} товар(ів). Перенесіть товари або видаліть їх першими.`,
    };
  }

  const { data: cat } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  const slug = (cat as { slug: string } | null)?.slug;

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    console.error('deleteCategory:', error);
    return { ok: false, error: `Не вдалось видалити: ${error.message}` };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
  if (slug) revalidatePath(`/category/${slug}`);
  return { ok: true, id };
}
