/**
 * Рендерить JSON-LD структуровані дані у <script type="application/ld+json">.
 *
 * Server component — рендериться у SSR, Google бачить розмітку одразу.
 * Нічого візуально не показує, тільки додає невидимий скрипт для пошуковиків.
 *
 * Використання:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Product', ... }} />
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify безпечно екранує дані; розмітка не з користувацького вводу
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE = 'https://kukirinstore.com.ua';

/** Organization — інфо про компанію (головна сторінка). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KUKIRIN.UA',
    url: SITE,
    logo: `${SITE}/logo-full.png`,
    description: 'Офіційний дистрибʼютор електросамокатів KUKIRIN в Україні.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380800338899',
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

/** WebSite — назва сайту + пошук (головна). */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KUKIRIN.UA',
    url: SITE,
    inLanguage: 'uk-UA',
  };
}

/** Product — товар з ціною та наявністю (сторінка товара). */
export function productSchema(p: {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image?: string | null;
  inStock?: boolean;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description || `Електросамокат ${p.name} — офіційно від KUKIRIN.UA.`,
    image: p.image ? [p.image] : undefined,
    brand: {
      '@type': 'Brand',
      name: 'KUKIRIN',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/product/${p.slug}`,
      priceCurrency: 'UAH',
      price: p.price,
      availability: p.inStock === false
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'KUKIRIN.UA',
      },
    },
  };
}

/** BreadcrumbList — хлібні крихти. items: [{name, url}] */
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

/** Article — стаття блогу. */
export function articleSchema(a: {
  title: string;
  slug: string;
  excerpt?: string | null;
  image?: string | null;
  publishedAt?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt || undefined,
    image: a.image ? [a.image] : undefined,
    datePublished: a.publishedAt || undefined,
    author: {
      '@type': 'Organization',
      name: 'KUKIRIN.UA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KUKIRIN.UA',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE}/logo-full.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE}/blog/${a.slug}`,
    },
  };
}
