import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  confirmed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  shipped: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  canceled: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('orders')
    .select('id, customer_name, phone, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const list = (data ?? []) as unknown as OrderRow[];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={12} /> На дашборд
        </Link>
        <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ORDERS</div>
        <h1 className="text-3xl font-medium tracking-tight">Замовлення</h1>
        <p className="mt-2 text-sm text-white/55">{list.length} останніх замовлень</p>
      </div>

      <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        {list.length === 0 ? (
          <p className="text-sm text-white/55">Замовлень немає.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {list.map((o) => {
              const cls = STATUS_COLOR[o.status] ?? 'bg-white/5 text-white/70 border-white/10';
              return (
                <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">
                      <span className="text-white/40">#</span>
                      <span className="font-medium">{shortRef(o.id)}</span>
                      <span className="ml-2 text-white/70">{o.customer_name}</span>
                      <span className="ml-2 text-xs text-white/40">{o.phone}</span>
                    </div>
                    <div className="text-xs text-white/40">
                      {o.created_at ? new Date(o.created_at).toLocaleString('uk-UA') : ''}
                    </div>
                  </div>
                  <span className={`rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-wider ${cls}`}>
                    {o.status}
                  </span>
                  <span className="font-medium text-[#FF6B00]">
                    {Number(o.total).toLocaleString('uk-UA')} ₴
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-sm border border-dashed border-white/15 bg-[#0A0A0A] p-6 text-center">
        <p className="text-sm text-white/55">
          Деталь замовлення, зміна статусу і фільтри — у Block 9.
        </p>
      </div>
    </div>
  );
}
