import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export type DashboardStats = {
  // current-period KPIs
  totalRevenue: number;
  ordersCount: number;
  aov: number;
  pending: number;

  // previous-period for trend comparison
  prevRevenue: number;
  prevOrdersCount: number;
  prevAov: number;

  // chart datasets
  ordersByDay: Array<{ date: string; label: string; orders: number; revenue: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  recent: Array<{
    id: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string | null;
  }>;

  // counters
  productsCount: number;
  categoriesCount: number;
};

type OrderLite = {
  id: string;
  status: string;
  total: number | string;
  created_at: string | null;
};

type ItemLite = {
  order_id: string;
  name_snapshot: string;
  price_snapshot: number | string;
  quantity: number;
};

function dayKey(iso: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 10); // YYYY-MM-DD
}

function dayLabel(iso: string): string {
  // 'YYYY-MM-DD' -> 'DD.MM'
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

export async function getDashboardStats(periodDays = 30): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const now = Date.now();
  const periodStart = new Date(now - periodDays * 86_400_000).toISOString();
  const prevStart = new Date(now - 2 * periodDays * 86_400_000).toISOString();

  // Pull EVERYTHING relevant in parallel.
  const [
    { data: ordersAll },
    { data: itemsAll },
    { count: productsCount },
    { count: categoriesCount },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id, status, total, created_at')
      .gte('created_at', prevStart)
      .order('created_at', { ascending: false }),
    supabase
      .from('order_items')
      .select('order_id, name_snapshot, price_snapshot, quantity'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ]);

  const orders = (ordersAll ?? []) as unknown as OrderLite[];
  const items = (itemsAll ?? []) as unknown as ItemLite[];

  // Split into current vs previous period.
  const current: OrderLite[] = [];
  const previous: OrderLite[] = [];
  for (const o of orders) {
    if (!o.created_at) continue;
    if (o.created_at >= periodStart) current.push(o);
    else previous.push(o);
  }

  const sumTotal = (xs: OrderLite[]) => xs.reduce((s, o) => s + Number(o.total ?? 0), 0);
  const totalRevenue = sumTotal(current);
  const prevRevenue = sumTotal(previous);
  const ordersCount = current.length;
  const prevOrdersCount = previous.length;
  const aov = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0;
  const prevAov = prevOrdersCount > 0 ? Math.round(prevRevenue / prevOrdersCount) : 0;
  const pending = current.filter((o) => o.status === 'new' || o.status === 'confirmed').length;

  // Orders by day for current period.
  const byDay = new Map<string, { date: string; label: string; orders: number; revenue: number }>();
  for (let i = periodDays - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000).toISOString().slice(0, 10);
    byDay.set(d, { date: d, label: dayLabel(d), orders: 0, revenue: 0 });
  }
  for (const o of current) {
    const k = dayKey(o.created_at);
    const bucket = byDay.get(k);
    if (bucket) {
      bucket.orders += 1;
      bucket.revenue += Number(o.total ?? 0);
    }
  }
  const ordersByDay = Array.from(byDay.values());

  // Status breakdown (all-time).
  const statusMap = new Map<string, number>();
  for (const o of orders) {
    statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
  }
  const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));

  // Top products (current period only).
  const currentOrderIds = new Set(current.map((o) => o.id));
  const topMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const it of items) {
    if (!currentOrderIds.has(it.order_id)) continue;
    const key = it.name_snapshot;
    if (!key) continue;
    const cur = topMap.get(key) ?? { name: it.name_snapshot, quantity: 0, revenue: 0 };
    const qty = Number(it.quantity ?? 0);
    cur.quantity += qty;
    cur.revenue += Number(it.price_snapshot ?? 0) * qty;
    topMap.set(key, cur);
  }
  const topProducts = Array.from(topMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent orders (last 5 for quick glance).
  const recent = current.slice(0, 5).map((o) => ({
    id: o.id,
    customer_name: '',
    total: Number(o.total ?? 0),
    status: o.status,
    created_at: o.created_at,
  }));

  // Hydrate customer names for the recent list (one extra small query).
  if (recent.length > 0) {
    const ids = recent.map((r) => r.id);
    const { data: named } = await supabase
      .from('orders')
      .select('id, customer_name')
      .in('id', ids);
    const nameMap = new Map<string, string>();
    for (const n of (named ?? []) as Array<{ id: string; customer_name: string }>) {
      nameMap.set(n.id, n.customer_name);
    }
    for (const r of recent) r.customer_name = nameMap.get(r.id) ?? '';
  }

  return {
    totalRevenue,
    ordersCount,
    aov,
    pending,
    prevRevenue,
    prevOrdersCount,
    prevAov,
    ordersByDay,
    statusBreakdown,
    topProducts,
    recent,
    productsCount: productsCount ?? 0,
    categoriesCount: categoriesCount ?? 0,
  };
}
