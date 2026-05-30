/**
 * Рендерить JSON-LD структуровані дані у <script type="application/ld+json">.
 *
 * Server component — рендериться у SSR, Google бачить розмітку одразу.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE = 'https://kukirinstore.com.ua';
const BRAND = 'kukirinstore.com.ua';
const LOGO = `${SITE}/logo-full.png`;

const publisher = {
  '@type': 'Organization',
  name: BRAND,
  url: SITE,
  logo: { '@type': 'ImageObject', url: LOGO },
};

/** Organization — інфо про компанію. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: SITE,
    logo: LOGO,
    description: 'Офіційний дистрибʼютор електросамокатів KUKIRIN в Україні.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380958981007',
      contactType: 'customer service',
      areaServed: 'UA',
      availableLanguage: ['Ukrainian'],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Київ',
      streetAddress: 'вул. Ревуцького, 40В',
      addressCountry: 'UA',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
    url: SITE,
    inLanguage: 'uk-UA',
  };
}

/**
 * Product — розширений варіант для топових результатів пошуку.
 * Включає: brand, model, sku, image gallery, offers з availability/priceValidUntil,
 * additionalProperty (всі специфікації), aggregateRating (якщо є відгуки),
 * shippingDetails, hasMerchantReturnPolicy.
 */
