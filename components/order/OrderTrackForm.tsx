'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Search, Phone, ArrowLeft } from 'lucide-react';
import OrderStatusTimeline from './OrderStatusTimeline';
import { lookupOrder, type TrackedOrder } from '@/app/orders/track/actions';

export default function OrderTrackForm() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderNum, setOrderNum] = useState('');
  const [phone, setPhone] = useState('');
  const [isPending, startTransition] = useTransition();

  function reset() {
    setOrder(null);
    setError(null);
  }

  function onSubmit(formData: FormData) {
    const num = String(formData.get('order') ?? '').trim();
    const ph = String(formData.get('phone') ?? '').trim();
    setError(null);
    startTransition(async () => {
      const res = await lookupOrder(num, ph);
      if (res.ok) {
        setOrder(res.order);
      } else {
        setError(res.error);
        setOrder(null);
      }
    });
  }

  if (order) {
    return (
      <div>
        <button
          type="button"
          onClick={reset}
          className="mb-6 inline-flex items-center gap-1 text-xs text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/60 dark:hover:text-white"
        >
          <ArrowLeft size={12} /> Перевірити інше замовлення
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Ліва — статус + items */}
          <div>
            <div className="mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
              // ЗАМОВЛЕННЯ #{order.id.slice(0, 8).toUpperCase()}
            </div>
            <h2 className="mb-1 text-2xl font-medium tracking-tight sm:text-3xl">
              Привіт, {order.customerName.split(' ')[0]}!
            </h2>
            {order.createdAt && (
              <p className="mb-6 text-sm text-[#6C6A65] dark:text-white/55">
                Замовлено {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            )}

            <div className="rounded-sm border border-[#E8E6DE] bg-white p-6 dark:border-white/10 dark:bg-[#0F0F0F]">
              <OrderStatusTimeline status={order.status} />
            </div>

            {/* Items */}
            <div className="mt-6">
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">
                // СКЛАД ЗАМОВЛЕННЯ
              </div>
              <ul className="space-y-2">
                {order.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-sm border border-[#E8E6DE] bg-white p-4 dark:border-white/10 dark:bg-[#0F0F0F]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">
                        {it.slug ? (
                          <Link
                            href={`/product/${it.slug}`}
                            className="hover:text-[#993C1D] dark:hover:text-[#FF8A33]"
                          >
                            {it.name}
                          </Link>
                        ) : (
                          it.name
                        )}
                      </div>
                      <div className="mt-1 text-xs text-[#6C6A65] dark:text-white/45">
                        {it.quantity} × {it.price.toLocaleString('uk-UA')} ₴
                      </div>
                    </div>
                    <div className="text-sm font-medium text-[#FF6B00]">
                      {(it.price * it.quantity).toLocaleString('uk-UA')} ₴
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t border-[#E8E6DE] pt-4 dark:border-white/10">
                <span className="text-sm text-[#4A4A48] dark:text-white/55">Разом:</span>
                <span className="text-2xl font-medium text-[#FF6B00]">
                  {order.total.toLocaleString('uk-UA')} ₴
                </span>
              </div>
            </div>
          </div>

          {/* Права — контакти */}
          <aside className="space-y-4">
            <div className="rounded-sm border border-[#E8E6DE] bg-[#FAFAF7] p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
                // ПОТРІБНА ДОПОМОГА?
              </div>
              <p className="mb-4 text-xs leading-relaxed text-[#4A4A48] dark:text-white/55">
                Питання щодо замовлення? Менеджер відповість телефоном або у Telegram.
              </p>
              <a
                href="tel:+380958981007"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] dark:text-black"
              >
                <Phone size={14} />
                0 (95) 898-10-07
              </a>
              <p className="mt-3 text-center text-[10px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">
                ЩОДНЯ 9:30–16:30
              </p>
            </div>

            {order.notes && (
              <div className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
                <div className="mb-2 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">
                  // ДЕТАЛІ ДОСТАВКИ
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#4A4A48] dark:text-white/55">
                  {order.notes}
                </pre>
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  // ============ Форма пошуку ============
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-sm border border-[#E8E6DE] bg-white p-6 dark:border-white/10 dark:bg-[#0F0F0F] sm:p-8">
        <div className="mb-1 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
          // ПЕРЕВІРКА СТАТУСУ
        </div>
        <h2 className="mb-2 text-2xl font-medium tracking-tight">Знайти замовлення</h2>
        <p className="mb-6 text-sm text-[#4A4A48] dark:text-white/55">
          Введіть номер замовлення з листа підтвердження та телефон, який ви вказували при оформленні.
        </p>

        <form action={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="order" className="mb-2 block text-xs font-medium tracking-[0.1em] text-[#4A4A48] dark:text-white/70">
              НОМЕР ЗАМОВЛЕННЯ *
            </label>
            <input
              id="order"
              name="order"
              type="text"
              required
              minLength={6}
              autoComplete="off"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value)}
              placeholder="наприклад d3f8a1c2"
              className="w-full rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-base text-[#1a1a1a] placeholder:text-[#6C6A65] outline-none focus:border-[#FF6B00] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white dark:placeholder:text-white/30"
            />
            <p className="mt-1 text-[10px] text-[#6C6A65] dark:text-white/40">
              Можна ввести перші 6–8 символів номера
            </p>
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-medium tracking-[0.1em] text-[#4A4A48] dark:text-white/70">
              ТЕЛЕФОН *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+380 95 898 10 07"
              className="w-full rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-base text-[#1a1a1a] placeholder:text-[#6C6A65] outline-none focus:border-[#FF6B00] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          {error && (
            <div className="rounded-sm border border-[#D43838] bg-[#FFF5F5] p-3 text-xs text-[#9A1F1F]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] disabled:opacity-60 dark:text-black"
          >
            <Search size={14} />
            {isPending ? 'ШУКАЄМО...' : 'ПЕРЕВІРИТИ СТАТУС'}
          </button>
        </form>

        <p className="mt-5 border-t border-[#E8E6DE] pt-4 text-center text-[10px] leading-relaxed text-[#6C6A65] dark:border-white/10 dark:text-white/40">
          Загубили номер? Зателефонуйте{' '}
          <a href="tel:+380958981007" className="text-[#FF6B00] hover:underline">
            0 (95) 898-10-07
          </a>{' '}
          — менеджер знайде ваше замовлення.
        </p>
      </div>
    </div>
  );
}
