import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import { getAllProducts } from '@/lib/data/products';

export const metadata = { title: 'Каталог самокатів' };
export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  urban: 'Місто',
  offroad: 'Off-road',
  flagship: 'Флагман',
  accessory: 'Аксесуар',
};

export default async function CatalogPage() {
  const list = await getAllProducts();

  return (
    <PageShell
      breadcrumb="CATALOG · 2026"
      title="Усі моделі KUKIRIN"
      subtitle={`${list.length} електросамокатів — від міських до off-road флагманів. Усі офіційні, з гарантією 12 місяців.`}
    >
      {list.length === 0 ? (
        <div className="rounded-sm border border-[#E8E6DE] p-8 text-center text-[#6C6A65] dark:border-white/10 dark:text-white/55">
          Поки що немає товарів у каталозі.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => {
            const cover = (s as { image?: string | null; cover_url?: string | null }).image
              ?? (s as { cover_url?: string | null }).cover_url
              ?? null;
            return (
              <Link
                key={s.slug}
                href={`/product/${s.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-sm border border-[#E8E6DE] bg-white transition hover:border-[#FF6B00] dark:border-white/10 dark:bg-[#0F0F0F]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#F0EEE6] to-[#E5E2D5] dark:from-[#1a1a1a] dark:to-[#0a0a0a]">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={s.name} className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] tracking-[0.2em] text-[#1a1a1a]/25 dark:text-white/25">KUKIRIN</div>
                  )}
                  {s.badge && (
                    <span className="absolute right-3 top-3 rounded-sm bg-[#FF6B00] px-2 py-0.5 text-[9px] font-medium tracking-[0.15em] text-white dark:text-black">
                      {s.badge.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
                    {CATEGORY_LABELS[s.category] ?? s.category}
                  </div>
                  <div className="mb-1 text-lg font-medium tracking-tight">{s.name}</div>
                  <div className="mb-4 text-xs text-[#6C6A65] dark:text-white/45">{s.tagline}</div>
                  <div className="mb-4 grid grid-cols-3 gap-2 border-y border-[#E8E6DE] py-3 text-center dark:border-white/10">
                    <div>
                      <div className="text-sm font-medium">
                        {s.power > 0 ? s.power : '—'}
                        {s.power > 0 && <span className="text-[10px] text-[#6C6A65] dark:text-white/40">W</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">МОТОР</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {s.maxSpeed > 0 ? s.maxSpeed : '—'}
                        {s.maxSpeed > 0 && <span className="text-[10px] text-[#6C6A65] dark:text-white/40">km/h</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">ШВИДК.</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {s.range > 0 ? s.range : '—'}
                        {s.range > 0 && <span className="text-[10px] text-[#6C6A65] dark:text-white/40">km</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-[#6C6A65] dark:text-white/40">ЗАПАС</div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      {s.oldPrice && (
                        <div className="text-[11px] text-[#6C6A65] line-through dark:text-white/30">{Number(s.oldPrice).toLocaleString('uk-UA')} ₴</div>
                      )}
                      <div className="text-xl font-medium text-[#FF6B00]">{Number(s.price).toLocaleString('uk-UA')} ₴</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#4A4A48] transition group-hover:text-[#1a1a1a] dark:text-white/60 dark:group-hover:text-white">
                      Детальніше <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
