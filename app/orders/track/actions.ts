'use server';

import { createAdminClient } from '@/lib/supabase/admin';

type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'completed' | 'canceled' | string;

export type TrackedOrder = {
  id: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  total: number;
  notes: string | null;
  createdAt: string | null;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    slug: string | null;
  }>;
};

export type LookupResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; error: string };

/**
 * Нормалізує телефон до 10 останніх цифр.
 * "+380958981007" / "0958981007" / "(095) 898-10-07" → "0958981007"
 */
function normalizePhone(s: string): string {
  const digits = s.replace(/\D/g, '');
  return digits.slice(-10);
}

// Простий затримка 400-800ms для анти-brute (повільніше підбирати, якщо ніхто не лімітує)
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Lookup замовлення за прийнятим номером + телефоном.
 *
 * Безпека:
 *   - Використовує admin-клієнт (обходить RLS), валідуємо самі
 *   - Загальна помилка "не знайдено" якщо телефон не співпадає —
 *     щоб не виявляти існування замовлення
 *   - Затримка 400-800ms запобігає швидкому brute force
 */
export async function lookupOrder(
  orderInput: string,
  phoneInput: string,
): Promise<LookupResult> {
  await delay(400 + Math.floor(Math.random() * 400));

  const orderQuery = orderInput.trim().toLowerCase();
  const phoneNorm = normalizePhone(phoneInput);

  if (orderQuery.length < 6) {
    return { ok: false, error: 'Введіть мінімум 6 символів номера замовлення.' };
  }
  if (phoneNorm.length !== 10) {
    return { ok: false, error: 'Введіть телефон у форматі 0XX XXX XX XX.' };
  }

  try {
    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase
      .from('orders')
      .select('id, status, customer_name, phone, total, notes, created_at');

    // Якщо введено повний UUID — точне співпадіння; інакше — префікс
    const isFullUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      orderQuery,
    );
    if (isFullUuid) {
      q = q.eq('id', orderQuery);
    } else {
      q = q.ilike('id', `${orderQuery}%`);
    }

    const { data, error } = await q.maybeSingle();
    if (error || !data) {
      return { ok: false, error: 'Замовлення не знайдено. Перевірте номер і телефон.' };
    }

    // Перевірка телефону
    if (normalizePhone(String(data.phone ?? '')) !== phoneNorm) {
      return { ok: false, error: 'Замовлення не знайдено. Перевірте номер і телефон.' };
    }

    // Підтягуємо позиції замовлення
    const { data: itemsData } = await supabase
      .from('order_items')
      .select('name_snapshot, price_snapshot, quantity, product_id')
      .eq('order_id', data.id);

    type ItemRow = { name_snapshot: string; price_snapshot: number; quantity: number; product_id: string | null };
    const itemRows = (itemsData ?? []) as unknown as ItemRow[];

    // Resolve slugs для лінків на товари
    const productIds = itemRows
      .map((i) => i.product_id)
      .filter((x): x is string => !!x);
    const slugMap = new Map<string, string>();
    if (productIds.length) {
      const { data: prods } = await supabase
        .from('products')
        .select('id, slug')
        .in('id', productIds);
      for (const p of ((prods ?? []) as Array<{ id: string; slug: string }>)) {
        slugMap.set(p.id, p.slug);
      }
    }

    const items = itemRows.map((i) => ({
      name: i.name_snapshot,
      price: Number(i.price_snapshot),
      quantity: i.quantity,
      slug: i.product_id ? slugMap.get(i.product_id) ?? null : null,
    }));

    return {
      ok: true,
      order: {
        id: String(data.id),
        status: String(data.status ?? 'new'),
        customerName: String(data.customer_name ?? ''),
        phone: String(data.phone ?? ''),
        total: Number(data.total ?? 0),
        notes: data.notes ?? null,
        createdAt: data.created_at ?? null,
        items,
      },
    };
  } catch (e) {
    console.error('[lookupOrder]', e);
    return { ok: false, error: 'Тимчасова помилка. Спробуйте за хвилину.' };
  }
}
