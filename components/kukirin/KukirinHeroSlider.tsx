'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export type HeroStat = { value: string; unit: string; label: string };

export type HeroModel = {
  slug: string;
  name: string;          // KUKIRIN G2 PRO
  shortName: string;     // G2 PRO (для кнопки і підпису)
  number: string;        // "01", "02", "03"
  category: string;      // FLAGSHIP / OFFROAD / URBAN
  tagline: string;
  image: string;         // URL фото
  height: string;        // "1156mm"
  length: string;        // "1206mm"
  stats: HeroStat[];     // 4 статистики
  bottomLabel: string;   // "FLAGSHIP · 600W · 45 KM/H"
};

const ROTATE_MS = 6000;

export default function KukirinHeroSlider({ models }: { models: HeroModel[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = models.length;
  const m = models[active] ?? models[0];

  // Auto-rotate
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || total < 2) return;
    timer.current = setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, total, active]);

  // Touch swipe
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null || total < 2) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    setActive((i) => (dx > 0 ? (i - 1 + total) % total : (i + 1) % total));
  };

  const goTo = useCallback((i: number) => {
    setActive(i);
  }, []);

  if (!m) return null;

  return (
    <div
      className="grid grid-cols-1 items-center gap-6 py-6 sm:gap-8 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ЛІВА: текст */}
      <div className="relative order-2 lg:order-1">
        <div className="kukirin-fade-1 mb-5 flex items-center gap-2 text-[11px] tracking-[0.15em] text-[#4A4A48] dark:text-white/60">
          <span className="kukirin-pulse-dot" />
          В НАЯВНОСТІ · 12 МОДЕЛЕЙ
        </div>

        <div
          key={`label-${m.slug}`}
          className="kukirin-fade-1 mb-5 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]"
        >
          // SYS.BOOT // {m.name} 2026
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
            href={`/product/${m.slug}`}
            className="inline-flex items-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] dark:text-black"
          >
            ЗАМОВИТИ {m.shortName}
            <ArrowRight size={14} />
          </a>
          <a
            href="/test-drive"
            className="rounded-sm border border-[#1a1a1a]/25 px-6 py-3 text-xs font-medium tracking-wide text-[#1a1a1a] transition hover:border-[#1a1a1a]/50 dark:border-white/25 dark:text-white dark:hover:border-white/50"
          >
            Тест-драйв
          </a>
        </div>

        {/* Stats — переключаються разом зі слайдом */}
        <div
          key={`stats-${m.slug}`}
          className="kukirin-fade-4 grid grid-cols-2 gap-6 border-t border-[#E8E6DE] pt-6 dark:border-white/10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
        >
          {m.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-medium leading-none tracking-[-0.03em] md:text-4xl">
                {stat.value}
                {stat.unit && (
                  <span className="ml-1 text-sm text-[#6C6A65] dark:text-white/40">{stat.unit}</span>
                )}
              </div>
              <div className="mt-1 text-[9px] tracking-[0.2em] text-[#FF6B00]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dots для перемикання моделей */}
        {total > 1 && (
          <div className="mt-8 flex items-center gap-3">
            {models.map((mm, i) => (
              <button
                key={mm.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Показати ${mm.shortName}`}
                aria-current={i === active ? 'true' : undefined}
                className={`group flex h-8 items-center gap-2 px-2 transition`}
              >
                <span
                  className={`h-px transition-all ${
                    i === active
                      ? 'w-10 bg-[#FF6B00]'
                      : 'w-5 bg-[#E8E6DE] dark:bg-white/20 group-hover:bg-[#FF6B00]/50'
                  }`}
                />
                <span
                  className={`text-[10px] tracking-[0.2em] transition ${
                    i === active
                      ? 'text-[#1a1a1a] dark:text-white'
                      : 'text-[#6C6A65] dark:text-white/40 group-hover:text-[#1a1a1a] dark:group-hover:text-white'
                  }`}
                >
                  {mm.shortName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ПРАВА: Tech Sheet з фото — клікабельний на swipe */}
      <div
        className="kukirin-fade-3 relative order-1 lg:order-2"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={`techsheet-${m.slug}`}
          className="relative aspect-square overflow-hidden rounded-md border border-[#E8E6DE] bg-white dark:border-white/15 dark:bg-[#0A0A0A]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(232,230,222,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,230,222,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="absolute left-4 top-3 z-20 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // {m.number} · {m.category}
          </div>
          <div className="absolute right-4 top-3 z-20 font-mono text-[10px] tracking-[0.15em] text-[#993C1D] dark:text-[#FF8A33]">
            XY: 0.61 · 1.18
          </div>

          {/* Вертикальна лінія H */}
          <div className="pointer-events-none absolute left-5 top-10 bottom-10 z-10 w-px bg-[#FF6B00]/40">
            <div className="absolute top-0 -left-1 h-px w-3 bg-[#FF6B00]/60" />
            <div className="absolute bottom-0 -left-1 h-px w-3 bg-[#FF6B00]/60" />
          </div>
          <div className="absolute left-9 top-14 z-20 font-mono text-[10px] tracking-[0.1em] text-[#993C1D] dark:text-[#FF8A33]">
            H: {m.height}
          </div>

          {/* Горизонтальна лінія L */}
          <div className="pointer-events-none absolute left-10 right-10 bottom-5 z-10 h-px bg-[#FF6B00]/40">
            <div className="absolute left-0 -top-1 h-3 w-px bg-[#FF6B00]/60" />
            <div className="absolute right-0 -top-1 h-3 w-px bg-[#FF6B00]/60" />
          </div>
          <div className="absolute left-14 bottom-7 z-20 font-mono text-[10px] tracking-[0.1em] text-[#993C1D] dark:text-[#FF8A33]">
            L: {m.length}
          </div>

          {/* М'яке оранжеве світіння */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle at 50% 55%, rgba(255,107,0,0.10) 0%, transparent 60%)',
            }}
          />

          {/* Фото — з cross-fade при зміні */}
          <Image
            src={m.image}
            alt={m.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
            className="z-10 object-contain p-12 transition-opacity duration-500"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[9px] tracking-[0.3em] text-[#6C6A65] dark:text-white/40">
          <span>// {m.bottomLabel}</span>
          <span>{m.shortName} · 2026</span>
        </div>
      </div>
    </div>
  );
}
