'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import {
  useCart,
  updateQuantity,
  removeItem,
  clearCart,
  cartTotals,
} from '@/lib/store/cart';

export default function CartView() {
  // Avoid hydration mismatch: server renders empty, client fills after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { items } = useCart();
  const { subtotal, count } = cartTotals(items);

  if (!mounted) {
    return (
      <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-8 text-center text-sm text-white/55">
        Завантаження кошика…
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-white/10 bg-[#0F0F0F] p-8 text-center sm:p-12">
        <ShoppingCart size={40} className="mx-auto mb-4 text-[#FF6B00]" />
        <h2 className="mb-2 text-xl font-medium sm:text-2xl">Ваш кошик порожній</h2>
        <p className="mb-6 text-sm text-white/55">
          Додайте електросамокат або аксесуар із каталогу — вони відобразяться тут.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]"
          >
            ДО КАТАЛОГУ <ArrowRight size={14} />
          </Link>
          <Link
            href="/accessories"
            className="inline-flex items-center justify-center rounded-sm border border-white/25 px-6 py-3 text-xs font-medium tracking-wide hover:border-white/50"
          >
            Аксесуари
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      {/* Items list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex gap-4 rounded-sm border border-white/10 bg-[#0F0F0F] p-4"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-[10px] tracking-[0.2em] text-white/30">KUKIRIN</span>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-medium hover:text-[#FF6B00]"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  aria-label="Видалити"
                  className="text-white/40 transition hover:text-[#FF6B00]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center rounded-sm border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    aria-label="Менше"
                    className="px-2 py-1 text-white/70 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[28px] text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    aria-label="Більше"
                    className="px-2 py-1 text-white/70 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-sm font-medium text-[#FF6B00]">
                  {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => clearCart()}
          className="text-xs text-white/40 underline-offset-4 hover:text-[#FF6B00] hover:underline"
        >
          Очистити кошик
        </button>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
        <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// SUMMARY</div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-white/70">
            <dt>Товарів</dt>
            <dd>{count}</dd>
          </div>
          <div className="flex justify-between text-white/70">
            <dt>Доставка</dt>
            <dd>розраховується при оформленні</dd>
          </div>
          <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base font-medium">
            <dt>До сплати</dt>
            <dd className="text-[#FF6B00]">{subtotal.toLocaleString('uk-UA')} ₴</dd>
          </div>
        </dl>
        <Link
          href="/checkout"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]"
        >
          ОФОРМИТИ ЗАМОВЛЕННЯ <ArrowRight size={14} />
        </Link>
        <Link
          href="/catalog"
          className="mt-3 inline-flex w-full items-center justify-center rounded-sm border border-white/15 px-6 py-3 text-xs tracking-wide hover:border-white/40"
        >
          Продовжити покупки
        </Link>
      </aside>
    </div>
  );
}
