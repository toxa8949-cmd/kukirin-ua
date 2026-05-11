import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import { getAllProducts, toKukirin } from '@/lib/data/products';

export const metadata = { title: 'Каталог самокатів' };
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  urban: 'Місто',
  offroad: 'Off-road',
  flagship: 'Флагман',
};

export default async function CatalogPage() {
  const rows = await getAllProducts();
  const list = rows.map(toKukirin);

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
          {list.map((s) => (
            <Link
              key={s.slug}
              href={`/product/${s.slug}`}
              className="group relative flex flex-col rounded-sm border border-white/10 bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-[#FF8A33]">{CATEGORY_LABELS[s.category] ?? s.category}</span>
                {s.badge && (
                  <span className="rounded-sm bg-[#FF6B00] px-2 py-0.5 text-[9px] font-medium tracking-[0.15em] text-black">
                    {s.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="mb-1 text-lg font-medium tracking-tight">{s.name}</div>
              <div className="mb-4 text-xs text-white/45">{s.tagline}</div>
              <div className="mb-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center">
                <div>
                  <div className="text-sm font-medium">{s.power}<span className="text-[10px] text-white/40">W</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-white/40">МОТОР</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{s.maxSpeed}<span className="text-[10px] text-white/40">km/h</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-white/40">ШВИДК.</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{s.range}<span className="text-[10px] text-white/40">km</span></div>
                  <div className="text-[8px] tracking-[0.15em] text-white/40">ЗАПАС</div>
                </div>
              </div>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  {s.oldPrice && (
                    <div className="text-[11px] text-white/30 line-through">{s.oldPrice.toLocaleString('uk-UA')} ₴</div>
                  )}
                  <div className="text-xl font-medium text-[#FF6B00]">{s.price.toLocaleString('uk-UA')} ₴</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/60 transition group-hover:text-white">
                  Детальніше <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
