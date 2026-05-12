import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderItem, OrderWithItems, TablesUpdate } from "@/lib/types/database";

/**
 * NB: orders are written from the public checkout (anon insert allowed by RLS)
 * but READING them requires service_role, because anon RLS has no read policy.
 * All functions here use the admin client and must only be called from
 * the admin area (guarded by middleware is_admin check).
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
  let q = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filter.status) q = q.eq("status", filter.status);
  if (filter.search && filter.search.trim()) {
    const s = `%${filter.search.trim()}%`;
    q = q.or(
      `customer_name.ilike.${s},customer_phone.ilike.${s},customer_email.ilike.${s},order_number.ilike.${s}`,
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
  const { data, error } = await supabase
    .from("orders")
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
  const patch: TablesUpdate<"orders"> = { status };
  const { error } = await supabase
    .from("orders")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(patch as any)
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
        .select("product_slug,product_name,quantity,subtotal,created_at")
        .gte("created_at", since),
    ]);

  if (oerr) console.error("[getOrderStats orders]", oerr);
  if (ierr) console.error("[getOrderStats items]", ierr);

  const ordersList = (orders ?? []) as unknown as Array<
    Pick<Order, "id" | "status" | "total" | "created_at">
  >;
  const itemsList = (items ?? []) as unknown as Array<
    Pick<OrderItem, "product_slug" | "product_name" | "quantity" | "subtotal" | "created_at">
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

  const top = new Map<string, { slug: string; name: string; quantity: number; revenue: number }>();
  for (const it of itemsList) {
    const key = it.product_slug ?? it.product_name;
    if (!key) continue;
    const cur = top.get(key) ?? {
      slug: it.product_slug ?? "",
      name: it.product_name,
      quantity: 0,
      revenue: 0,
    };
    cur.quantity += Number(it.quantity ?? 0);
    cur.revenue += Number(it.subtotal ?? 0);
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
