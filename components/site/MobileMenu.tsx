'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';

type NavItem = { href: string; label: string };

const DEFAULT_NAV: NavItem[] = [
  { href: '/catalog',     label: 'Самокати' },
  { href: '/accessories', label: 'Аксесуари' },
  { href: '/service',     label: 'Сервіс' },
  { href: '/test-drive',  label: 'Тест-драйв' },
  { href: '/delivery',    label: 'Доставка й оплата' },
  { href: '/warranty',    label: 'Гарантія' },
  { href: '/blog',        label: 'Блог' },
  { href: '/contacts',    label: 'Контакти' },
];

/**
 * Slide-in drawer меню для мобільного.
 * Кнопка-тригер видна тільки на mobile (md:hidden).
 *
 * UX:
 * - Slide справа, swipe-вʼязне відкриття/закриття
 * - Затемнений backdrop
 * - Click backdrop / ESC / клік на посилання → закриває
 * - Body scroll lock коли відкритий
 */
export default function MobileMenu({ items = DEFAULT_NAV }: { items?: NavItem[] }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      {/* Trigger button — тільки на мобільному. Збільшений tap-target ≥44px */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Меню"
        aria-expanded={open}
        className="-mr-2 flex h-11 w-11 items-center justify-center text-[#4A4A48] transition hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={close}
        className={`fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Меню навігації"
        className={`fixed top-0 right-0 z-[90] flex h-[100dvh] max-h-screen w-[85%] max-w-sm flex-col bg-[#FAFAF7] shadow-2xl transition-transform duration-300 dark:bg-[#0A0A0A] md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#E8E6DE] px-5 py-4 dark:border-white/10">
          <div className="text-[10px] tracking-[0.25em] text-[#993C1D] dark:text-[#FF8A33]">// MENU</div>
          <button
            type="button"
            onClick={close}
            aria-label="Закрити меню"
            className="flex h-11 w-11 items-center justify-center text-[#4A4A48] dark:text-white/80"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={close}
                  className="flex items-center justify-between rounded-sm px-3 py-3 text-base text-[#1a1a1a] transition hover:bg-[#FFFCF5] hover:text-[#993C1D] dark:text-white dark:hover:bg-white/[0.04] dark:hover:text-[#FF8A33]"
                >
                  {it.label}
                  <span aria-hidden className="text-[#993C1D] dark:text-[#FF8A33]">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-shrink-0 border-t border-[#E8E6DE] px-5 py-4 dark:border-white/10">
          <a
            href="tel:+380958981007"
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#FF8A33] dark:text-black"
          >
            <Phone size={16} />
            0 (95) 898-10-07
          </a>
          <p className="mt-3 text-[10px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">
            ЩОДНЯ 9:30–16:30 · КИЇВ
          </p>
        </div>
      </aside>
    </>
  );
}
