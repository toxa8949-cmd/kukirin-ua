import Link from 'next/link';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Новини' };

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published: boolean | null;
  published_at: string | null;
  created_at: string | null;
};

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('news')
    .select('id, slug, title, excerpt, cover_url, published, published_at, created_at')
    .order('created_at', { ascending: false });
  if (filter === 'published') query = query.eq('published', true);
  if (filter === 'draft') query = query.eq('published', false);

  const { data } = await query;
  const list = (data ?? []) as unknown as Row[];

  const FilterTab = ({
    href,
    label,
    active,
  }: {
    href: string;
    label: string;
    active: boolean;
  }) => (
    <Link
      href={href}
      className={`rounded-sm px-3 py-1.5 text-xs ${
        active
          ? 'bg-[#FF6B00] text-black'
          : 'border border-white/15 text-white/70 hover:border-white/30'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
            <ArrowLeft size={12} /> На дашборд
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// NEWS</div>
          <h1 className="text-3xl font-medium tracking-tight">Новини</h1>
          <p className="mt-2 text-sm text-white/55">{list.length} статей</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-2.5 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]"
        >
          <Plus size={14} /> ДОДАТИ СТАТТЮ
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterTab href="/admin/news" label="Усі" active={!filter} />
        <FilterTab href="/admin/news?filter=published" label="Опубліковані" active={filter === 'published'} />
        <FilterTab href="/admin/news?filter=draft" label="Чернетки" active={filter === 'draft'} />
      </div>

      <div className="rounded-sm border border-white/10 bg-[#0F0F0F]">
        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/55">Нічого не знайдено.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((n) => (
              <li key={n.id} className="flex items-center gap-4 p-3">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-sm bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                  {n.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.cover_url} alt={n.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] tracking-[0.15em] text-white/30">
                      БЛОГ
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-white/40">
                    /{n.slug}
                    {n.published_at && (
                      <span className="ml-2">· опубл. {new Date(n.published_at).toLocaleDateString('uk-UA')}</span>
                    )}
                  </div>
                  {n.excerpt && (
                    <div className="line-clamp-1 text-xs text-white/50">{n.excerpt}</div>
                  )}
                </div>
                <span
                  className={`flex-shrink-0 rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    n.published
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-white/60'
                  }`}
                >
                  {n.published ? 'опубл.' : 'чернетка'}
                </span>
                <Link
                  href={`/admin/news/${n.id}/edit`}
                  className="inline-flex flex-shrink-0 items-center gap-1 rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:border-white/40 hover:text-white"
                >
                  <Pencil size={12} /> Редагувати
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
