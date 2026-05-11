import { ArrowRight, Phone } from 'lucide-react';

export default function KukirinCTA() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0A0A0A] py-16 lg:py-20">
      {/* Декоративні діагональні лінії */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #FF6B00 0px, #FF6B00 1px, transparent 1px, transparent 14px)',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center text-white lg:px-10">
        <div className="mb-4 text-[11px] tracking-[0.3em] text-[#FF8A33]">
          // READY TO RIDE
        </div>
        <h2 className="mb-5 text-3xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:text-6xl">
          Не знаєш, яку модель обрати?<br />
          <span className="text-[#FF6B00]">Наберемо за 5 хвилин.</span>
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/60">
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
            className="flex-1 rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#FF6B00] focus:bg-white/10"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black transition hover:bg-[#FF8A33]"
          >
            ЗАМОВИТИ ДЗВІНОК
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
          <Phone size={13} />
          <span>або просто</span>
          <a href="tel:+380800338899" className="text-white/80 underline-offset-2 hover:text-[#FF6B00] hover:underline">
            0 800 33 88 99
          </a>
        </div>
      </div>
    </section>
  );
}
