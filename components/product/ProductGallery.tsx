'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

type Props = {
  images: string[];
  name: string;
  tagline?: string;
  badge?: string | null;
};

/**
 * Галерея фото товара з lightbox-режимом.
 *
 * Поведінка:
 * - Click thumbnail → активне фото змінюється
 * - Click головне фото → відкривається fullscreen lightbox
 * - В lightbox: ESC або клік фону = закрити; ← / → або кнопки = перегортання
 * - Body scroll блокується поки lightbox відкритий
 *
 * unoptimized=true на всіх Image — щоб не з'їдати Vercel Image Optimization квоту
 * (фото йдуть напряму з Supabase CDN).
 */
export default function ProductGallery({ images, name, tagline, badge }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Нормалізуємо: щоб не було помилки якщо images раптом порожній
  const safeImages = images.filter(Boolean);
  const total = safeImages.length;
  const safeIndex = total > 0 ? Math.min(activeIndex, total - 1) : 0;
  const currentImage = safeImages[safeIndex];

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  // Keyboard навігація + body scroll lock при відкритому lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);

    // Body scroll lock
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, goPrev, goNext]);

  if (total === 0) {
    // Fallback — placeholder, як було
    return (
      <div className="relative aspect-square overflow-hidden rounded-md border border-[#E8E6DE] bg-white dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:to-[#0a0a0a]">
        <div className="flex h-full w-full items-center justify-center text-[#FF6B00]/30">
          <div className="text-center">
            <div className="text-7xl font-medium tracking-tight">{name.split(' ').pop() || 'KUKIRIN'}</div>
            <div className="mt-2 text-xs tracking-[0.3em] text-[#6C6A65] dark:text-white/30">
              // {tagline ? tagline.toUpperCase() : 'KUKIRIN'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const altMain = `${name} — електросамокат KUKIRIN${tagline ? `, ${tagline}` : ''}`;

  return (
    <>
      {/* ============ Primary view ============ */}
      <div className="relative aspect-square overflow-hidden rounded-md border border-[#E8E6DE] bg-white dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:to-[#0a0a0a]">
        {/* Watermark dragon */}
        <Image
          src="/logo-mark.png"
          alt=""
          width={384}
          height={242}
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -bottom-8 h-72 w-auto opacity-[0.06] select-none dark:opacity-[0.10]"
        />

        {/* Top-left labels */}
        <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
          {badge && (
            <span className="rounded-sm bg-[#FF6B00] px-2 py-1 text-[10px] font-medium tracking-[0.15em] text-white dark:text-black">
              {badge.toUpperCase()}
            </span>
          )}
          <span className="rounded-sm border border-[#E8E6DE] bg-white/80 px-2 py-1 text-[10px] tracking-[0.15em] text-[#4A4A48] backdrop-blur dark:border-white/20 dark:bg-transparent dark:text-white/70">
            KUKIRIN · 2026
          </span>
        </div>

        {/* Zoom hint top-right (видно лише на hover) */}
        <span className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-sm bg-black/40 px-2 py-1 text-[10px] tracking-[0.1em] text-white opacity-0 backdrop-blur transition group-hover/primary:opacity-100">
          <ZoomIn size={12} /> ЗБІЛЬШИТИ
        </span>

        {/* Сама фотка — клікабельна, відкриває lightbox */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Збільшити фото"
          className="group/primary absolute inset-0 z-[1] flex h-full w-full cursor-zoom-in items-center justify-center"
        >
          <Image
            src={currentImage}
            alt={altMain}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            unoptimized
            className="object-contain p-10"
          />
        </button>
      </div>

      {/* ============ Thumbnails ============ */}
      {total > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {safeImages.slice(0, 7).map((url, i) => {
            const isActive = i === safeIndex;
            return (
              <button
                key={url + i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Показати фото ${i + 1}`}
                aria-current={isActive ? 'true' : undefined}
                className={`relative aspect-square overflow-hidden rounded-sm border bg-white transition dark:bg-[#0A0A0A] ${
                  isActive
                    ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/30'
                    : 'border-[#E8E6DE] hover:border-[#FF6B00]/40 dark:border-white/10 dark:hover:border-[#FF6B00]/40'
                }`}
              >
                <Image
                  src={url}
                  alt={`${name} — фото ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 16vw, 8vw"
                  unoptimized
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* ============ Lightbox ============ */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Перегляд фото ${name}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Закрити"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {/* Prev arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Попереднє фото"
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image — eslint-disable img-element бо в lightbox простіше */}
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={altMain}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>

          {/* Next arrow */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Наступне фото"
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Counter */}
          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-sm bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
              {safeIndex + 1} / {total}
            </div>
          )}
        </div>
      )}
    </>
  );
}
