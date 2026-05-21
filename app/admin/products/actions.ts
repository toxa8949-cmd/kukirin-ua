'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type ProductFormInput = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  price: string;        // string from form input
  old_price: string;    // empty if no discount
  category_id: string;  // uuid or empty
  stock: string;        // string from form input
  is_active: boolean;
  featured: boolean;
  cover_url: string;
  // specs sub-fields
  specs_category: string; // 'urban' | 'offroad' | 'flagship' | 'accessory' | ''
  specs_badge: string;    // 'hit' | 'new' | 'top' | ''
  specs_tagline: string;
  specs_power: string;
  specs_max_speed: string;
  specs_range: string;
  specs_battery: string;
  // extra image URLs (one per line)
  image_urls: string;
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

function parseFormToInput(formData: FormData): ProductFormInput {
  return {
    id: (formData.get('id') as string) || undefined,
    slug: String(formData.get('slug') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    price: String(formData.get('price') ?? '').trim(),
    old_price: String(formData.get('old_price') ?? '').trim(),
    category_id: String(formData.get('category_id') ?? '').trim(),
    stock: String(formData.get('stock') ?? '0').trim(),
    is_active: formData.get('is_active') === 'on',
    featured: formData.get('featured') === 'on',
    cover_url: String(formData.get('cover_url') ?? '').trim(),
    specs_category: String(formData.get('specs_category') ?? '').trim(),
    specs_badge: String(formData.get('specs_badge') ?? '').trim(),
    specs_tagline: String(formData.get('specs_tagline') ?? '').trim(),
    specs_power: String(formData.get('specs_power') ?? '').trim(),
    specs_max_speed: String(formData.get('specs_max_speed') ?? '').trim(),
    specs_range: String(formData.get('specs_range') ?? '').trim(),
    specs_battery: String(formData.get('specs_battery') ?? '').trim(),
    image_urls: String(formData.get('image_urls') ?? '').trim(),
  };
}

function validate(i: ProductFormInput): string | null {
  if (i.slug.length < 2) return 'Введіть slug (мін 2 символи).';
  if (!/^[a-z0-9-]+$/.test(i.slug)) return 'Slug може містити лише латинські літери, цифри й тире.';
  if (i.name.length < 2) return 'Введіть назву товара.';
  const price = Number(i.price);
  if (!Number.isFinite(price) || price < 0) return 'Невірна ціна.';
  if (i.old_price) {
    const op = Number(i.old_price);
    if (!Number.isFinite(op) || op < 0) return 'Невірна стара ціна.';
  }
  const stock = Number(i.stock);
  if (!Number.isFinite(stock) || stock < 0) return 'Невірна кількість на складі.';
  return null;
}

function buildSpecs(i: ProductFormInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (i.specs_category) out.category = i.specs_category;
  if (i.specs_badge) out.badge = i.specs_badge;
  if (i.specs_tagline) out.tagline = i.specs_tagline;
  if (i.specs_power) out.power = i.specs_power;
  if (i.specs_max_speed) out.max_speed = i.specs_max_speed;
  if (i.specs_range) out.range_km = i.specs_range;
  if (i.specs_battery) out.battery = i.specs_battery;
  return out;
}

function parseImageUrls(raw: string): string[] {
  return raw
    .split(/[\r\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parseFormToInput(formData);
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', input.slug)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Товар з таким slug вже існує.' };

  const insert = {
    slug: input.slug,
    name: input.name,
    description: input.description || null,
    price: Number(input.price),
    old_price: input.old_price ? Number(input.old_price) : null,
    category_id: input.category_id || null,
    stock: Number(input.stock),
    is_active: input.is_active,
    featured: input.featured,
    cover_url: input.cover_url || null,
    specs: buildSpecs(input),
  };

  const { data: created, error: insErr } = await supabase
    .from('products')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(insert as any)
    .select('id')
    .single();

  if (insErr || !created) {
    console.error('createProduct:', insErr);
    return { ok: false, error: `Не вдалось створити: ${insErr?.message ?? 'unknown error'}` };
  }

  const productId = (created as { id: string }).id;

  // Insert extra images if provided
  const urls = parseImageUrls(input.image_urls);
  if (urls.length > 0) {
    const rows = urls.map((url, idx) => ({
      product_id: productId,
      url,
      sort_order: idx,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('product_images').insert(rows as any);
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
  revalidatePath(`/product/${input.slug}`);
  redirect(`/admin/products/${productId}/edit?created=1`);
}

export async function updateProduct(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const input = parseFormToInput(formData);
  if (!input.id) return { ok: false, error: 'Відсутній id товара.' };
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createAdminClient();

  // Check slug uniqueness (excluding self)
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', input.slug)
    .neq('id', input.id)
    .maybeSingle();
  if (existing) return { ok: false, error: 'Товар з таким slug вже існує.' };

  const update = {
    slug: input.slug,
    name: input.name,
    description: input.description || null,
    price: Number(input.price),
    old_price: input.old_price ? Number(input.old_price) : null,
    category_id: input.category_id || null,
    stock: Number(input.stock),
    is_active: input.is_active,
    featured: input.featured,
    cover_url: input.cover_url || null,
    specs: buildSpecs(input),
    updated_at: new Date().toISOString(),
  };

  const { error: updErr } = await supabase
    .from('products')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(update as any)
    .eq('id', input.id);

  if (updErr) {
    console.error('updateProduct:', updErr);
    return { ok: false, error: `Не вдалось зберегти: ${updErr.message}` };
  }

  // Replace product_images: delete then insert (simpler than diff for now)
  await supabase.from('product_images').delete().eq('product_id', input.id);
  const urls = parseImageUrls(input.image_urls);
  if (urls.length > 0) {
    const rows = urls.map((url, idx) => ({
      product_id: input.id,
      url,
      sort_order: idx,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('product_images').insert(rows as any);
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${input.id}/edit`);
  revalidatePath('/catalog');
  revalidatePath('/');
  revalidatePath(`/product/${input.slug}`);
  return { ok: true, id: input.id };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;
  if (!id) return { ok: false, error: 'Відсутній id.' };

  const supabase = createAdminClient();

  // Get slug for revalidation
  const { data: prod } = await supabase
    .from('products')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  const slug = (prod as { slug: string } | null)?.slug;

  // Delete images first (FK)
  await supabase.from('product_images').delete().eq('product_id', id);

  // Note: order_items.product_id is FK with ON DELETE SET NULL by default.
  // If that's not the case, this delete will fail and surface the error.
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    console.error('deleteProduct:', error);
    return {
      ok: false,
      error: `Не вдалось видалити: ${error.message}. Можливо, товар вже у замовленнях — спробуйте деактивувати.`,
    };
  }

  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  revalidatePath('/');
  if (slug) revalidatePath(`/product/${slug}`);
  return { ok: true, id };
}

export async function uploadProductImage(formData: FormData): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'Файл не передано.' };
  if (file.size === 0) return { ok: false, error: 'Порожній файл.' };
  if (file.size > 5 * 1024 * 1024) return { ok: false, error: 'Розмір > 5 МБ.' };

  const supabase = createAdminClient();
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    console.error('uploadProductImage:', error);
    return { ok: false, error: `Upload failed: ${error.message}` };
  }

  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);
  return { ok: true, url: pub.publicUrl };
}
