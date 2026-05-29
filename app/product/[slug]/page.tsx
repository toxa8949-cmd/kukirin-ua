import Link from 'next/link';
import Image from 'next/image';
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
import { getAllProducts, getProductBySlug } from '@/lib/data/products';
import {
  getLongDescription,
  getFAQ,
  getVideoUrl,
  extractYouTubeId,
  getVideoTitle,
  getExtraSpecs,
  getFeatureList,
} from '@/lib/data/product-extras';

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

    // Опис під топ-сніпети: модель + ключові специфікації + ціна + переваги
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

  const all = await getAllProducts().catch(() => []);
  const related = all.filter((r) => r.slug !== scooter.slug).slice(0, 3);

  const primaryImage = scooter.gallery?.[0] ?? scooter.image ?? null;

  // Безпечні дефолти
  const safeName     = scooter.name ?? 'KUKIRIN';
  const safeTagline  = scooter.tagline ?? '';
  const safeCategory = scooter.category ?? 'urban';
  const safeBattery  = scooter.battery ?? '—';
  const safePower    = Number.isFinite(scooter.power)    ? scooter.power    : 0;
  const safeSpeed    = Number.isFinite(scooter.maxSpeed) ? scooter.maxSpeed : 0;
  const safeRange    = Number.isFinite(scooter.range)    ? scooter.range    : 0;

  // SEO-розширення з specs jsonb (усе опційне)
  const longDescription = getLongDescription(scooter.specs);
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
    { icon: Shield, label: 'Гарантія',  value: extra.warranty || 'Офіційна' },
    { icon: Wrench, label: 'Сервіс',    value: 'Власні майстерні' },
    { icon: Phone,  label: 'Підтримка', value: '0 (95) 898-10-07' },
  ];

  // Збираємо JSON-LD масив динамічно
  const jsonLdData: Record<string, unknown>[] = [
    productSchema({
      name: safeName,
      slug: scooter.slug,
      description: scooter.description,
      price: Number(scooter.price),
      oldPrice: scooter.oldPrice,
      images: scooter.gallery && scooter.gallery.length > 0 ? scooter.gallery : (primaryImage ? [primaryImage] : []),
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
    }),
    breadcrumbSchema([
      { name: 'Головна', url: '/' },
      { name: 'Каталог', url: '/catalog' },
      { name: safeName, url: `/product/${scooter.slug}` },
    ]),
  ];
  if (faq.length > 0) {
    jsonLdData.push(faqSchema(faq));
  }
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
        {/* Visual */}
        <div className="relative aspect-square overflow-hidden rounded-md border border-[#E8E6DE] bg-white dark:border-white/10 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:to-[#0a0a0a]">
          <Image
            src="/logo-mark.png"
            alt=""
            width={384}
            height={242}
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -bottom-8 h-72 w-auto opacity-[0.06] select-none dark:opacity-[0.10]"
          />
          <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
            {scooter.badge && (
              <span className="rounded-sm bg-[#FF6B00] px-2 py-1 text-[10px] font-medium tracking-[0.15em] text-white dark:text-black">
                {scooter.badge.toUpperCase()}
              </span>
            )}
            <span className="rounded-sm border border-[#E8E6DE] bg-white/80 px-2 py-1 text-[10px] tracking-[0.15em] text-[#4A4A48] backdrop-blur dark:border-white/20 dark:bg-transparent dark:text-white/70">
              KUKIRIN · 2026
            </span>
          </div>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={`${safeName} — електросамокат KUKIRIN`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-10"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#FF6B00]/30">
              <div className="text-center">
                <div className="text-7xl font-medium tracking-tight">{placeholderLabel}</div>
                <div className="mt-2 text-xs tracking-[0.3em] text-[#6C6A65] dark:text-white/30">
                  // {safeTagline ? safeTagline.toUpperCase() : 'KUKIRIN'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 text-[11px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // {safeCategory.toUpperCase()}
          </div>
          <h1 className="mb-2 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{safeName}</h1>
          <p className="mb-6 text-sm text-[#4A4A48] dark:text-white/55">
            {safeTagline || 'Електросамокат KUKIRIN'}. Офіційно від KUKIRIN.UA з гарантією та сервісом.
          </p>

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

          {/* Ключові переваги — з specs.features або дефолтні */}
          <ul className="mb-6 space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
            {(featuresList.length > 0
              ? featuresList
              : [
                  'Офіційна гарантія',
                  'Доставка Новою Поштою',
                  'Доступне розтермінування',
                  'Передпродажна підготовка',
                ]
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

      {/* Розширений опис (SEO-текст) */}
      {longDescription && (
        <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
          <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
            // ДЕТАЛЬНИЙ ОГЛЯД
          </div>
          <h2 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
            Про {safeName}
          </h2>
          <div className="prose-kukirin max-w-none whitespace-pre-line text-[15px] leading-relaxed text-[#4A4A48] dark:text-white/70">
            {longDescription}
          </div>
        </section>
      )}

      {/* Детальна таблиця характеристик */}
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
            ['Гарантія', extra.warranty || '12 місяців'],
          ]
            .filter((x): x is [string, string] => x !== null)
            .map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between gap-4 border-b border-[#E8E6DE] py-3 dark:border-white/10"
              >
                <dt className="text-sm text-[#6C6A65] dark:text-white/55">{k}</dt>
                <dd className="text-right text-sm font-medium">{v}</dd>
              </div>
            ))}
        </dl>
      </section>

      {/* Відео-огляд */}
      {videoId && (
        <ProductVideo youtubeId={videoId} title={videoTitle || `${safeName} — огляд`} />
      )}

      {/* FAQ */}
      {faq.length > 0 && <ProductFAQ items={faq} />}

      {/* Features бар */}
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
