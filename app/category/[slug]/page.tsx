import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import { getAllCategories, getCategoryBySlug } from '@/lib/data/categories';
import { getProductsByCategorySlug } from '@/lib/data/products';

export const revalidate = 60;

const LEGACY_INFO: Record<string, { title: string; subtitle: string; badge: string }> = {
  urban: {
    title: 'Міські самокати',
    subtitle: 'Легкі, компактні, надійні. Ідеальні для щоденних поїздок містом — робота, парк, кав\'ярня.',
    badge: 'URBAN · ЩОДЕННО',
  },
  offroad: {
    title: 'Off-road самокати',
    subtitle: 'Потужні мотори, м\'яка підвіска і всюдихідні шини. Грунтівка, парк, пагорб — без обмежень.',
    badge: 'OFFROAD · ЕКСТРИМ',
  },
  flagship: {
    title: 'Флагмани',
    subtitle: 'Топ лінійки KUKIRIN: дуальні мотори, до 70 км/год, максимальний запас ходу та преміум-комплектація.',
    badge: 'FLAGSHIP · ТОП',
  },
};

export async function generateStaticParams() {
  const cats = await getAllCategories().catch(() => []);
  const fromDb = cats.map((c) => ({ slug: c.slug }));
  const legacy = Object.keys(LEGACY_INFO).map((slug) => ({ slug }));
  const seen = new Set<string>();
  return [...fromDb, ...legacy].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  if (cat) return { title: cat.name };
  const info = LEGACY_INFO[slug];
  if (info) return { title: info.title };
  return { title: 'Категорія не знайдена' };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  const legacy = LEGACY_INFO[slug];

  if (!cat && !legacy) notFound();

  const title = cat?.name ?? legacy!.title;
  const subtitle = cat?.description ?? legacy!.subtitle;
  const badge = cat ? `${cat.slug.toUpperCase()} · KUKIRIN` : legacy!.badge;

  const list = await getProductsByCategorySlug(slug);

  return (
    <PageShell breadcrumb={badge} title={title} subtitle={subtitle}>
      {list.length === 0 ? (
        <div className="rounded-sm border border-white/10 p-8 text-center text-white/55">
          У цій категорії поки немає товарів.{' '}
          <Link href="/catalog" className="text-[#FF6B00] hover:underline">Дивитись усі моделі →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              href={`/product/${s.slug}`}
              className="group flex flex-col rounded-sm border border-white/10 bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-[#FF8A33]">{s.battery}</span>
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
                <div className="text-xl font-medium text-[#FF6B00]">{s.price.toLocaleString('uk-UA')} ₴</div>
                <span className="flex items-center gap-1 text-xs text-white/60 group-hover:text-white">
                  Детальніше <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/catalog" className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-xs tracking-wide hover:border-white/50">
          Усі моделі <ArrowRight size={14} />
        </Link>
      </div>
    </PageShell>
  );
}
