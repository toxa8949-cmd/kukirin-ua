import PageShell from '@/components/kukirin/PageShell';
import CompareSelector from '@/components/compare/CompareSelector';
import { getAllProducts } from '@/lib/data/products';

export const metadata = {
  title: 'Порівняння електросамокатів KUKIRIN — оберіть модель',
  description:
    'Порівняйте моделі KUKIRIN side-by-side: швидкість, потужність, запас ходу, вага, ціна. Допоможемо обрати найкращий самокат під ваші завдання.',
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Порівняння електросамокатів KUKIRIN',
    description: 'Side-by-side порівняння моделей KUKIRIN — оберіть найкращий під свої потреби.',
    url: 'https://kukirinstore.com.ua/compare',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'kukirinstore.com.ua',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export const revalidate = 600;

export default async function ComparePage() {
  const products = await getAllProducts().catch(() => []);
  const models = products.map((p) => ({ slug: p.slug, name: p.name }));

  return (
    <PageShell
      breadcrumb="COMPARE"
      title="Порівняння моделей"
      subtitle="Оберіть дві моделі KUKIRIN і порівняйте їх характеристики side-by-side."
    >
      <div className="mx-auto max-w-3xl">
        {models.length < 2 ? (
          <div className="rounded-sm border border-[#E8E6DE] bg-[#FAFAF7] p-8 text-center text-sm text-[#6C6A65] dark:border-white/10 dark:bg-[#0F0F0F]">
            Поки немає достатньо моделей для порівняння. Зайдіть до{' '}
            <a href="/catalog" className="text-[#FF6B00] hover:underline">каталога</a>.
          </div>
        ) : (
          <>
            <div className="rounded-sm border border-[#E8E6DE] bg-white p-6 dark:border-white/10 dark:bg-[#0F0F0F] sm:p-8">
              <CompareSelector
                models={models}
                defaultA={models[0]?.slug}
                defaultB={models[1]?.slug}
              />
            </div>

            {/* Популярні порівняння — швидкий вибір */}
            {models.length >= 3 && (
              <div className="mt-8">
                <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">
                  // ПОПУЛЯРНІ ПОРІВНЯННЯ
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    [models[0], models[1]],
                    [models[0], models[2]],
                    [models[1], models[2]],
                  ]
                    .filter(([x, y]) => x && y && x.slug !== y.slug)
                    .map(([x, y]) => (
                      <a
                        key={`${x!.slug}-${y!.slug}`}
                        href={`/compare/${x!.slug}-vs-${y!.slug}`}
                        className="inline-flex items-center gap-2 rounded-sm border border-[#E8E6DE] bg-white px-3 py-2 text-xs text-[#1a1a1a] transition hover:border-[#FF6B00] dark:border-white/10 dark:bg-[#0F0F0F] dark:text-white"
                      >
                        {x!.name.replace(/^kukirin\s*/i, '')}
                        <span className="text-[#FF6B00]">vs</span>
                        {y!.name.replace(/^kukirin\s*/i, '')}
                      </a>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
