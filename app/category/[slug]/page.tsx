import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import JsonLd, { breadcrumbSchema, itemListSchema } from '@/components/seo/JsonLd';
import { getCategoryBySlug } from '@/lib/data/categories';
import { getProductsByCategorySlug } from '@/lib/data/products';

export const revalidate = 120; // кеш 2 хв

const SITE = 'https://kukirinstore.com.ua';

/**
 * SEO-розширені описи й ключові слова для legacy-категорій.
 * Якщо в БД є власна категорія з тим самим slug — переважає БД.
 */
const LEGACY_INFO: Record<
  string,
  {
    title: string;
    subtitle: string;
    badge: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  }
> = {
  urban: {
    title: 'Міські електросамокати',
    subtitle:
      'Легкі, компактні, надійні. Ідеальні для щоденних поїздок містом — на роботу, в університет, у магазин.',
    badge: 'URBAN · ЩОДЕННО',
    metaTitle: 'Міські електросамокати KUKIRIN — купити в Україні',
    metaDescription:
      'Електросамокати KUKIRIN для міста — легкі, маневрені, з пробігом до 60 км. Купити в Україні з офіційною гарантією та доставкою Новою Поштою.',
    keywords: [
      'міські електросамокати',
      'електросамокати для міста',
      'kukirin urban',
      'купити міський електросамокат',
      'легкий електросамокат',
    ],
  },
  offroad: {
    title: 'Off-road електросамокати',
    subtitle:
      "Потужні мотори, м'яка підвіска і всюдихідні шини. Ґрунтівка, парк, пагорб — без обмежень.",
    badge: 'OFFROAD · ЕКСТРИМ',
    metaTitle: 'Off-road електросамокати KUKIRIN — для бездоріжжя',
    metaDescription:
      "Off-road електросамокати KUKIRIN з потужними моторами і всюдихідними шинами. Купити в Києві з гарантією та сервісом. Доставка по Україні.",
    keywords: [
      'off-road електросамокат',
      'позашляховий електросамокат',
      'електросамокат для бездоріжжя',
      'kukirin offroad',
      'потужний електросамокат',
    ],
  },
  flagship: {
    title: 'Флагманські електросамокати KUKIRIN',
    subtitle:
      'Топ лінійки KUKIRIN: дуальні мотори, до 70 км/год, максимальний запас ходу та преміум-комплектація.',
    badge: 'FLAGSHIP · ТОП',
    metaTitle: 'Флагмани KUKIRIN — найпотужніші електросамокати',
    metaDescription:
      'Флагманські електросамокати KUKIRIN: дуальні мотори до 2400W, швидкість до 70 км/год, запас ходу 80+ км. Купити з гарантією та доставкою по Україні.',
    keywords: [
      'флагман kukirin',
      'потужний електросамокат',
      'kukirin g4 max',
      'kukirin g2 master',
      'швидкий електросамокат',
      'електросамокат 70 км/год',
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug).catch(() => null);
  const info = LEGACY_INFO[slug];

  // 1) Категорія є в БД
  if (cat) {
    return {
      title: `${cat.name} — KUKIRIN.UA`,
      description:
        cat.description ??
        `Електросамокати KUKIRIN категорії ${cat.name}. Офіційна гарантія, доставка Новою Поштою по Україні.`,
      alternates: { canonical: `/category/${slug}` },
      openGraph: {
        title: `${cat.name} — KUKIRIN.UA`,
        description: cat.description ?? `Електросамокати KUKIRIN — ${cat.name}`,
        url: `${SITE}/category/${slug}`,
        type: 'website',
        locale: 'uk_UA',
        siteName: 'KUKIRIN.UA',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: cat.name }],
      },
    };
  }

  // 2) Legacy-категорія
  if (info) {
    return {
      title: info.metaTitle,
      description: info.metaDescription,
      keywords: info.keywords,
      alternates: { canonical: `/category/${slug}` },
      openGraph: {
        title: info.metaTitle,
        description: info.metaDescription,
        url: `${SITE}/category/${slug}`,
        type: 'website',
        locale: 'uk_UA',
        siteName: 'KUKIRIN.UA',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: info.title }],
      },
    };
  }

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
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Головна', url: '/' },
            { name: 'Каталог', url: '/catalog' },
            { name: title, url: `/category/${slug}` },
          ]),
          itemListSchema(
            list.map((s) => ({
              name: s.name,
              url: `/product/${s.slug}`,
            }))
          ),
        ]}
      />

      {list.length === 0 ? (
        <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 p-8 text-center text-[#4A4A48] dark:text-white/55">
          У цій категорії поки немає товарів.{' '}
          <Link href="/catalog" className="text-[#FF6B00] hover:underline">Дивитись усі моделі →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <Link
              key={s.slug}
              href={`/product/${s.slug}`}
              className="group flex flex-col rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">{s.battery || '—'}</span>
                {s.badge && (
                  <span className="rounded-sm bg-[#FF6B00] px-2 py-0.5 text-[9px] font-medium tracking-[0.15em] text-white dark:text-black">
                    {s.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="mb-1 text-lg font-medium tracking-tight">{s.name}</div>
              <div className="mb-4 text-xs text-[#6C6A65] dark:text-white/45">{s.tagline}</div>
              <div className="mb-4 grid grid-cols-3 gap-2 border-y border-[#E8E6DE] dark:border-white/10 py-3 text-center">
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
                <div className="text-xl font-medium text-[#FF6B00]">{Number(s.price).toLocaleString('uk-UA')} ₴</div>
                <span className="flex items-center gap-1 text-xs text-[#4A4A48] dark:text-white/60 group-hover:text-[#1a1a1a]">
                  Детальніше <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/catalog" className="inline-flex items-center gap-2 rounded-sm border border-[#E8E6DE] dark:border-white/25 px-6 py-3 text-xs tracking-wide hover:border-[#DCDAD0] dark:hover:border-white/50">
          Усі моделі <ArrowRight size={14} />
        </Link>
      </div>
    </PageShell>
  );
}