export function productSchema(p: {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  images?: (string | null | undefined)[] | null;
  image?: string | null; // legacy
  inStock?: boolean;
  sku?: string | null;
  mpn?: string | null;
  gtin?: string | null;
  weight?: number | null; // кг
  color?: string | null;
  power?: number | null;
  maxSpeed?: number | null;
  range?: number | null;
  battery?: string | null;
  ratingValue?: number | null;
  ratingCount?: number | null;
}) {
  const url = `${SITE}/product/${p.slug}`;
  // Усі фото товара, фільтруємо null/undefined
  const imgList = p.images && p.images.length > 0
    ? p.images.filter((x): x is string => !!x)
    : (p.image ? [p.image] : []);

  // priceValidUntil — рік уперед від дати рендерингу
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);

  // Специфікації як additionalProperty
  const additionalProperty: Array<Record<string, unknown>> = [];
  if (p.power)    additionalProperty.push({ '@type': 'PropertyValue', name: 'Потужність',      value: `${p.power} Вт` });
  if (p.maxSpeed) additionalProperty.push({ '@type': 'PropertyValue', name: 'Максимальна швидкість', value: `${p.maxSpeed} км/год` });
  if (p.range)    additionalProperty.push({ '@type': 'PropertyValue', name: 'Запас ходу',      value: `${p.range} км` });
  if (p.battery)  additionalProperty.push({ '@type': 'PropertyValue', name: 'Батарея',         value: p.battery });

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description || `Електросамокат ${p.name} — офіційно від ${BRAND}.`,
    image: imgList.length > 0 ? imgList : undefined,
    sku: p.sku || p.slug.toUpperCase(),
    mpn: p.mpn || p.slug.toUpperCase(),
    brand: { '@type': 'Brand', name: 'KUKIRIN' },
    manufacturer: { '@type': 'Organization', name: 'KUKIRIN' },
    category: 'Електросамокати',
    url,
  };

  if (p.gtin) schema.gtin13 = p.gtin;
  if (p.weight) schema.weight = { '@type': 'QuantitativeValue', value: p.weight, unitCode: 'KGM' };
  if (p.color) schema.color = p.color;
  if (additionalProperty.length) schema.additionalProperty = additionalProperty;

  // Offer
  schema.offers = {
    '@type': 'Offer',
    url,
    priceCurrency: 'UAH',
    price: p.price,
    priceValidUntil,
    availability: p.inStock === false
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: BRAND, url: SITE },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'UA',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: 0,
        currency: 'UAH',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'UA',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        transitTime:  { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
      },
    },
  };

  // AggregateRating — тільки якщо реально є відгуки
  if (p.ratingValue && p.ratingCount && p.ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: p.ratingValue,
      reviewCount: p.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

/** BreadcrumbList — хлібні крихти. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE}${it.url}`,
    })),
  };
}

/** Article / BlogPosting — стаття блогу. */
export function articleSchema(a: {
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  section?: string | null;
  keywords?: string[] | null;
}) {
  const url = `${SITE}/blog/${a.slug}`;
  const headline = a.title.length > 110 ? `${a.title.slice(0, 107)}...` : a.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    name: a.title,
    description: a.excerpt || undefined,
    image: a.image ? [a.image] : undefined,
    datePublished: a.publishedAt || undefined,
    dateModified: a.updatedAt || a.publishedAt || undefined,
    inLanguage: 'uk-UA',
    articleSection: a.section || 'Електросамокати',
    keywords: a.keywords && a.keywords.length ? a.keywords.join(', ') : undefined,
    author: { '@type': 'Organization', name: BRAND, url: SITE },
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

/** Blog — індекс блогу зі списком статей. */
export function blogSchema(items: Array<{
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  publishedAt?: string | null;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Блог · ${BRAND}`,
    url: `${SITE}/blog`,
    description: 'Новини, огляди та поради про електросамокати KUKIRIN.',
    inLanguage: 'uk-UA',
    publisher,
    blogPost: items.map((it) => ({
      '@type': 'BlogPosting',
      headline: it.title.length > 110 ? `${it.title.slice(0, 107)}...` : it.title,
      url: `${SITE}/blog/${it.slug}`,
      description: it.excerpt || undefined,
      image: it.image ? [it.image] : undefined,
      datePublished: it.publishedAt || undefined,
    })),
  };
}

/** FAQPage — список питань/відповідей. */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.a,
      },
    })),
  };
}

/**
 * VideoObject — для відео-огляду товара.
 * youtubeId або повний URL — функція спробує витягти id з youtube.com / youtu.be.
 */
export function videoSchema(v: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  url?: string;
  youtubeId?: string;
}) {
  let contentUrl: string | undefined;
  let embedUrl: string | undefined;
  if (v.youtubeId) {
    contentUrl = `https://www.youtube.com/watch?v=${v.youtubeId}`;
    embedUrl = `https://www.youtube.com/embed/${v.youtubeId}`;
  } else if (v.url) {
    contentUrl = v.url;
    const m = v.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    if (m) embedUrl = `https://www.youtube.com/embed/${m[1]}`;
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.name,
    description: v.description,
    thumbnailUrl: [v.thumbnailUrl],
    uploadDate: v.uploadDate || new Date().toISOString().slice(0, 10),
    contentUrl,
    embedUrl,
    publisher,
  };
}

/**
 * LocalBusiness / Store — для геопошуку у Google ("електросамокати київ", "магазин кукірін").
 * Дає карточку магазину з адресою, годинами, телефоном у результатах пошуку,
 * а також підвищує шанси з'явитись у Google Maps і "Поруч зі мною".
 *
 * Тип Store наслідує LocalBusiness — обидва типи валідні для Google.
 */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE}/#localbusiness`,
    name: BRAND,
    image: [LOGO, `${SITE}/og-image.png`],
    url: SITE,
    telephone: '+380958981007',
    email: 'info@kukirin.ua',
    priceRange: '15000 ₴ – 80000 ₴',
    description: 'Офіційний магазин електросамокатів KUKIRIN у Києві. Шоурум, тест-драйв, сервіс, доставка по Україні.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Ревуцького, 40В',
      addressLocality: 'Київ',
      addressRegion: 'Київська обл.',
      postalCode: '02091',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.4001,
      longitude: 30.6429,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:30',
        closes: '16:30',
      },
    ],
    areaServed: { '@type': 'Country', name: 'Україна' },
    currenciesAccepted: 'UAH',
    paymentAccepted: 'Готівка, Картка, Розтермінування ПриватБанк, Розтермінування Monobank, Накладений платіж',
    sameAs: [
      // Сюди можна додати посилання на соц-мережі (Instagram, Facebook, YouTube),
      // коли вони будуть — Google використовує це для зв'язку профілів з організацією.
    ],
  };
}

/**
 * ItemList — для сторінок каталогу і категорій.
 * Підказує Google що це список товарів, а не просто текст;
 * допомагає індексувати товари через сторінку-список.
 *
 * Передавай повний URL у items, або відносний (буде додано SITE).
 */
export function howToSchema(h: {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration, e.g. 'PT10M' for 10 minutes
  estimatedCost?: { currency: string; value: number };
  supply?: string[];
  tool?: string[];
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: h.name,
    description: h.description,
    ...(h.image && { image: h.image }),
    ...(h.totalTime && { totalTime: h.totalTime }),
    ...(h.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: h.estimatedCost.currency,
        value: h.estimatedCost.value,
      },
    }),
    ...(h.supply && {
      supply: h.supply.map((s) => ({ '@type': 'HowToSupply', name: s })),
    }),
    ...(h.tool && {
      tool: h.tool.map((t) => ({ '@type': 'HowToTool', name: t })),
    }),
    step: h.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image && { image: s.image }),
      ...(s.url && { url: s.url }),
    })),
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url.startsWith('http') ? it.url : `${SITE}${it.url}`,
    })),
  };
}

