import { notFound } from 'next/navigation';
import PageShell from '@/components/kukirin/PageShell';
import CompareTable from '@/components/compare/CompareTable';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';
import { getProductBySlug } from '@/lib/data/products';
import { getExtraSpecs } from '@/lib/data/product-extras';

export const revalidate = 600;

const SITE = 'https://kukirinstore.com.ua';

type PageProps = {
  params: Promise<{ matchup: string }>;
};

function parseMatchup(matchup: string): [string, string] | null {
  const idx = matchup.lastIndexOf('-vs-');
  if (idx === -1) return null;
  const a = matchup.slice(0, idx);
  const b = matchup.slice(idx + 4);
  if (!a || !b || a === b) return null;
  return [a, b];
}

export async function generateMetadata({ params }: PageProps) {
  const { matchup } = await params;
  const parsed = parseMatchup(matchup);
  if (!parsed) return { title: 'Порівняння · kukirinstore.com.ua' };
  const [slugA, slugB] = parsed;
  const [a, b] = await Promise.all([getProductBySlug(slugA), getProductBySlug(slugB)]);
  if (!a || !b) return { title: 'Порівняння · kukirinstore.com.ua' };
  const title = `${a.name} vs ${b.name} — порівняння електросамокатів`;
  const description = `Що краще обрати — ${a.name} чи ${b.name}? Детальне порівняння характеристик: швидкість, потужність, запас ходу, ціна, вага. Експерти KUKIRIN допоможуть визначитися.`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${matchup}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/compare/${matchup}`,
      type: 'website',
      locale: 'uk_UA',
      siteName: 'kukirinstore.com.ua',
      images: a.image ? [{ url: a.image }] : undefined,
    },
  };
}

export default async function CompareMatchupPage({ params }: PageProps) {
  const { matchup } = await params;
  const parsed = parseMatchup(matchup);
  if (!parsed) notFound();
  const [slugA, slugB] = parsed;

  const [a, b] = await Promise.all([getProductBySlug(slugA), getProductBySlug(slugB)]);
  if (!a || !b) notFound();

  const specsA = getExtraSpecs(a.specs);
  const specsB = getExtraSpecs(b.specs);

  const sideA = {
    slug: a.slug,
    name: a.name,
    image: a.image || '/og-image.png',
    category: a.category,
    price: a.price,
    oldPrice: a.oldPrice,
    maxSpeed: a.maxSpeed,
    power: a.power,
    range: a.range,
    battery: a.battery,
    weight: specsA.weight ?? undefined,
    dimensions: specsA.dimensions ?? undefined,
    loadCapacity: specsA.loadCapacity ?? undefined,
    ipRating: specsA.ipRating ?? undefined,
    tireSize: specsA.tireSize ?? undefined,
    warranty: specsA.warranty ?? undefined,
    chargingTime: specsA.chargingTime ?? undefined,
  };

  const sideB = {
    slug: b.slug,
    name: b.name,
    image: b.image || '/og-image.png',
    category: b.category,
    price: b.price,
    oldPrice: b.oldPrice,
    maxSpeed: b.maxSpeed,
    power: b.power,
    range: b.range,
    battery: b.battery,
    weight: specsB.weight ?? undefined,
    dimensions: specsB.dimensions ?? undefined,
    loadCapacity: specsB.loadCapacity ?? undefined,
    ipRating: specsB.ipRating ?? undefined,
    tireSize: specsB.tireSize ?? undefined,
    warranty: specsB.warranty ?? undefined,
    chargingTime: specsB.chargingTime ?? undefined,
  };

  const crumbs = breadcrumbSchema([
    { name: 'Головна', url: `${SITE}/` },
    { name: 'Порівняння', url: `${SITE}/compare` },
    { name: `${a.name} vs ${b.name}`, url: `${SITE}/compare/${matchup}` },
  ]);

  return (
    <PageShell
      breadcrumb={`COMPARE / ${a.slug.toUpperCase()} VS ${b.slug.toUpperCase()}`}
      title={`${a.name} vs ${b.name}`}
      subtitle="Side-by-side порівняння характеристик. Підсвітили що краще у якій моделі."
    >
      <JsonLd data={crumbs} />
      <CompareTable a={sideA} b={sideB} />

      <div className="mt-10 rounded-sm border border-[#E8E6DE] bg-[#FAFAF7] p-6 text-sm text-[#4A4A48] dark:border-white/10 dark:bg-[#0F0F0F] dark:text-white/65">
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
          // ПОТРІБНА КОНСУЛЬТАЦІЯ?
        </div>
        <p className="leading-relaxed">
          Не можете визначитися? Зателефонуйте{' '}
          <a href="tel:+380958981007" className="font-medium text-[#FF6B00] hover:underline">
            0 (95) 898-10-07
          </a>{' '}
          — менеджер допоможе обрати модель під ваш зріст, маршрут і завдання. Або запишіться на{' '}
          <a href="/test-drive" className="font-medium text-[#FF6B00] hover:underline">тест-драйв</a>.
        </p>
      </div>
    </PageShell>
  );
}
