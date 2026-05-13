import { ArrowRight, Phone } from 'lucide-react';

export default function KukirinCTA() {
  return (
    <section className="relative overflow-hidden border-y border-[#E8E6DE] bg-[#FAFAF7] py-16 dark:border-white/10 dark:bg-[#0A0A0A] lg:py-20">
      {/* Декоративні діагональні лінії */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #FF6B00 0px, #FF6B00 1px, transparent 1px, transparent 14px)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center text-[#1a1a1a] dark:text-white lg:px-10">
        <div className="mb-4 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">
          // READY TO RIDE
        </div>
        <h2 className="mb-5 text-3xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          Не знаєш, яку модель обрати?<br />
          <span className="text-[#FF6B00]">Наберемо за 5 хвилин.</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#4A4A48] dark:text-white/60">
          Залиш номер — менеджер передзвонить, підбере модель під твої задачі
          й розрахує доставку. Без спаму.
        </p>

        <form
          className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
          action="/api/callback"
          method="post"
        >
          <input
            type="tel"
            name="phone"
            placeholder="+38 (0__) ___ __ __"
            required
            className="flex-1 rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#6C6A65] outline-none transition focus:border-[#FF6B00] focus:bg-[#FFFCF5] dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder-white/40 dark:focus:bg-white/10"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] dark:text-black"
          >
            ЗАМОВИТИ ДЗВІНОК
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6C6A65] dark:text-white/40">
          <Phone size={13} />
          <span>або просто</span>
          <a href="tel:+380800338899" className="text-[#1a1a1a] underline-offset-2 hover:text-[#FF6B00] hover:underline dark:text-white/80">
            0 800 33 88 99
          </a>
        </div>
      </div>
    </section>
  );
}
