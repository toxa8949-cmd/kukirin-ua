import { ArrowUpRight } from 'lucide-react';
import { getFeaturedProducts, getAllProducts } from '@/lib/data/products';

const CATEGORY_LABELS: Record<string, string> = {
  urban: 'Міський',
  offroad: 'Off-road',
  flagship: 'Флагман',
};

const BADGE_STYLES: Record<string, string> = {
  hit: 'bg-[#FF6B00] text-white dark:text-black',
  new: 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black',
  top: 'bg-[#1a1a1a]/10 text-[#1a1a1a] border border-[#1a1a1a]/20 dark:bg-white/10 dark:text-white dark:border-white/20',
};

const BADGE_LABELS: Record<string, string> = {
  hit: 'ХІТ',
  new: 'NEW',
  top: 'TOP',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('uk-UA').format(price);
}

export default async function KukirinModels() {
  let list = await getFeaturedProducts().catch(() => []);
  if (list.length === 0) {
    list = await getAllProducts().catch(() => []);
  }
  list = list.slice(0, 6);

  return (
    <section id="models" className="bg-[#FAFAF7] py-16 text-[#1a1a1a] dark:bg-[#0A0A0A] dark:text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#E8E6DE] pb-6 dark:border-white/10">
          <div>
            <div className="mb-2 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">
              // MODELS · 2026
            </div>
            <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl">
              Обери свій<br />
              <span className="text-[#FF6B00]">режим швидкості</span>
            </h2>
          </div>
          <a
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-[#4A4A48] transition hover:text-[#1a1a1a] dark:text-white/70 dark:hover:text-white"
          >
            Усі моделі <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((scooter, i) => (
            <a
              key={scooter.slug}
              href={`/product/${scooter.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-[#E8E6DE] bg-white p-5 transition hover:border-[#FF6B00]/60 hover:bg-[#FFFCF5] dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-[#FF6B00]/40 dark:hover:bg-white/[0.04]"
            >
              {scooter.badge && (
                <span
                  className={`absolute left-5 top-5 z-10 rounded-sm px-2 py-1 text-[9px] font-medium tracking-[0.1em] ${BADGE_STYLES[scooter.badge] ?? 'bg-[#1a1a1a]/10 text-[#1a1a1a] dark:bg-white/10 dark:text-white'}`}
                >
                  {BADGE_LABELS[scooter.badge] ?? scooter.badge.toUpperCase()}
                </span>
              )}

              <span className="absolute right-4 top-4 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/30">
                / 0{i + 1}
              </span>

              <div className="mb-5 flex h-44 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-b from-[#F0EEE6] to-[#E5E2D5] dark:from-[#1A1A1A] dark:to-[#0E0E0E]">
                <svg viewBox="0 0 120 80" className="h-24 w-24 text-[#1a1a1a]/15 dark:text-white/15">
                  <circle cx="25" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="95" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="25" y1="60" x2="95" y2="60" stroke="currentColor" strokeWidth="2" />
                  <line x1="60" y1="60" x2="60" y2="20" stroke="currentColor" strokeWidth="2" />
                  <line x1="55" y1="15" x2="80" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="mb-1 text-[10px] tracking-[0.2em] text-[#FF6B00]">
                {CATEGORY_LABELS[scooter.category] ?? scooter.category}
              </div>

              <h3 className="mb-1 text-lg font-medium">{scooter.name}</h3>
              <p className="mb-4 text-xs text-[#6C6A65] dark:text-white/45">{scooter.tagline}</p>

              <div className="mb-4 grid grid-cols-3 gap-2 border-y border-[#E8E6DE] py-3 text-center dark:border-white/5">
                <div>
                  <div className="text-sm font-medium">{scooter.power}<span className="text-[10px] text-[#6C6A65] dark:text-white/40">W</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">МОТОР</div>
                </div>
                <div className="border-x border-[#E8E6DE] dark:border-white/5">
                  <div className="text-sm font-medium">{scooter.maxSpeed}<span className="text-[10px] text-[#6C6A65] dark:text-white/40">km/h</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">ШВИДКІСТЬ</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{scooter.range}<span className="text-[10px] text-[#6C6A65] dark:text-white/40">km</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">ХІД</div>
                </div>
              </div>

              <div className="mt-auto flex items-baseline justify-between">
                <div>
                  <div className="text-xl font-medium text-[#1a1a1a] dark:text-white">
                    {formatPrice(scooter.price)}
                    <span className="text-xs text-[#6C6A65] dark:text-white/50">₴</span>
                  </div>
                  {scooter.oldPrice && (
                    <div className="text-xs text-[#6C6A65] line-through dark:text-white/30">
                      {formatPrice(scooter.oldPrice)} ₴
                    </div>
                  )}
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#1a1a1a]/5 transition group-hover:bg-[#FF6B00] group-hover:text-white dark:bg-white/5 dark:group-hover:text-black">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
