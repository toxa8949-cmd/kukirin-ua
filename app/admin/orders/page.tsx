import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Замовлення' };

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  total: number | string;
  status: string;
  created_at: string | null;
};

function shortRef(id: string) {
  return id.split('-')[0]?.toUpperCase() ?? id;
}

const STATUS_LABEL: Record<string, string> = {
  new: 'нові',
  confirmed: 'підтверджені',
  shipped: 'відправлені',
  completed: 'завершені',
  canceled: 'скасовані',
};

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  confirmed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  shipped: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('orders')
    .select('id, customer_name, phone, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status && STATUS_LABEL[status]) {
    query = query.eq('status', status);
  }
  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(
      `customer_name.ilike.${term},phone.ilike.${term},email.ilike.${term}`,
    );
  }

  const { data } = await query;
  const list = (data ?? []) as unknown as OrderRow[];

  // Counts for tabs (independent of current filter)
  const { data: allForCounts } = await supabase.from('orders').select('status');
  const counts = new Map<string, number>();
  for (const r of (allForCounts ?? []) as Array<{ status: string }>) {
    counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  }
  const totalCount = (allForCounts ?? []).length;

  const Tab = ({
    href,
    label,
    active,
    count,
  }: {
    href: string;
    label: string;
    active: boolean;
    count?: number;
  }) => (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-sm px-3 py-1.5 text-xs ${
        active
          ? 'bg-[#FF6B00] text-white dark:text-black'
          : 'border border-[#E8E6DE] dark:border-white/15 text-[#4A4A48] dark:text-white/70 hover:border-[#DCDAD0] dark:hover:border-white/30'
      }`}
    >
      {label}
      {typeof count === 'number' && (
        <span className={active ? 'text-black/60' : 'text-[#6C6A65] dark:text-white/40'}>· {count}</span>
      )}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ORDERS</div>
        <h1 className="text-3xl font-medium tracking-tight">Замовлення</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Tab href="/admin/orders" label="Усі" active={!status} count={totalCount} />
        {Object.entries(STATUS_LABEL).map(([k, label]) => (
          <Tab
            key={k}
            href={`/admin/orders?status=${k}`}
            label={label}
            active={status === k}
            count={counts.get(k) ?? 0}
          />
        ))}
      </div>

      <form className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-4">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Пошук за імʼям, телефоном або email…"
          className="w-full rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-[#FAFAF7] dark:bg-[#0A0A0A] px-3 py-2 text-sm outline-none focus:border-[#FF6B00]"
        />
      </form>

      <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F]">
        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#4A4A48] dark:text-white/55">Нічого не знайдено.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((o) => {
              const cls = STATUS_COLOR[o.status] ?? 'bg-white/5 text-[#4A4A48] dark:text-white/70 border-[#E8E6DE] dark:border-white/10';
              return (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center gap-3 p-3 transition hover:bg-white dark:bg-white/[0.02] sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">
                        <span className="text-[#6C6A65] dark:text-white/40">#</span>
                        <span className="font-medium">{shortRef(o.id)}</span>
                        <span className="ml-2 text-[#4A4A48] dark:text-white/70">{o.customer_name}</span>
                      </div>
                      <div className="truncate text-xs text-[#6C6A65] dark:text-white/40">
                        {o.phone}
                        {o.created_at && (
                          <span className="ml-2">
                            · {new Date(o.created_at).toLocaleString('uk-UA')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cls}`}
                    >
                      {o.status}
                    </span>
                    <span className="flex-shrink-0 font-medium text-[#FF6B00]">
                      {Number(o.total).toLocaleString('uk-UA')} ₴
                    </span>
                    <ChevronRight size={14} className="flex-shrink-0 text-[#6C6A65] dark:text-white/30" />
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
