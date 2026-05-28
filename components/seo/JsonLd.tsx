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
const BRAND = 'KUKIRIN.UA';
const LOGO = `${SITE}/logo-full.png`;

/** Спільний publisher для всіх Article/Blog схем. */
const publisher = {
  '@type': 'Organization',
  name: BRAND,
  url: SITE,
  logo: {
    '@type': 'ImageObject',
    url: LOGO,
  },
};

/** Organization — інфо про компанію (головна сторінка). */
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

/** WebSite — назва сайту + пошук (головна). */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND,
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
    description: p.description || `Електросамокат ${p.name} — офіційно від ${BRAND}.`,
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
        name: BRAND,
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

/**
 * Article — стаття блогу. Розширений варіант, що задовольняє вимоги
 * Google Rich Results: headline ≤110 симв, image, datePublished, dateModified,
 * author, publisher з логотипом, mainEntityOfPage, inLanguage.
 */
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
  // Google рекомендує headline ≤110 символів
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
    author: {
      '@type': 'Organization',
      name: BRAND,
      url: SITE,
    },
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
  };
}

/**
 * Blog — головна сторінка блогу зі списком постів.
 * items: масив статей для blogPost[].
 */
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
