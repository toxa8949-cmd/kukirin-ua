import Link from 'next/link';
import {
  Banknote,
  ShoppingBag,
  Receipt,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Дашборд адмінки' };

type Order = {
  id: string;
  customer_name: string;
  total: number | string;
  status: string;
  created_at: string | null;
};

async function getDashboardData() {
  const supabase = createAdminClient();

  const [{ data: orders }, { count: productsCount }, { count: categoriesCount }] =
    await Promise.all([
      supabase
        .from('orders')
        .select('id, customer_name, total, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ]);

  const { data: allTotals } = await supabase.from('orders').select('total, status');
  const list = (allTotals ?? []) as unknown as Array<{ total: number | string; status: string }>;
  const totalRevenue = list.reduce((s, o) => s + Number(o.total ?? 0), 0);
  const ordersCount = list.length;
  const pending = list.filter((o) => o.status === 'new' || o.status === 'confirmed').length;
  const aov = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;

  return {
    recent: (orders ?? []) as unknown as Order[],
    productsCount: productsCount ?? 0,
    categoriesCount: categoriesCount ?? 0,
    totalRevenue,
    ordersCount,
    pending,
    aov,
  };
}

function fmtMoney(n: number) {
  return `${n.toLocaleString('uk-UA')} ₴`;
}

function shortRef(id: string) {
  return id.split('-')[0]?.toUpperCase() ?? id;
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const kpis = [
    { icon: Banknote,    label: 'Виручка',          value: fmtMoney(data.totalRevenue) },
    { icon: Receipt,     label: 'Замовлень',        value: String(data.ordersCount) },
    { icon: ShoppingBag, label: 'Середній чек',     value: fmtMoney(data.aov) },
    { icon: Clock,       label: 'Очікують обробки', value: String(data.pending) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// DASHBOARD</div>
        <h1 className="text-3xl font-medium tracking-tight">Адмін-панель KUKIRIN.UA</h1>
        <p className="mt-2 text-sm text-white/55">
          {data.productsCount} товарів · {data.categoriesCount} категорій · {data.ordersCount} замовлень
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <Icon size={18} className="mb-3 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">{label.toUpperCase()}</div>
            <div className="mt-1 text-xl font-medium tracking-tight">{value}</div>
          </div>
        ))}
      </div>

      <section className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] tracking-[0.2em] text-[#FF8A33]">// ОСТАННІ ЗАМОВЛЕННЯ</div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white"
          >
            Усі замовлення <ArrowRight size={12} />
          </Link>
        </div>

        {data.recent.length === 0 ? (
          <p className="text-sm text-white/55">Поки що немає замовлень.</p>
        ) : (
          <ul className="divide-y divide-white/5 text-sm">
            {data.recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="truncate">
                    <span className="text-white/40">#</span>
                    <span className="font-medium">{shortRef(o.id)}</span>
                    <span className="ml-2 text-white/70">{o.customer_name}</span>
                  </div>
                  <div className="text-xs text-white/40">
                    {o.created_at ? new Date(o.created_at).toLocaleString('uk-UA') : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-sm border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">
                    {o.status}
                  </span>
                  <span className="font-medium text-[#FF6B00]">{fmtMoney(Number(o.total))}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-sm border border-dashed border-white/15 bg-[#0A0A0A] p-6 text-center">
        <p className="text-sm text-white/55">
          Графіки та топ-продукти зʼявляться у Block 10 (recharts).
          <br />
          Поки що тут KPI-плитки і список останніх замовлень.
        </p>
      </section>
    </div>
  );
}
