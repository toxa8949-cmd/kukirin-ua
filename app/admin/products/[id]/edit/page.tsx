import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Редагування товара' };

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | string;
  old_price: number | string | null;
  category_id: string | null;
  stock: number | null;
  is_active: boolean | null;
  featured: boolean | null;
  cover_url: string | null;
  specs: Record<string, unknown> | null;
};

type ImageRow = { url: string; sort_order: number | null };

function specStr(specs: Record<string, unknown> | null | undefined, key: string): string {
  const v = specs?.[key];
  return v == null ? '' : String(v);
}

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: prod, error: pErr }, { data: imgs }, { data: cats }] = await Promise.all([
    supabase
      .from('products')
      .select('id, slug, name, description, price, old_price, category_id, stock, is_active, featured, cover_url, specs')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('product_images')
      .select('url, sort_order')
      .eq('product_id', id)
      .order('sort_order', { ascending: true, nullsFirst: false }),
    supabase
      .from('categories')
      .select('id, name, slug')
      .order('sort_order', { ascending: true, nullsFirst: false }),
  ]);

  if (pErr) console.error('EditProductPage:', pErr);
  if (!prod) notFound();
  const p = prod as unknown as ProductRow;
  const imageList = (imgs ?? []) as unknown as ImageRow[];
  const categories = (cats ?? []) as { id: string; name: string; slug: string }[];

  const specCat = specStr(p.specs, 'category') || 'urban';
  const validSpecCat =
    specCat === 'urban' || specCat === 'offroad' || specCat === 'flagship' || specCat === 'accessory'
      ? specCat
      : 'urban';

  const initial = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? '',
    price: String(p.price ?? ''),
    old_price: p.old_price != null ? String(p.old_price) : '',
    category_id: p.category_id ?? '',
    stock: String(p.stock ?? 0),
    is_active: p.is_active !== false,
    featured: !!p.featured,
    cover_url: p.cover_url ?? '',
    specs_category: validSpecCat,
    specs_badge: specStr(p.specs, 'badge'),
    specs_tagline: specStr(p.specs, 'tagline'),
    specs_power: specStr(p.specs, 'power'),
    specs_max_speed: specStr(p.specs, 'max_speed') || specStr(p.specs, 'maxSpeed'),
    specs_range: specStr(p.specs, 'range_km') || specStr(p.specs, 'range'),
    specs_battery: specStr(p.specs, 'battery'),
    image_urls: imageList.map((i) => i.url).join('\n'),
  };

  const message = created === '1' ? 'Товар створено.' : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white"
          >
            <ArrowLeft size={12} /> До списку
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// PRODUCTS · EDIT</div>
          <h1 className="text-3xl font-medium tracking-tight">{p.name}</h1>
        </div>
        <Link
          href={`/product/${p.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/70 hover:text-[#FF6B00]"
        >
          Подивитись на сайті <ExternalLink size={12} />
        </Link>
      </div>

      <ProductForm mode="edit" initial={initial} categories={categories} initialMessage={message} />
    </div>
  );
}
