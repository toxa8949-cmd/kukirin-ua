import Link from 'next/link';
import { Check, Phone } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Дякуємо за замовлення' };

type SuccessOrder = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  currency: string;
  created_at: string;
};

type SuccessItem = {
  product_name: string;
  product_slug: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

async function getOrderByNumber(orderNumber: string): Promise<{ order: SuccessOrder; items: SuccessItem[] } | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, status, customer_name, customer_phone, total, currency, created_at')
      .eq('order_number', orderNumber)
      .maybeSingle();
    if (error || !data) return null;
    const order = data as unknown as SuccessOrder;

    const { data: itemsData } = await supabase
      .from('order_items')
      .select('product_name, product_slug, unit_price, quantity, subtotal')
      .eq('order_id', order.id);

    const items = (itemsData ?? []) as unknown as SuccessItem[];

    return { order, items };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const data = await getOrderByNumber(orderNumber);

  return (
    <PageShell breadcrumb={`ORDER · ${orderNumber}`} title="Дякуємо за замовлення!">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-6">
          <div className="mb-2 flex items-center gap-2 text-emerald-300">
            <Check size={18} />
            <span className="text-sm font-medium">Замовлення прийнято</span>
          </div>
          <p className="text-sm text-white/70">
            Менеджер передзвонить протягом 15 хвилин для підтвердження. Номер вашого замовлення:
          </p>
          <div className="mt-2 text-2xl font-medium tracking-tight text-[#FF6B00]">
            {orderNumber}
          </div>
        </div>

        {data ? (
          <>
            <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#FF8A33]">// КЛІЄНТ</div>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-white/45">Імʼя</dt>
                  <dd>{data.order.customer_name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/45">Телефон</dt>
                  <dd>{data.order.customer_phone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/45">Статус</dt>
                  <dd className="uppercase tracking-wider text-[#FF6B00]">{data.order.status}</dd>
                </div>
                <div>
                  <dt className="text-xs text-white/45">Сума</dt>
                  <dd className="font-medium text-[#FF6B00]">{Number(data.order.total).toLocaleString('uk-UA')} ₴</dd>
                </div>
              </dl>
            </div>

            {data.items.length > 0 && (
              <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
                <div className="mb-3 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ТОВАРИ</div>
                <ul className="space-y-2 text-sm">
                  {data.items.map((it, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div>
                        {it.product_slug ? (
                          <Link href={`/product/${it.product_slug}`} className="hover:text-[#FF6B00]">
                            {it.product_name}
                          </Link>
                        ) : (
                          <span>{it.product_name}</span>
                        )}
                        <div className="text-xs text-white/45">
                          {it.quantity} × {Number(it.unit_price).toLocaleString('uk-UA')} ₴
                        </div>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {Number(it.subtotal).toLocaleString('uk-UA')} ₴
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5 text-sm text-white/55">
            Деталі замовлення можна уточнити у менеджера за номером нижче.
          </div>
        )}

        <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
          <div className="mb-3 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ПІДТРИМКА</div>
          <p className="text-sm text-white/70">
            Якщо потрібно щось змінити — напишіть або зателефонуйте.
          </p>
          <a
            href="tel:+380800338899"
            className="mt-3 inline-flex items-center gap-2 text-sm text-[#FF6B00] hover:underline"
          >
            <Phone size={14} /> 0 800 33 88 99
          </a>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-xs font-medium tracking-wide hover:border-white/50"
          >
            Продовжити покупки
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]"
          >
            На головну
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
