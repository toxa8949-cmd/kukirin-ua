import Link from 'next/link';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Категорії' };

type Row = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();

  const [{ data: cats }, { data: products }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, slug, name, description, sort_order')
      .order('sort_order', { ascending: true, nullsFirst: false }),
    supabase.from('products').select('category_id'),
  ]);

  const list = (cats ?? []) as Row[];
  const productList = (products ?? []) as Array<{ category_id: string | null }>;

  const counts = new Map<string, number>();
  for (const p of productList) {
    if (!p.category_id) continue;
    counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
            <ArrowLeft size={12} /> На дашборд
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// CATEGORIES</div>
          <h1 className="text-3xl font-medium tracking-tight">Категорії</h1>
          <p className="mt-2 text-sm text-white/55">{list.length} категорій</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-2.5 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]"
        >
          <Plus size={14} /> ДОДАТИ КАТЕГОРІЮ
        </Link>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#0F0F0F]">
        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/55">Категорій ще немає.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((c) => {
              const productCount = counts.get(c.id) ?? 0;
              return (
                <li key={c.id} className="flex items-center gap-4 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-white/40">
                      /{c.slug}
                      <span className="ml-2">· sort: {c.sort_order ?? '—'}</span>
                      <span className="ml-2">· товарів: {productCount}</span>
                    </div>
                    {c.description && (
                      <div className="mt-1 line-clamp-1 text-xs text-white/50">{c.description}</div>
                    )}
                  </div>
                  <Link
                    href={`/admin/categories/${c.id}/edit`}
                    className="inline-flex flex-shrink-0 items-center gap-1 rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-white/40 hover:text-white"
                  >
                    <Pencil size={12} /> Редагувати
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
