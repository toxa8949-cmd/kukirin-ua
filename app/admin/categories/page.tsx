import Link from 'next/link';
import { FolderTree, ArrowLeft } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Категорії' };

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('categories')
    .select('id, slug, name, sort_order')
    .order('sort_order', { ascending: true, nullsFirst: false });

  const list = (data ?? []) as Array<{ id: string; slug: string; name: string; sort_order: number | null }>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// CATEGORIES</div>
        <h1 className="text-3xl font-medium tracking-tight">Категорії</h1>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        {list.length === 0 ? (
          <p className="text-sm text-white/55">Категорій немає.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-white/40">/{c.slug}</div>
                </div>
                <div className="text-xs text-white/40">sort: {c.sort_order ?? '—'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-sm border border-dashed border-white/15 bg-[#0A0A0A] p-6 text-center">
        <FolderTree size={20} className="mx-auto mb-2 text-[#FF6B00]" />
        <p className="text-sm text-white/55">
          Повний CRUD категорій зʼявиться у Block 8.
          <br />
          Поки що список лише для перегляду.
        </p>
      </div>
    </div>
  );
}
