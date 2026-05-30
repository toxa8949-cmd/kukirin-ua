import { PackageSearch, ShoppingCart } from 'lucide-react';
import Logo from '@/components/kukirin/Logo';
import MobileMenu from '@/components/site/MobileMenu';
import KukirinHeroSlider, { type HeroModel } from './KukirinHeroSlider';
import { getAllProducts } from '@/lib/data/products';

// Порядок моделей у слайдері (зверху вниз): G4 → G2 Master → G2 Pro
const HERO_SLUGS_ORDERED = [
  'kukirin-g4-max-dual',
  'kukirin-g2-master-dual-2025',
  'kukirin-g2-pro',
];

// Опційні Tech-Sheet розміри (показуються як H: і L:). Якщо моделі немає —
// fallback "—".
const TECH_DIMS: Record<string, { h: string; l: string }> = {
  'kukirin-g4-max-dual':         { h: '1280mm', l: '1280mm' },
  'kukirin-g2-master-dual-2025': { h: '1220mm', l: '1240mm' },
  'kukirin-g2-pro':              { h: '1156mm', l: '1206mm' },
};

// Hero-фото без фону (PNG з transparent background).
// Файли лежать у /public/hero/ і повинні мати ці точні імена.
const HERO_IMAGES: Record<string, string> = {
  'kukirin-g2-pro':              '/hero/g2-pro.png',
  'kukirin-g2-master-dual-2025': '/hero/g2-master.png',
  'kukirin-g4-max-dual':         '/hero/g4-max.png',
};

// Fallback модель, якщо БД порожня — щоб сторінка не падала
const FALLBACK: HeroModel = {
  slug: 'kukirin-g2-pro',
  name: 'KUKIRIN G2 PRO',
  shortName: 'G2 PRO',
  number: '01',
  category: 'FLAGSHIP',
  tagline: 'Daily flagship',
  image: '/hero/g2-pro.png',
  height: '1156mm',
  length: '1206mm',
  stats: [
    { value: '45', unit: 'km/h', label: 'МАКС. ШВИДКІСТЬ' },
    { value: '600',  unit: 'W',   label: 'МОТОР' },
    { value: '50',  unit: 'km',  label: 'ЗАПАС ХОДУ' },
    { value: '48V', unit: '',    label: 'БАТАРЕЯ' },
  ],
  bottomLabel: 'FLAGSHIP · 600W · 45 KM/H',
};

function toHeroModel(
  p: {
    slug: string;
    name: string;
    category?: string;
    tagline?: string;
    image?: string | null;
    power?: number;
    maxSpeed?: number;
    range?: number;
    battery?: string;
  },
  idx: number,
): HeroModel {
  const dims = TECH_DIMS[p.slug] ?? { h: '—', l: '—' };
  const category = (p.category || 'urban').toUpperCase();
  const isDual = (p.power ?? 0) >= 1500;
  const shortName = p.name.replace(/^kukirin\s*/i, '').toUpperCase();
  return {
    slug: p.slug,
    name: p.name.toUpperCase(),
    shortName,
    number: String(idx + 1).padStart(2, '0'),
    category,
    tagline: p.tagline ?? '',
    image: HERO_IMAGES[p.slug] || p.image || '/hero/g2-pro.png',
    height: dims.h,
    length: dims.l,
    stats: [
      { value: String(p.maxSpeed ?? '—'), unit: 'km/h', label: 'МАКС. ШВИДКІСТЬ' },
      { value: String(p.power ?? '—'),    unit: 'W',    label: isDual ? 'DUAL MOTOR' : 'МОТОР' },
      { value: String(p.range ?? '—'),    unit: 'km',   label: 'ЗАПАС ХОДУ' },
      { value: p.battery || '—',          unit: '',     label: 'БАТАРЕЯ' },
    ],
    bottomLabel: `${category} · ${p.power ?? '—'}W · ${p.maxSpeed ?? '—'} KM/H`,
  };
}

export default async function KukirinHero() {
  // Тягнемо всі активні моделі і фільтруємо за нашим списком slugs
  const all = await getAllProducts().catch(() => []);
  const ordered = HERO_SLUGS_ORDERED
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p, idx) => toHeroModel(p, idx));

  const models: HeroModel[] = ordered.length > 0 ? ordered : [FALLBACK];

  return (
    <section className="relative overflow-hidden bg-[#FAFAF7] text-[#1a1a1a] dark:bg-[#0A0A0A] dark:text-white">
      {/* Анімовані треки швидкості на фоні */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="kukirin-streak kukirin-streak-1" />
        <div className="kukirin-streak kukirin-streak-2" />
        <div className="kukirin-streak kukirin-streak-3" />
        <div className="kukirin-streak kukirin-streak-4" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Навігація */}
        <nav className="flex items-center justify-between border-b border-[#E8E6DE] py-4 dark:border-white/10">
          <div className="flex items-center gap-8">
            <a href="/" className="inline-flex items-center" aria-label="kukirinstore.com.ua — головна">
              <Logo variant="inline" size={32} href={null} />
            </a>
            <ul className="hidden gap-5 text-sm font-medium text-[#4A4A48] dark:text-white/80 md:flex">
              <li><a href="#models" className="hover:text-[#1a1a1a] dark:hover:text-white">Самокати</a></li>
              <li><a href="/accessories" className="hover:text-[#1a1a1a] dark:hover:text-white">Аксесуари</a></li>
              <li><a href="/service" className="hover:text-[#1a1a1a] dark:hover:text-white">Сервіс</a></li>
              <li><a href="/blog" className="hover:text-[#1a1a1a] dark:hover:text-white">Блог</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="/orders/track" aria-label="Відстежити замовлення" title="Відстежити замовлення" className="flex h-11 w-11 items-center justify-center text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <PackageSearch size={18} />
            </a>
            <a href="/cart" aria-label="Кошик" className="flex h-11 w-11 items-center justify-center text-[#4A4A48] hover:text-[#1a1a1a] dark:text-white/80 dark:hover:text-white">
              <ShoppingCart size={18} />
            </a>
            <MobileMenu />
          </div>
        </nav>

        {/* Слайдер: динамічно перемикається між моделями */}
        <KukirinHeroSlider models={models} />
      </div>
    </section>
  );
}
