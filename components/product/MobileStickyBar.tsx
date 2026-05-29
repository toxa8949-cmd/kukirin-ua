'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';

/**
 * Sticky bottom bar для сторінки товара — лише на мобільному.
 *
 * Поведінка:
 * - Стежить за вказаним елементом (primary CTA) через IntersectionObserver
 * - Коли primary CTA НЕ у viewport → показуємо bar внизу екрану
 * - Коли видний → ховаємо (щоб не дублювати кнопки)
 *
 * Все на CSS transitions, без бібліотек.
 */
export default function MobileStickyBar({
  triggerSelector,
  slug,
  name,
  price,
  oldPrice,
  image,
}: {
  triggerSelector: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.querySelector(triggerSelector);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Показуємо bar, коли primary CTA пішла з viewport
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [triggerSelector]);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E8E6DE] bg-white/95 backdrop-blur transition-transform duration-300 dark:border-white/10 dark:bg-[#0A0A0A]/95 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-shrink">
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-medium text-[#FF6B00]">
              {Number(price).toLocaleString('uk-UA')} ₴
            </div>
            {oldPrice ? (
              <div className="text-xs text-[#6C6A65] line-through dark:text-white/30">
                {Number(oldPrice).toLocaleString('uk-UA')} ₴
              </div>
            ) : null}
          </div>
          <div className="truncate text-[10px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">
            {name}
          </div>
        </div>

        <a
          href="tel:+380958981007"
          aria-label="Зателефонувати"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#4A4A48] dark:border-white/15 dark:text-white/70"
        >
          <Phone size={16} />
        </a>

        <div className="flex-1">
          <AddToCartButton slug={slug} name={name} price={price} image={image} />
        </div>
      </div>
    </div>
  );
}
