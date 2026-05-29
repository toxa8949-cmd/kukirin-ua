import { PackageSearch, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { HERO_STATS } from '@/lib/kukirin-data';
import Logo from '@/components/kukirin/Logo';
import MobileMenu from '@/components/site/MobileMenu';

export default function KukirinHero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] text-[#1a1a1a] dark:bg-[#0A0A0A] dark:text-white">
      {/* Анімовані треки швидкості на фоні */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="kukirin-streak kukirin-streak-1" />
        <div className="kukirin-streak kukirin-streak-2" />
        <div className="kukirin-streak kukirin-streak-3" />
        <div className="kukirin-streak kukirin-streak-4" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Навігація */}
        <nav className="flex items-center justify-between border-b border-[#E8E6DE] py-4 dark:border-white/10">
          <div className="flex items-center gap-8">
            <a href="/" className="inline-flex items-center" aria-label="KUKIRIN.UA — головна">
              <Logo variant="inline" size={32} href={null} />
            </a>
            <ul className="hidden gap-5 text-sm text-[#4A4A48] dark:text-white/70 md:flex">
              <li><a href="#models" className="hover:text-[#1a1a1a] dark:hover:text-white">Самокати</a></li>
              <li><a href="/accessories" className="hover:text-[#1a1a1a] dark:hover:text-white">Аксесуари</a></li>
              <li><a href="/service" className="hover:text-[#1a1a1a] dark:hover:text-white">Сервіс</a></li>
              <li><a href="/blog" className="hover:text-[#1a1a1a] dark:hover:text-white">Блог</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="/orders/track" aria-label="Відстежити замовлення" title="Відстежити замовлення" className="flex h-11 w-11 items-center justify-center text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <PackageSearch size={18} />
            </a>
            <a href="/cart" aria-label="Кошик" className="flex h-11 w-11 items-center justify-center text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <ShoppingCart size={18} />
            </a>
            <MobileMenu />
          </div>
        </nav>

        {/* Геро-блок */}
        <div className="grid grid-cols-1 items-center gap-6 py-6 sm:gap-8 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-16">
          {/* ЛІВА: текст — на mobile показуємо ДРУГОЮ, фото перше */}
          <div className="relative order-2 lg:order-1">
            <div className="kukirin-fade-1 mb-5 flex items-center gap-2 text-[11px] tracking-[0.15em] text-[#4A4A48] dark:text-white/60">
              <span className="kukirin-pulse-dot" />
              В НАЯВНОСТІ · 12 МОДЕЛЕЙ
            </div>

            <div className="kukirin-fade-1 mb-5 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">
              // SYS.BOOT // KUKIRIN G2 PRO 2026
            </div>

            <h1 className="kukirin-fade-2 mb-1 text-4xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-5xl md:text-7xl lg:text-7xl xl:text-8xl">
              <span className="kukirin-glitch relative inline-block" data-text="FEEL">FEEL</span>
              <span className="text-[#1a1a1a]/30 dark:text-white/30"> THE</span>
            </h1>

            <h1 className="kukirin-fade-3 mb-5 text-5xl font-medium leading-[0.9] tracking-[-0.04em] text-[#FF6B00] md:text-7xl lg:text-7xl xl:text-8xl">
              <span className="kukirin-glitch relative inline-block" data-text="RUSH.">
                RUSH<span className="text-[#1a1a1a] dark:text-white">.</span>
              </span>
              <span className="kukirin-cursor text-[#FF6B00]">_</span>
            </h1>

            <p className="kukirin-fade-3 mb-6 max-w-md text-sm leading-relaxed text-[#4A4A48] dark:text-white/55">
              Не просто самокат — адреналін під ногами. Офіційний KUKIRIN в Україні.
              Гарантія, сервіс, доставка завтра.
            </p>

            <div className="kukirin-fade-4 mb-9 flex flex-wrap gap-2">
              <a
                href="/product/kukirin-g2-pro"
                className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] dark:text-black"
              >
                ЗАМОВИТИ G2 PRO
                <ArrowRight size={14} />
              </a>
              <a
                href="/test-drive"
                className="rounded-sm border border-[#1a1a1a]/25 px-6 py-3 text-xs font-medium tracking-wide text-[#1a1a1a] transition hover:border-[#1a1a1a]/50 dark:border-white/25 dark:text-white dark:hover:border-white/50"
              >
                Тест-драйв
              </a>
            </div>

            <div className="kukirin-fade-4 grid grid-cols-2 gap-6 border-t border-[#E8E6DE] pt-6 dark:border-white/10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-medium leading-none tracking-[-0.03em] md:text-4xl">
                    {stat.value}
                    <span className="ml-1 text-sm text-[#6C6A65] dark:text-white/40">{stat.unit}</span>
                  </div>
                  <div className="mt-1 text-[9px] tracking-[0.2em] text-[#FF6B00]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ПРАВА: Tech Sheet з фото */}
          <div className="kukirin-fade-3 relative order-1 lg:order-2">
            <div
              className="relative aspect-square overflow-hidden rounded-md border border-[#E8E6DE] bg-white dark:border-white/15 dark:bg-[#0A0A0A]"
              style={{
                // Тонка сітка 24x24px на фоні
                backgroundImage:
                  'linear-gradient(to right, rgba(232,230,222,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,230,222,0.5) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Тех-тег верх-лівий */}
              <div className="absolute left-4 top-3 z-20 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
                // 01 · FLAGSHIP
              </div>

              {/* Координати верх-правий */}
              <div className="absolute right-4 top-3 z-20 font-mono text-[10px] tracking-[0.15em] text-[#993C1D] dark:text-[#FF8A33]">
                XY: 0.61 · 1.18
              </div>

              {/* Вертикальна лінія вимірювання зліва */}
              <div className="pointer-events-none absolute left-5 top-10 bottom-10 z-10 w-px bg-[#FF6B00]/40">
                {/* Капелюшки на кінцях */}
                <div className="absolute top-0 -left-1 h-px w-3 bg-[#FF6B00]/60" />
                <div className="absolute bottom-0 -left-1 h-px w-3 bg-[#FF6B00]/60" />
              </div>
              <div className="absolute left-9 top-14 z-20 font-mono text-[10px] tracking-[0.1em] text-[#993C1D] dark:text-[#FF8A33]">
                H: 1156mm
              </div>

              {/* Горизонтальна лінія вимірювання знизу */}
              <div className="pointer-events-none absolute left-10 right-10 bottom-5 z-10 h-px bg-[#FF6B00]/40">
                <div className="absolute left-0 -top-1 h-3 w-px bg-[#FF6B00]/60" />
                <div className="absolute right-0 -top-1 h-3 w-px bg-[#FF6B00]/60" />
              </div>
              <div className="absolute left-14 bottom-7 z-20 font-mono text-[10px] tracking-[0.1em] text-[#993C1D] dark:text-[#FF8A33]">
                L: 1206mm
              </div>

              {/* М'яке оранжеве світіння за самокатом — тонкий радіальний градієнт */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle at 50% 55%, rgba(255,107,0,0.10) 0%, transparent 60%)',
                }}
              />

              {/* Фото — Next Image для автоматичної оптимізації (WebP, lazy, srcset) */}
              <Image
                src="/hero/g2-pro.png"
                alt="KUKIRIN G2 Pro"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="z-10 object-contain p-12 mix-blend-multiply dark:mix-blend-screen dark:invert"
              />
            </div>

            {/* Підпис під карткою */}
            <div className="mt-3 flex items-center justify-between text-[9px] tracking-[0.3em] text-[#6C6A65] dark:text-white/40">
              <span>// FLAGSHIP · 600W · 45 KM/H</span>
              <span>G2 PRO · 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
