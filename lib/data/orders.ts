import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem, OrderWithItems } from "@/lib/types/database";

/**
 * NB: orders are written from the public checkout (anon insert allowed by RLS)
 * but READING them requires service_role, because anon RLS has no read policy.
 * All functions here use the admin client and must only be called from
 * the admin area (guarded by middleware is_admin check).
 *
 * Real schema:
 *   orders(id, customer_name, phone, email, address, total, status, notes, created_at)
 *   order_items(id, order_id, product_id, name_snapshot, price_snapshot, quantity)
 */

export type OrderFilter = {
  status?: Order["status"];
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listOrders(filter: OrderFilter = {}): Promise<{
  rows: Order[];
  total: number;
}> {
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filter.status) q = q.eq("status", filter.status);
  if (filter.search && filter.search.trim()) {
    const s = `%${filter.search.trim()}%`;
    q = q.or(
      `customer_name.ilike.${s},phone.ilike.${s},email.ilike.${s},id.ilike.${s}`,
    );
  }
  if (typeof filter.limit === "number") {
    const from = filter.offset ?? 0;
    q = q.range(from, from + filter.limit - 1);
  }

  const { data, error, count } = await q;
  if (error) {
    console.error("[listOrders]", error);
    return { rows: [], total: 0 };
  }
  return { rows: (data ?? []) as unknown as Order[], total: count ?? 0 };
}

export async function getOrder(id: string): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase
    .from("orders") as any)
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[getOrder]", error);
    return null;
  }
  return data as unknown as OrderWithItems | null;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("orders") as any)
    .update({ status })
    .eq("id", id);
  if (error) {
    console.error("[updateOrderStatus]", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/** Dashboard helpers. */
export async function getOrderStats(days = 30) {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  const [{ data: orders, error: oerr }, { data: items, error: ierr }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id,status,total,created_at")
        .gte("created_at", since),
      supabase
        .from("order_items")
        .select("order_id,product_id,name_snapshot,price_snapshot,quantity"),
    ]);

  if (oerr) console.error("[getOrderStats orders]", oerr);
  if (ierr) console.error("[getOrderStats items]", ierr);

  const ordersList = (orders ?? []) as unknown as Array<
    Pick<Order, "id" | "status" | "total" | "created_at">
  >;
  const itemsList = (items ?? []) as unknown as Array<
    Pick<OrderItem, "order_id" | "product_id" | "name_snapshot" | "price_snapshot" | "quantity">
  >;

  const totalRevenue = ordersList.reduce((s, o) => s + Number(o.total ?? 0), 0);
  const ordersCount = ordersList.length;
  const aov = ordersCount > 0 ? totalRevenue / ordersCount : 0;
  const pending = ordersList.filter(
    (o) => o.status === "new" || o.status === "confirmed",
  ).length;

  const byDay = new Map<string, { date: string; orders: number; revenue: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    byDay.set(d, { date: d, orders: 0, revenue: 0 });
  }
  for (const o of ordersList) {
    const d = (o.created_at ?? "").slice(0, 10);
    const bucket = byDay.get(d);
    if (bucket) {
      bucket.orders += 1;
      bucket.revenue += Number(o.total ?? 0);
    }
  }
  const ordersByDay = Array.from(byDay.values());

  // Build a set of order_ids in our window so we can scope item aggregation.
  const recentOrderIds = new Set(ordersList.map((o) => o.id));

  const top = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const it of itemsList) {
    if (!recentOrderIds.has(it.order_id)) continue;
    const key = it.name_snapshot;
    if (!key) continue;
    const cur = top.get(key) ?? {
      name: it.name_snapshot,
      quantity: 0,
      revenue: 0,
    };
    const qty = Number(it.quantity ?? 0);
    cur.quantity += qty;
    cur.revenue += Number(it.price_snapshot ?? 0) * qty;
    top.set(key, cur);
  }
  const topProducts = Array.from(top.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalRevenue,
    ordersCount,
    aov,
    pending,
    ordersByDay,
    topProducts,
  };
}
