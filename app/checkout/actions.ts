'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { TablesInsert } from '@/lib/types/database';

export type CheckoutItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: string;
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  items: CheckoutItem[];
};

export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

type ProductLookup = {
  id: string;
  slug: string;
  name: string;
  price: number;
  is_active: boolean;
};

function isValidPhone(s: string) {
  const cleaned = s.replace(/[\s\-()]/g, '');
  return /^(\+?380\d{9}|0\d{9})$/.test(cleaned);
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  try {
    const name = (input.customerName ?? '').trim();
    const phone = (input.customerPhone ?? '').trim();
    const email = (input.customerEmail ?? '').trim();
    const deliveryMethod = (input.deliveryMethod ?? '').trim();
    const deliveryAddress = (input.deliveryAddress ?? '').trim();
    const paymentMethod = (input.paymentMethod ?? '').trim();
    const notes = (input.notes ?? '').trim();

    if (name.length < 2) return { ok: false, error: 'Вкажіть імʼя.' };
    if (!isValidPhone(phone)) return { ok: false, error: 'Невірний формат телефону.' };
    if (email && !isValidEmail(email)) return { ok: false, error: 'Невірний формат email.' };
    if (!deliveryMethod) return { ok: false, error: 'Оберіть спосіб доставки.' };
    if (deliveryAddress.length < 3) return { ok: false, error: 'Вкажіть адресу доставки.' };
    if (!paymentMethod) return { ok: false, error: 'Оберіть спосіб оплати.' };

    if (!Array.isArray(input.items) || input.items.length === 0) {
      return { ok: false, error: 'Кошик порожній.' };
    }

    const supabase = createAdminClient();
    const slugs = Array.from(new Set(input.items.map((i) => i.slug)));

    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .select('id, slug, name, price, is_active')
      .in('slug', slugs);

    if (prodErr) {
      console.error('createOrder: products lookup failed', prodErr);
      return { ok: false, error: 'Помилка перевірки товарів. Спробуйте ще раз.' };
    }

    const prodRows = (prodData ?? []) as unknown as ProductLookup[];
    const bySlug = new Map<string, ProductLookup>(prodRows.map((p) => [p.slug, p]));

    for (const it of input.items) {
      const p = bySlug.get(it.slug);
      if (!p || !p.is_active) {
        return { ok: false, error: `Товар недоступний: ${it.slug}` };
      }
    }

    const lineItems = input.items.map((it) => {
      const p = bySlug.get(it.slug)!;
      const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
      const unit = Number(p.price);
      return {
        product_id: p.id,
        product_slug: p.slug,
        product_name: p.name,
        unit_price: unit,
        quantity: qty,
        subtotal: unit * qty,
      };
    });

    const subtotal = lineItems.reduce((s, x) => s + x.subtotal, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    const orderInsert: TablesInsert<'orders'> = {
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      delivery_method: deliveryMethod,
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      subtotal,
      shipping_cost: shippingCost,
      total,
      notes: notes || null,
    };

    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(orderInsert as any)
      .select('id, order_number')
      .single();

    if (orderErr || !orderData) {
      console.error('createOrder: insert failed', orderErr);
      return { ok: false, error: 'Не вдалось створити замовлення. Спробуйте ще раз.' };
    }

    const order = orderData as unknown as { id: string; order_number: string };

    const itemsInsert: TablesInsert<'order_items'>[] = lineItems.map((li) => ({
      order_id: order.id,
      product_id: li.product_id,
      product_slug: li.product_slug,
      product_name: li.product_name,
      unit_price: li.unit_price,
      quantity: li.quantity,
      subtotal: li.subtotal,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(itemsInsert as any);

    if (itemsErr) {
      console.error('createOrder: items insert failed', itemsErr);
      await supabase.from('orders').delete().eq('id', order.id);
      return { ok: false, error: 'Не вдалось зберегти товари замовлення.' };
    }

    return { ok: true, orderNumber: order.order_number };
  } catch (e) {
    console.error('createOrder: unexpected error', e);
    return { ok: false, error: 'Внутрішня помилка. Спробуйте пізніше.' };
  }
}
