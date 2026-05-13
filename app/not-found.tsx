import Link from 'next/link';
import PageShell from '@/components/kukirin/PageShell';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-xl py-6 text-center sm:py-12">
        <div className="mb-3 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">// ERROR · 404</div>
        <div className="mb-3 text-7xl font-medium tracking-[-0.04em] text-[#FF6B00] sm:text-9xl">404</div>
        <h1 className="mb-3 text-2xl font-medium tracking-tight sm:text-3xl">Сторінку не знайдено</h1>
        <p className="mb-8 text-sm text-[#4A4A48] dark:text-white/55">Можливо, її переміщено, видалено або ви помилились у адресі. Поверніться на головну або зазирніть у каталог.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33]">
            <Home size={14} /> НА ГОЛОВНУ
          </Link>
          <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#E8E6DE] dark:border-white/25 px-6 py-3 text-xs font-medium tracking-wide hover:border-[#DCDAD0] dark:hover:border-white/50">
            <Search size={14} /> ДО КАТАЛОГУ
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
