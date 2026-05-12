import Link from 'next/link';
import {
  Banknote,
  ShoppingBag,
  Receipt,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { getDashboardStats } from '@/app/admin/dashboard-data';
import {
  OrdersByDayChart,
  StatusPie,
  TopProductsBar,
} from '@/components/admin/DashboardCharts';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Дашборд адмінки' };

function fmtMoney(n: number) {
  return `${n.toLocaleString('uk-UA')} ₴`;
}

function shortRef(id: string) {
  return id.split('-')[0]?.toUpperCase() ?? id;
}

/** Returns a percent delta and a direction. null when there's no prior data. */
function trend(current: number, prev: number): { pct: number; dir: 'up' | 'down' | 'flat' } | null {
  if (prev === 0 && current === 0) return null;
  if (prev === 0) return { pct: 100, dir: 'up' };
  const diff = current - prev;
  const pct = Math.round((diff / prev) * 100);
  if (pct === 0) return { pct: 0, dir: 'flat' };
  return { pct: Math.abs(pct), dir: pct > 0 ? 'up' : 'down' };
}

function TrendBadge({ t }: { t: ReturnType<typeof trend> }) {
  if (!t) return null;
  if (t.dir === 'flat') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-white/40">
        <Minus size={10} /> без змін
      </span>
    );
  }
  const Icon = t.dir === 'up' ? TrendingUp : TrendingDown;
  const cls = t.dir === 'up' ? 'text-emerald-400' : 'text-red-400';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] ${cls}`}>
      <Icon size={10} /> {t.pct}%
    </span>
  );
}

export default async function AdminDashboardPage() {
  const data = await getDashboardStats(30);

  const kpis: Array<{
    icon: typeof Banknote;
    label: string;
    value: string;
    trend: ReturnType<typeof trend>;
  }> = [
    {
      icon: Banknote,
      label: 'Виручка (30 днів)',
      value: fmtMoney(data.totalRevenue),
      trend: trend(data.totalRevenue, data.prevRevenue),
    },
    {
      icon: Receipt,
      label: 'Замовлень',
      value: String(data.ordersCount),
      trend: trend(data.ordersCount, data.prevOrdersCount),
    },
    {
      icon: ShoppingBag,
      label: 'Середній чек',
      value: fmtMoney(data.aov),
      trend: trend(data.aov, data.prevAov),
    },
    {
      icon: Clock,
      label: 'Очікують обробки',
      value: String(data.pending),
      trend: null,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-1 text-[10px] tracking-[0.2em] text-[#FF8A33]">// DASHBOARD</div>
        <h1 className="text-3xl font-medium tracking-tight">Адмін-панель KUKIRIN.UA</h1>
        <p className="mt-2 text-sm text-white/55">
          {data.productsCount} товарів · {data.categoriesCount} категорій · {data.ordersCount} замовлень за 30 днів
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, trend: t }) => (
          <div key={label} className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <Icon size={18} className="mb-3 text-[#FF6B00]" />
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] tracking-[0.2em] text-white/40">{label.toUpperCase()}</div>
              <TrendBadge t={t} />
            </div>
            <div className="mt-1 text-xl font-medium tracking-tight">{value}</div>
          </div>
        ))}
      </div>

      <section className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ЗАМОВЛЕННЯ ПО ДНЯХ</div>
        <OrdersByDayChart data={data.ordersByDay} />
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
          <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// СТАТУСИ</div>
          <StatusPie data={data.statusBreakdown} />
        </section>

        <section className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
          <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ТОП-ПРОДУКТИ (30 ДН.)</div>
          <TopProductsBar data={data.topProducts} />
        </section>
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
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between gap-3 py-3 transition hover:bg-white/[0.02]"
                >
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
                    <span className="font-medium text-[#FF6B00]">{fmtMoney(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
