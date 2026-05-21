import Link from 'next/link';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Товари' };

type Row = {
  id: string;
  slug: string;
  name: string;
  price: number | string;
  old_price: number | string | null;
  stock: number | null;
  is_active: boolean | null;
  featured: boolean | null;
  cover_url: string | null;
  category: { name: string } | null;
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('products')
    .select('id, slug, name, price, old_price, stock, is_active, featured, cover_url, category:categories(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`name.ilike.${term},slug.ilike.${term}`);
  }

  const { data } = await query;
  const list = (data ?? []) as unknown as Row[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">
            <ArrowLeft size={12} /> На дашборд
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// PRODUCTS</div>
          <h1 className="text-3xl font-medium tracking-tight">Товари</h1>
          <p className="mt-2 text-sm text-[#4A4A48] dark:text-white/55">{list.length} товарів</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-2.5 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33]"
        >
          <Plus size={14} /> ДОДАТИ ТОВАР
        </Link>
      </div>

      <form className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-4">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Пошук за назвою або slug…"
          className="w-full rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-[#FAFAF7] dark:bg-[#0A0A0A] px-3 py-2 text-sm outline-none focus:border-[#FF6B00]"
        />
      </form>

      <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F]">
        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#4A4A48] dark:text-white/55">Нічого не знайдено.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((p) => {
              const price = Number(p.price);
              const old = p.old_price != null ? Number(p.old_price) : null;
              return (
                <li key={p.id} className="flex items-center gap-4 p-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-sm bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] tracking-[0.15em] text-[#6C6A65] dark:text-white/30">
                        KUKIRIN
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-[#6C6A65] dark:text-white/40">
                      /{p.slug}
                      {p.category?.name && <span className="ml-2">· {p.category.name}</span>}
                      <span className="ml-2">· склад: {p.stock ?? 0}</span>
                    </div>
                  </div>
                  <div className="hidden flex-shrink-0 text-right sm:block">
                    {old && (
                      <div className="text-[11px] text-[#6C6A65] dark:text-white/30 line-through">
                        {old.toLocaleString('uk-UA')} ₴
                      </div>
                    )}
                    <div className="text-sm font-medium text-[#FF6B00]">
                      {price.toLocaleString('uk-UA')} ₴
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {p.is_active === false && (
                      <span className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#6C6A65] dark:text-white/50">
                        off
                      </span>
                    )}
                    {p.featured && (
                      <span className="rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#993C1D] dark:text-[#FF8A33]">
                        feat
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="inline-flex flex-shrink-0 items-center gap-1 rounded-sm border border-[#E8E6DE] dark:border-white/15 px-3 py-1.5 text-xs text-[#4A4A48] dark:text-white/80 hover:border-[#DCDAD0] dark:hover:border-white/40 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white"
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
