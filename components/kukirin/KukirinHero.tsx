import { Search, User, ShoppingCart, ArrowRight } from 'lucide-react';
import { HERO_STATS } from '@/lib/kukirin-data';

export default function KukirinHero() {
  // Помаранчева обводка 3px через 8 drop-shadow в усі сторони.
  // Це створює рівномірну "ауру" по контуру alpha-каналу PNG.
  const orangeStroke = [
    'drop-shadow(3px 0 0 #FF6B00)',
    'drop-shadow(-3px 0 0 #FF6B00)',
    'drop-shadow(0 3px 0 #FF6B00)',
    'drop-shadow(0 -3px 0 #FF6B00)',
    'drop-shadow(2px 2px 0 #FF6B00)',
    'drop-shadow(-2px 2px 0 #FF6B00)',
    'drop-shadow(2px -2px 0 #FF6B00)',
    'drop-shadow(-2px -2px 0 #FF6B00)',
    // М'яке зовнішнє свічення поверх обводки
    'drop-shadow(0 0 20px rgba(255,107,0,0.4))',
  ].join(' ');

  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] text-[#1a1a1a] dark:bg-[#0A0A0A] dark:text-white">
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
            <a href="/" className="text-lg font-medium tracking-[0.15em]">
              KUKIRIN<span className="text-[#FF6B00]">.</span>UA
            </a>
            <ul className="hidden gap-5 text-sm text-[#4A4A48] dark:text-white/70 md:flex">
              <li><a href="#models" className="hover:text-[#1a1a1a] dark:hover:text-white">Самокати</a></li>
              <li><a href="/accessories" className="hover:text-[#1a1a1a] dark:hover:text-white">Аксесуари</a></li>
              <li><a href="/service" className="hover:text-[#1a1a1a] dark:hover:text-white">Сервіс</a></li>
              <li><a href="/blog" className="hover:text-[#1a1a1a] dark:hover:text-white">Блог</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Пошук" className="text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <Search size={18} />
            </button>
            <a href="/account" aria-label="Кабінет" className="text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <User size={18} />
            </a>
            <a href="/cart" aria-label="Кошик" className="text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <ShoppingCart size={18} />
            </a>
          </div>
        </nav>

        {/* Геро-блок */}
        <div className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-16">
          {/* ЛІВА: текст */}
          <div className="relative">
            <div className="kukirin-fade-1 mb-5 flex items-center gap-2 text-[11px] tracking-[0.15em] text-[#4A4A48] dark:text-white/60">
              <span className="kukirin-pulse-dot" />
              В НАЯВНОСТІ · 12 МОДЕЛЕЙ
            </div>

            <div className="kukirin-fade-1 mb-5 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">
              // SYS.BOOT // KUKIRIN G2 PRO 2026
            </div>

            <h1 className="kukirin-fade-2 mb-1 text-5xl font-medium leading-[0.9] tracking-[-0.04em] md:text-7xl lg:text-7xl xl:text-8xl">
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

          {/* ПРАВА: фото G2 Pro з помаранчевою обводкою */}
          <div className="kukirin-fade-3 relative flex h-[400px] items-center justify-center sm:h-[500px] lg:h-[560px]">
            {/* Soft orange glow ззаду */}
            <div
              className="pointer-events-none absolute inset-0 m-auto"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,107,0,0.35) 0%, rgba(255,107,0,0.18) 30%, rgba(255,107,0,0.05) 55%, transparent 80%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Фото з помаранчевою обводкою через 8 drop-shadow */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/g2-pro.png"
              alt="KUKIRIN G2 Pro"
              className="relative z-10 h-full w-auto max-w-none object-contain"
              style={{ filter: orangeStroke }}
            />

            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 text-[9px] tracking-[0.3em] text-[#6C6A65] dark:text-white/40">
              // FLAGSHIP · 600W · 45 KM/H
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
