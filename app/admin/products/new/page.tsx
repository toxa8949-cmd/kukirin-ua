import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Новий товар' };

export default async function NewProductPage() {
  const supabase = createAdminClient();
  const { data: cats } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true, nullsFirst: false });
  const categories = (cats ?? []) as { id: string; name: string; slug: string }[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">
          <ArrowLeft size={12} /> До списку товарів
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// PRODUCTS · NEW</div>
        <h1 className="text-3xl font-medium tracking-tight">Новий товар</h1>
      </div>

      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
