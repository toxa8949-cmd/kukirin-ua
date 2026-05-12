// ============================================================
// ПРИКЛАД нового Header.tsx
// ============================================================
// Це ПРИКЛАД, не пряма заміна. Подивись на свій поточний
// Header.tsx, скопіюй з цього файлу те, що тобі потрібно
// (динамічні категорії + телефон з settings + іконки соцмереж).
//
// Цей приклад робить компонент `async server component`, що
// дозволяє йому тягнути дані з БД на сервері.
//
// Якщо твій поточний Header використовує 'use client' (через
// мобільне меню чи useState), див. файл Header-pattern-client.tsx
// з прикладом розділення на server shell + client interactive.
// ============================================================

import Link from 'next/link';
import { Search, User, ShoppingBag, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';

async function getNavCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('slug, name')
    .order('sort_order', { ascending: true, nullsFirst: false });
  return (data ?? []) as Array<{ slug: string; name: string }>;
}

export default async function Header() {
  const [categories, settings] = await Promise.all([
    getNavCategories(),
    getSiteSettings(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 text-xl font-medium tracking-tight">
          KUKIRIN<span className="text-[#FF6B00]">.UA</span>
        </Link>

        {/* Nav — categories from DB */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="text-sm text-white/75 transition hover:text-white"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/service" className="text-sm text-white/75 transition hover:text-white">
            Сервіс
          </Link>
          <Link href="/blog" className="text-sm text-white/75 transition hover:text-white">
            Блог
          </Link>
        </nav>

        {/* Right block: phone + icons */}
        <div className="flex items-center gap-3">
          {settings.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="hidden items-center gap-1.5 text-sm text-white/80 transition hover:text-[#FF6B00] lg:inline-flex"
            >
              <Phone size={14} /> {settings.phone}
            </a>
          )}
          <button
            type="button"
            aria-label="Пошук"
            className="rounded-sm p-2 text-white/70 transition hover:text-white"
          >
            <Search size={18} />
          </button>
          <Link
            href="/account"
            aria-label="Кабінет"
            className="rounded-sm p-2 text-white/70 transition hover:text-white"
          >
            <User size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="Кошик"
            className="rounded-sm p-2 text-white/70 transition hover:text-white"
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
