'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import {
  useCart,
  cartTotals,
  clearCart,
  type CartItem,
} from '@/lib/store/cart';
import { createOrder, type CheckoutInput } from '@/app/checkout/actions';

const DELIVERY_OPTIONS = [
  { value: 'nova-poshta', label: 'Нова Пошта (відділення)' },
  { value: 'nova-poshta-courier', label: 'Нова Пошта (адресна)' },
  { value: 'ukrposhta', label: 'Укрпошта' },
  { value: 'self-pickup', label: 'Самовивіз (Київ)' },
];

const PAYMENT_OPTIONS = [
  { value: 'cod', label: 'Накладений платіж' },
  { value: 'card', label: 'Картка онлайн' },
  { value: 'installment', label: 'Розстрочка' },
];

type Errors = Partial<Record<keyof CheckoutInput | 'submit', string>>;

export default function CheckoutForm() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items } = useCart();
  const { subtotal, count } = cartTotals(items);

  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryMethod: DELIVERY_OPTIONS[0].value,
    deliveryAddress: '',
    paymentMethod: PAYMENT_OPTIONS[0].value,
    notes: '',
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, submit: undefined }));
  }

  if (!mounted) {
    return (
      <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-8 text-sm text-[#4A4A48] dark:text-white/55">
        Завантаження…
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-8 text-center sm:p-12">
        <ShoppingCart size={36} className="mx-auto mb-4 text-[#FF6B00]" />
        <h2 className="mb-2 text-lg font-medium">Кошик порожній</h2>
        <p className="mb-5 text-sm text-[#4A4A48] dark:text-white/55">Спочатку додайте товар у кошик.</p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33]"
        >
          ДО КАТАЛОГУ <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CheckoutInput = {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || undefined,
      deliveryMethod: form.deliveryMethod,
      deliveryAddress: form.deliveryAddress,
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
      items: items.map((it: CartItem) => ({
        slug: it.slug,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
    };

    startTransition(async () => {
      const res = await createOrder(payload);
      if (res.ok) {
        clearCart();
        router.push(`/checkout/success/${encodeURIComponent(res.orderNumber)}`);
      } else {
        setErrors({ submit: res.error });
      }
    });
  }

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] px-3 py-2.5 text-sm outline-none transition focus:border-[#FF6B00]';

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      {/* Form */}
      <div className="space-y-6">
        <fieldset className="space-y-3 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
          <legend className="px-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// КОНТАКТНІ ДАНІ</legend>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Імʼя та прізвище*</span>
            <input
              type="text"
              autoComplete="name"
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
              className={inputCls}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Телефон*</span>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+380 67 123 45 67"
              value={form.customerPhone}
              onChange={(e) => update('customerPhone', e.target.value)}
              className={inputCls}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Email (за бажанням)</span>
            <input
              type="email"
              autoComplete="email"
              value={form.customerEmail}
              onChange={(e) => update('customerEmail', e.target.value)}
              className={inputCls}
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
          <legend className="px-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ДОСТАВКА</legend>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Спосіб доставки*</span>
            <select
              value={form.deliveryMethod}
              onChange={(e) => update('deliveryMethod', e.target.value)}
              className={inputCls}
              required
            >
              {DELIVERY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Місто та адреса/відділення*</span>
            <input
              type="text"
              autoComplete="street-address"
              placeholder="Київ, відділення №5"
              value={form.deliveryAddress}
              onChange={(e) => update('deliveryAddress', e.target.value)}
              className={inputCls}
              required
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
          <legend className="px-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ОПЛАТА</legend>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Спосіб оплати*</span>
            <select
              value={form.paymentMethod}
              onChange={(e) => update('paymentMethod', e.target.value)}
              className={inputCls}
              required
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#4A4A48] dark:text-white/55">Коментар до замовлення</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </label>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="h-fit space-y-4 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
        <div className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ВАШЕ ЗАМОВЛЕННЯ</div>
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.slug} className="flex items-start justify-between gap-3 border-b border-[#E8E6DE] dark:border-white/5 pb-2">
              <div>
                <div className="text-sm">{it.name}</div>
                <div className="text-xs text-[#6C6A65] dark:text-white/45">{it.quantity} × {it.price.toLocaleString('uk-UA')} ₴</div>
              </div>
              <div className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                {(it.price * it.quantity).toLocaleString('uk-UA')} ₴
              </div>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between text-[#4A4A48] dark:text-white/70">
            <dt>Сума</dt>
            <dd>{subtotal.toLocaleString('uk-UA')} ₴</dd>
          </div>
          <div className="flex justify-between text-[#4A4A48] dark:text-white/70">
            <dt>Доставка</dt>
            <dd>при отриманні</dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#E8E6DE] dark:border-white/10 pt-2 text-base font-medium">
            <dt>До сплати</dt>
            <dd className="text-[#FF6B00]">{subtotal.toLocaleString('uk-UA')} ₴</dd>
          </div>
        </dl>

        {errors.submit && (
          <div className="rounded-sm border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black transition hover:bg-[#FF8A33] disabled:opacity-60"
        >
          {isPending ? 'ВІДПРАВЛЯЄМО…' : 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'}
          {!isPending && <ArrowRight size={14} />}
        </button>
        <p className="text-[10px] leading-relaxed text-[#6C6A65] dark:text-white/40">
          Підтверджуючи замовлення, ви погоджуєтесь з{' '}
          <Link href="/terms" className="underline hover:text-[#FF6B00]">умовами користування</Link>
          {' '}і{' '}
          <Link href="/privacy" className="underline hover:text-[#FF6B00]">політикою конфіденційності</Link>.
        </p>
      </aside>
    </form>
  );
}
