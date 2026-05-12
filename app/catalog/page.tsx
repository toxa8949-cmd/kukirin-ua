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
        <div className="rounded-sm border border-white/10 p-8 text-center text-white/55">
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
                className="group relative flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#0F0F0F] transition hover:border-[#FF6B00]"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={s.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] tracking-[0.2em] text-white/25">
                      KUKIRIN
                    </div>
                  )}
                  {s.badge && (
                    <span className="absolute right-3 top-3 rounded-sm bg-[#FF6B00] px-2 py-0.5 text-[9px] font-medium tracking-[0.15em] text-black">
                      {s.badge.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 text-[10px] tracking-[0.2em] text-[#FF8A33]">
                    {CATEGORY_LABELS[s.category] ?? s.category}
                  </div>
                  <div className="mb-1 text-lg font-medium tracking-tight">{s.name}</div>
                  <div className="mb-4 text-xs text-white/45">{s.tagline}</div>
                  <div className="mb-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center">
                    <div>
                      <div className="text-sm font-medium">
                        {s.power > 0 ? s.power : '—'}
                        {s.power > 0 && <span className="text-[10px] text-white/40">W</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-white/40">МОТОР</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {s.maxSpeed > 0 ? s.maxSpeed : '—'}
                        {s.maxSpeed > 0 && <span className="text-[10px] text-white/40">km/h</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-white/40">ШВИДК.</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {s.range > 0 ? s.range : '—'}
                        {s.range > 0 && <span className="text-[10px] text-white/40">km</span>}
                      </div>
                      <div className="text-[8px] tracking-[0.15em] text-white/40">ЗАПАС</div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      {s.oldPrice && (
                        <div className="text-[11px] text-white/30 line-through">{Number(s.oldPrice).toLocaleString('uk-UA')} ₴</div>
                      )}
                      <div className="text-xl font-medium text-[#FF6B00]">{Number(s.price).toLocaleString('uk-UA')} ₴</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/60 transition group-hover:text-white">
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
