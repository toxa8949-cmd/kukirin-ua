import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Новини' };

export default async function AdminNewsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('news')
    .select('id, slug, title, published, published_at')
    .order('created_at', { ascending: false });

  const list = (data ?? []) as Array<{
    id: string;
    slug: string;
    title: string;
    published: boolean | null;
    published_at: string | null;
  }>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// NEWS</div>
        <h1 className="text-3xl font-medium tracking-tight">Новини</h1>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        {list.length === 0 ? (
          <p className="text-sm text-white/55">Новин ще немає.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((n) => (
              <li key={n.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm">{n.title}</div>
                  <div className="text-xs text-white/40">/{n.slug}</div>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                    n.published
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-white/60'
                  }`}
                >
                  {n.published ? 'опубл.' : 'чернетка'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-sm border border-dashed border-white/15 bg-[#0A0A0A] p-6 text-center">
        <Newspaper size={20} className="mx-auto mb-2 text-[#FF6B00]" />
        <p className="text-sm text-white/55">
          Створення/редагування новин — у Block 8 + Block 11.
        </p>
      </div>
    </div>
  );
}
