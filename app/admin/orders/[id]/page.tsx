import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import OrderActions from '@/components/admin/OrderActions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Замовлення' };

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  total: number | string;
  status: string;
  notes: string | null;
  created_at: string | null;
};

type ItemRow = {
  id: string;
  product_id: string | null;
  name_snapshot: string;
  price_snapshot: number | string;
  quantity: number;
};

function shortRef(id: string) {
  return id.split('-')[0]?.toUpperCase() ?? id;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: orderData }, { data: itemsData }] = await Promise.all([
    supabase
      .from('orders')
      .select('id, customer_name, phone, email, address, total, status, notes, created_at')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('order_items')
      .select('id, product_id, name_snapshot, price_snapshot, quantity')
      .eq('order_id', id),
  ]);

  if (!orderData) notFound();
  const order = orderData as unknown as OrderRow;
  const items = (itemsData ?? []) as unknown as ItemRow[];

  // Resolve slugs for items so we can link back to product pages.
  const productIds = items
    .map((i) => i.product_id)
    .filter((v): v is string => typeof v === 'string');
  const slugMap = new Map<string, string>();
  if (productIds.length > 0) {
    const { data: prods } = await supabase
      .from('products')
      .select('id, slug')
      .in('id', productIds);
    for (const p of (prods ?? []) as Array<{ id: string; slug: string }>) {
      slugMap.set(p.id, p.slug);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">
            <ArrowLeft size={12} /> До списку
          </Link>
          <div className="mt-2 mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ORDER</div>
          <h1 className="text-3xl font-medium tracking-tight">
            #<span>{shortRef(order.id)}</span>
          </h1>
          {order.created_at && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#6C6A65] dark:text-white/45">
              <Calendar size={12} /> {new Date(order.created_at).toLocaleString('uk-UA')}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Customer */}
          <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// КЛІЄНТ</div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-[#6C6A65] dark:text-white/45">Імʼя</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#6C6A65] dark:text-white/45">Телефон</dt>
                <dd>
                  <a
                    href={`tel:${order.phone}`}
                    className="inline-flex items-center gap-1 hover:text-[#FF6B00]"
                  >
                    <Phone size={12} /> {order.phone}
                  </a>
                </dd>
              </div>
              {order.email && (
                <div>
                  <dt className="text-xs text-[#6C6A65] dark:text-white/45">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${order.email}`}
                      className="inline-flex items-center gap-1 hover:text-[#FF6B00]"
                    >
                      <Mail size={12} /> {order.email}
                    </a>
                  </dd>
                </div>
              )}
              {order.address && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-[#6C6A65] dark:text-white/45">Адреса</dt>
                  <dd className="inline-flex items-start gap-1">
                    <MapPin size={12} className="mt-1 flex-shrink-0 text-[#6C6A65] dark:text-white/40" />
                    <span>{order.address}</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Items */}
          <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ТОВАРИ</div>
            {items.length === 0 ? (
              <p className="text-sm text-[#4A4A48] dark:text-white/55">Без товарів.</p>
            ) : (
              <ul className="divide-y divide-white/5 text-sm">
                {items.map((it) => {
                  const slug = it.product_id ? slugMap.get(it.product_id) : undefined;
                  const sub = Number(it.price_snapshot) * Number(it.quantity);
                  return (
                    <li
                      key={it.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div>
                        {slug ? (
                          <Link
                            href={`/product/${slug}`}
                            target="_blank"
                            className="hover:text-[#FF6B00]"
                          >
                            {it.name_snapshot}
                          </Link>
                        ) : (
                          <span>{it.name_snapshot}</span>
                        )}
                        <div className="text-xs text-[#6C6A65] dark:text-white/45">
                          {it.quantity} × {Number(it.price_snapshot).toLocaleString('uk-UA')} ₴
                        </div>
                      </div>
                      <div className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                        {sub.toLocaleString('uk-UA')} ₴
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-[#E8E6DE] dark:border-white/10 pt-3 text-base font-medium">
              <span>Сума</span>
              <span className="text-[#FF6B00]">
                {Number(order.total).toLocaleString('uk-UA')} ₴
              </span>
            </div>
          </section>

          {/* Notes / history */}
          <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
              // ДЕТАЛІ ТА ІСТОРІЯ
            </div>
            {order.notes ? (
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#4A4A48] dark:text-white/65">
                {order.notes}
              </pre>
            ) : (
              <p className="text-sm text-[#4A4A48] dark:text-white/55">Нотаток ще немає.</p>
            )}
          </section>
        </div>

        {/* Right column: actions */}
        <aside className="space-y-5">
          <OrderActions
            id={order.id}
            currentStatus={order.status}
          />
        </aside>
      </div>
    </div>
  );
}
