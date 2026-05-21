import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import CategoryForm from '@/components/admin/CategoryForm';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Редагування категорії' };

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
};

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, image_url, sort_order')
    .eq('id', id)
    .maybeSingle();

  if (error) console.error('EditCategoryPage:', error);
  if (!data) notFound();
  const c = data as unknown as CategoryRow;

  const initial = {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? '',
    image_url: c.image_url ?? '',
    sort_order: String(c.sort_order ?? 0),
  };

  const message = created === '1' ? 'Категорію створено.' : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/categories" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">
            <ArrowLeft size={12} /> До списку
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// CATEGORIES · EDIT</div>
          <h1 className="text-3xl font-medium tracking-tight">{c.name}</h1>
        </div>
        <Link
          href={`/category/${c.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/70 hover:text-[#FF6B00]"
        >
          Подивитись на сайті <ExternalLink size={12} />
        </Link>
      </div>

      <CategoryForm mode="edit" initial={initial} initialMessage={message} />
    </div>
  );
}
