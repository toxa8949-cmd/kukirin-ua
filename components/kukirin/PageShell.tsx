import Link from 'next/link';
import { PackageSearch, Menu, Instagram, Facebook, Youtube, Send } from 'lucide-react';
import CartIcon from '@/components/cart/CartIcon';
import Logo from '@/components/kukirin/Logo';

export default function PageShell({
  children, title, subtitle, breadcrumb,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1a1a1a] dark:bg-[#0A0A0A] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-[#E8E6DE] bg-[#FAFAF7]/90 backdrop-blur dark:border-white/10 dark:bg-[#0A0A0A]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo variant="inline" size={28} />
            <ul className="hidden gap-5 text-sm text-[#4A4A48] dark:text-white/70 md:flex">
              <li><Link href="/catalog" className="hover:text-[#1a1a1a] dark:hover:text-white">Самокати</Link></li>
              <li><Link href="/accessories" className="hover:text-[#1a1a1a] dark:hover:text-white">Аксесуари</Link></li>
              <li><Link href="/service" className="hover:text-[#1a1a1a] dark:hover:text-white">Сервіс</Link></li>
              <li><Link href="/blog" className="hover:text-[#1a1a1a] dark:hover:text-white">Блог</Link></li>
            </ul>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/orders/track" aria-label="Відстежити замовлення" title="Відстежити замовлення" className="flex h-11 w-11 items-center justify-center text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white"><PackageSearch size={18} /></Link>
            <CartIcon />
            <details className="relative md:hidden">
              <summary className="list-none cursor-pointer text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white"><Menu size={20} /></summary>
              <div className="absolute right-0 mt-3 w-48 rounded-sm border border-[#E8E6DE] bg-white p-3 text-sm shadow-xl dark:border-white/10 dark:bg-[#111]">
                <Link href="/catalog" className="block py-2 text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">Самокати</Link>
                <Link href="/accessories" className="block py-2 text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">Аксесуари</Link>
                <Link href="/service" className="block py-2 text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">Сервіс</Link>
                <Link href="/blog" className="block py-2 text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">Блог</Link>
                <Link href="/contacts" className="block py-2 text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">Контакти</Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      {(title || breadcrumb) && (
        <section className="border-b border-[#E8E6DE] bg-[#FAFAF7] dark:border-white/10 dark:bg-[#0A0A0A]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
            {breadcrumb && (
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// {breadcrumb}</div>
            )}
            {title && (
              <h1 className="text-3xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-4xl md:text-5xl">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-3 max-w-2xl text-sm text-[#6C6A65] dark:text-white/55 sm:text-base">{subtitle}</p>
            )}
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">{children}</main>

      <footer className="border-t border-[#E8E6DE] bg-[#F0EEE6] py-12 text-[#1a1a1a] dark:border-white/10 dark:bg-[#070707] dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-8 border-b border-[#E8E6DE] pb-10 dark:border-white/10 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3">
                <Logo variant="full" size={56} />
              </div>
              <p className="mb-4 max-w-xs text-xs leading-relaxed text-[#6C6A65] dark:text-white/45">Офіційний дистрибʼютор електросамокатів KUKIRIN в Україні. Гарантія, сервіс, доставка.</p>
              <div className="flex gap-2">
                <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60"><Instagram size={14} /></a>
                <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60"><Facebook size={14} /></a>
                <a href="#" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60"><Youtube size={14} /></a>
                <a href="#" aria-label="Telegram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60"><Send size={14} /></a>
              </div>
            </div>
            <div>
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КАТАЛОГ</div>
              <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
                <li><Link href="/category/urban" className="hover:text-[#FF6B00]">Міські</Link></li>
                <li><Link href="/category/offroad" className="hover:text-[#FF6B00]">Off-road</Link></li>
                <li><Link href="/category/flagship" className="hover:text-[#FF6B00]">Флагмани</Link></li>
                <li><Link href="/accessories" className="hover:text-[#FF6B00]">Аксесуари</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">ДОПОМОГА</div>
              <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
                <li><Link href="/delivery" className="hover:text-[#FF6B00]">Доставка й оплата</Link></li>
                <li><Link href="/warranty" className="hover:text-[#FF6B00]">Гарантія</Link></li>
                <li><Link href="/service" className="hover:text-[#FF6B00]">Сервіс</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FF6B00]">Контакти</Link></li><li><Link href="/orders/track" className="hover:text-[#FF6B00]">Відстежити замовлення</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КОНТАКТИ</div>
              <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
                <li><a href="tel:+380958981007" className="hover:text-[#FF6B00]">0 (95) 898-10-07</a></li>
                <li><a href="mailto:info@kukirin.ua" className="hover:text-[#FF6B00]">info@kukirin.ua</a></li>
                <li className="text-xs text-[#6C6A65] dark:text-white/40">Пн–Нд: 9:00 – 21:00</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-2 pt-6 text-[11px] text-[#6C6A65] dark:text-white/40 md:flex-row md:items-center">
            <div>© {new Date().getFullYear()} kukirinstore.com.ua · Усі права захищені</div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-[#1a1a1a] dark:hover:text-white">Конфіденційність</Link>
              <Link href="/terms" className="hover:text-[#1a1a1a] dark:hover:text-white">Угода</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
