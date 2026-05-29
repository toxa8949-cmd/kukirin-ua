import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Phone, Truck, Shield, Wrench } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import AddToCartButton from '@/components/cart/AddToCartButton';
import JsonLd, {
  productSchema,
  breadcrumbSchema,
  faqSchema,
  videoSchema,
} from '@/components/seo/JsonLd';
import ProductFAQ from '@/components/product/ProductFAQ';
import ProductVideo from '@/components/product/ProductVideo';
import ProductReviews from '@/components/product/ProductReviews';
import ProductGallery from '@/components/product/ProductGallery';
import ReviewStars from '@/components/product/ReviewStars';
import { getAllProducts, getProductBySlug } from '@/lib/data/products';
import { getReviewsForProduct, getAggregateRating } from '@/lib/data/reviews';
import {
  getLongDescription,
  getFAQ,
  getVideoUrl,
  extractYouTubeId,
  getVideoTitle,
  getExtraSpecs,
  getFeatureList,
} from '@/lib/data/product-extras';
import { renderMarkdown } from '@/lib/markdown';

export const revalidate = 120; // кеш 2 хв

const SITE = 'https://kukirinstore.com.ua';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const s = await getProductBySlug(slug).catch(() => null);
    if (!s) return { title: 'Модель не знайдена' };

    const specs: string[] = [];
    if (s.power)    specs.push(`${s.power}Вт`);
    if (s.maxSpeed) specs.push(`до ${s.maxSpeed} км/год`);
    if (s.range)    specs.push(`запас ходу ${s.range} км`);
    if (s.battery)  specs.push(`батарея ${s.battery}`);
    const specsStr = specs.length ? specs.join(', ') + '. ' : '';
    const price = Number.isFinite(s.price)
      ? `Ціна ${Number(s.price).toLocaleString('uk-UA')} ₴. `
      : '';

    const description = `Електросамокат ${s.name} ${s.tagline ? `— ${s.tagline}. ` : ''}${specsStr}${price}Офіційна гарантія, безкоштовна доставка Новою Поштою, розтермінування.`;
    const ogImage = s.gallery?.[0] ?? s.image ?? '/og-image.png';

    return {
      title: `${s.name} — купити в Україні, ціна ${Number(s.price).toLocaleString('uk-UA')} ₴`,
      description: description.slice(0, 160),
      keywords: [
        s.name,
        `${s.name} купити`,
        `${s.name} ціна`,
        `${s.name} україна`,
        `${s.name} відгуки`,
        'kukirin',
        'кукірін',
        'електросамокат',
      ],
      alternates: { canonical: `/product/${slug}` },
      openGraph: {
        title: `${s.name} — KUKIRIN.UA`,
        description: description.slice(0, 200),
        url: `${SITE}/product/${slug}`,
        type: 'website',
        locale: 'uk_UA',
        siteName: 'KUKIRIN.UA',
        images: [{ url: ogImage, width: 1200, height: 630, alt: s.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${s.name} — KUKIRIN.UA`,
        description: description.slice(0, 200),
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Модель' };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scooter = await getProductBySlug(slug).catch((e) => {
    console.error('[ProductPage] getProductBySlug threw', e);
    return null;
  });
  if (!scooter) notFound();

  const [all, reviews, aggregate] = await Promise.all([
    getAllProducts().catch(() => []),
    getReviewsForProduct(scooter.id).catch(() => []),
    getAggregateRating(scooter.id).catch(() => null),
  ]);

  const related = all.filter((r) => r.slug !== scooter.slug).slice(0, 3);
  const gallery = scooter.gallery ?? [];
  const primaryImage = gallery[0] ?? scooter.image ?? null;
  const galleryRest = gallery.slice(1, 7); // показуємо до 6 додаткових мініатюр

  const safeName     = scooter.name ?? 'KUKIRIN';
  const safeTagline  = scooter.tagline ?? '';
  const safeCategory = scooter.category ?? 'urban';
  const safeBattery  = scooter.battery ?? '—';
  const safePower    = Number.isFinite(scooter.power)    ? scooter.power    : 0;
  const safeSpeed    = Number.isFinite(scooter.maxSpeed) ? scooter.maxSpeed : 0;
  const safeRange    = Number.isFinite(scooter.range)    ? scooter.range    : 0;

  // SEO-розширення з specs jsonb
  const longDescription = getLongDescription(scooter.specs);
  const longDescriptionHtml = longDescription ? renderMarkdown(longDescription) : '';
  const faq = getFAQ(scooter.specs);
  const videoUrl = getVideoUrl(scooter.specs);
  const videoId = extractYouTubeId(videoUrl);
  const videoTitle = getVideoTitle(scooter.specs);
  const extra = getExtraSpecs(scooter.specs);
  const featuresList = getFeatureList(scooter.specs);

  const placeholderLabel = (() => {
    const parts = safeName.split(' ').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : 'KUKIRIN';
  })();

  const features = [
    { icon: Truck,  label: 'Доставка',  value: 'Новою Поштою по Україні' },
    { icon: Shield, label: 'Гарантія',  value: extra.warranty || '3 місяці' },
    { icon: Wrench, label: 'Сервіс',    value: 'Власні майстерні' },
    { icon: Phone,  label: 'Підтримка', value: '0 (95) 898-10-07' },
  ];

  const jsonLdData: Record<string, unknown>[] = [
    productSchema({
      name: safeName,
      slug: scooter.slug,
      description: scooter.description,
      price: Number(scooter.price),
      oldPrice: scooter.oldPrice,
      images: gallery.length > 0 ? gallery : (primaryImage ? [primaryImage] : []),
      inStock: (scooter.stock ?? 0) > 0,
      sku: extra.sku,
      mpn: extra.mpn,
      gtin: extra.gtin,
      weight: extra.weight,
      color: extra.color,
      power: safePower || undefined,
      maxSpeed: safeSpeed || undefined,
      range: safeRange || undefined,
      battery: safeBattery !== '—' ? safeBattery : undefined,
      ratingValue: aggregate?.ratingValue,
      ratingCount: aggregate?.ratingCount,
    }),
    breadcrumbSchema([
      { name: 'Головна', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: safeName, url: `/product/${scooter.slug}` },
    ]),
  ];
  if (faq.length > 0) jsonLdData.push(faqSchema(faq));
  if (videoId && primaryImage) {
    jsonLdData.push(
      videoSchema({
        name: videoTitle || `${safeName} — відео-огляд`,
        description: scooter.description || `Огляд електросамоката ${safeName}`,
        thumbnailUrl: primaryImage.startsWith('http') ? primaryImage : `${SITE}${primaryImage}`,
        youtubeId: videoId,
      })
    );
  }

  return (
    <PageShell breadcrumb={`PRODUCT · ${scooter.slug.toUpperCase()}`}>
      <JsonLd data={jsonLdData} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Visual block з галереєю (клікабельна, з lightbox) */}
        <ProductGallery
          images={gallery.length > 0 ? gallery.slice(0, 7) : (primaryImage ? [primaryImage] : [])}
          name={safeName}
          tagline={safeTagline}
          badge={scooter.badge ?? null}
        />

        {/* Details */}
        <div>
          <div className="mb-2 text-[11px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // {safeCategory.toUpperCase()}
          </div>
          <h1 className="mb-2 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{safeName}</h1>
          <p className="mb-4 text-sm text-[#4A4A48] dark:text-white/55">
            {safeTagline || 'Електросамокат KUKIRIN'}. Офіційно від KUKIRIN.UA з гарантією та сервісом.
          </p>

          {/* Rating snippet — видно одразу під підзаголовком */}
          {aggregate && (
            <a href="#reviews" className="mb-4 inline-flex items-center gap-2 text-sm hover:underline">
              <ReviewStars value={aggregate.ratingValue} size={14} />
              <span className="text-[#4A4A48] dark:text-white/65">
                <strong>{aggregate.ratingValue.toFixed(1)}</strong> ·{' '}
                {aggregate.ratingCount} {aggregate.ratingCount === 1 ? 'відгук' : 'відгуків'}
              </span>
            </a>
          )}

          <div className="mb-6 flex items-end gap-3">
            <div className="text-3xl font-medium text-[#FF6B00] sm:text-4xl">
              {Number(scooter.price).toLocaleString('uk-UA')} ₴
            </div>
            {scooter.oldPrice && (
              <div className="text-base text-[#6C6A65] dark:text-white/30 line-through">
                {Number(scooter.oldPrice).toLocaleString('uk-UA')} ₴
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              slug={scooter.slug}
              name={safeName}
              price={Number(scooter.price)}
              image={primaryImage}
            />
            <Link href="/test-drive" className="inline-flex items-center justify-center rounded-sm border border-[#E8E6DE] dark:border-white/25 px-6 py-3 text-xs font-medium tracking-wide text-[#1a1a1a] dark:text-white transition hover:border-[#DCDAD0] dark:hover:border-white/50">
              Тест-драйв
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 p-3">
              <div className="text-xl font-medium">
                {safePower > 0 ? safePower : '—'}
                {safePower > 0 && <span className="ml-1 text-xs text-[#6C6A65] dark:text-white/40">W</span>}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">МОТОР</div>
            </div>
            <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 p-3">
              <div className="text-xl font-medium">
                {safeSpeed > 0 ? safeSpeed : '—'}
                {safeSpeed > 0 && <span className="ml-1 text-xs text-[#6C6A65] dark:text-white/40">km/h</span>}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">ШВИДКІСТЬ</div>
            </div>
            <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 p-3">
              <div className="text-xl font-medium">
                {safeRange > 0 ? safeRange : '—'}
                {safeRange > 0 && <span className="ml-1 text-xs text-[#6C6A65] dark:text-white/40">km</span>}
              </div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">ЗАПАС</div>
            </div>
            <div className="rounded-sm border border-[#E8E6DE] dark:border-white/10 p-3">
              <div className="text-xs font-medium">{safeBattery}</div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">БАТАРЕЯ</div>
            </div>
          </div>

          <ul className="mb-6 space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
            {(featuresList.length > 0
              ? featuresList
              : ['Офіційна гарантія', 'Доставка Новою Поштою', 'Доступне розтермінування', 'Передпродажна підготовка']
            ).map((f, i) => (
              <li key={i} className="flex gap-2">
                <Check size={16} className="mt-0.5 text-[#FF6B00]" /> {f}
              </li>
            ))}
          </ul>

          {scooter.description && (
            <div className="prose mt-2 max-w-none text-sm leading-relaxed text-[#4A4A48] dark:text-white/65">
              <p>{scooter.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Розширений опис — рендериться як Markdown (заголовки, жирне, списки) */}
      {longDescriptionHtml && (
        <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
          <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // ДЕТАЛЬНИЙ ОГЛЯД
          </div>
          <h2 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
            Про {safeName}
          </h2>
          <div
            className="prose-kukirin max-w-none text-[15px] leading-relaxed text-[#4A4A48] dark:text-white/70"
            dangerouslySetInnerHTML={{ __html: longDescriptionHtml }}
          />
        </section>
      )}

      <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
        <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
          // ХАРАКТЕРИСТИКИ
        </div>
        <h2 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
          Технічні характеристики
        </h2>
        <dl className="grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2">
          {[
            ['Модель', safeName],
            ['Категорія', safeCategory === 'urban' ? 'Міський' : safeCategory === 'offroad' ? 'Off-road' : 'Флагман'],
            safePower    ? ['Потужність двигуна', `${safePower} Вт`] : null,
            safeSpeed    ? ['Максимальна швидкість', `${safeSpeed} км/год`] : null,
            safeRange    ? ['Запас ходу', `до ${safeRange} км`] : null,
            safeBattery !== '—' ? ['Батарея', safeBattery] : null,
            extra.chargingTime ? ['Час заряджання', extra.chargingTime] : null,
            extra.tireSize ? ['Розмір коліс', extra.tireSize] : null,
            extra.weight ? ['Вага', `${extra.weight} кг`] : null,
            extra.loadCapacity ? ['Макс. навантаження', `${extra.loadCapacity} кг`] : null,
            extra.dimensions ? ['Габарити', extra.dimensions] : null,
            extra.ipRating ? ['Захист від вологи', extra.ipRating] : null,
            extra.color ? ['Колір', extra.color] : null,
            ['Гарантія', extra.warranty || '3 місяці'],
          ]
            .filter((x): x is [string, string] => x !== null)
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-[#E8E6DE] py-3 dark:border-white/10">
                <dt className="text-sm text-[#6C6A65] dark:text-white/55">{k}</dt>
                <dd className="text-right text-sm font-medium">{v}</dd>
              </div>
            ))}
        </dl>
      </section>

      {videoId && <ProductVideo youtubeId={videoId} title={videoTitle || `${safeName} — огляд`} />}

      {faq.length > 0 && <ProductFAQ items={faq} />}

      {/* ВІДГУКИ — з anchor link для jump from rating snippet */}
      <div id="reviews">
        <ProductReviews
          productId={scooter.id}
          productSlug={scooter.slug}
          productName={safeName}
          initialReviews={reviews}
          aggregate={aggregate}
        />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 border-t border-[#E8E6DE] dark:border-white/10 pt-8 sm:grid-cols-4">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <f.icon size={20} className="text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">{f.label.toUpperCase()}</div>
            <div className="text-sm">{f.value}</div>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-12 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Інші моделі</h2>
            <Link href="/catalog" className="text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a]">Усі моделі →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/product/${s.slug}`} className="group rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-4 transition hover:border-[#FF6B00]">
                <div className="mb-1 text-sm font-medium">{s.name}</div>
                <div className="mb-3 text-xs text-[#6C6A65] dark:text-white/45">{s.tagline}</div>
                <div className="flex items-end justify-between">
                  <div className="text-lg font-medium text-[#FF6B00]">{Number(s.price).toLocaleString('uk-UA')} ₴</div>
                  <span className="text-xs text-[#4A4A48] dark:text-white/60 group-hover:text-[#1a1a1a]">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
