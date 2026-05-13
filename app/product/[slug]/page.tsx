import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Phone, Truck, Shield, Wrench } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import AddToCartButton from '@/components/cart/AddToCartButton';
import {
  getAllProducts,
  getProductBySlug,
} from '@/lib/data/products';

// Force per-request rendering. Prevents Vercel from serving a stale 500
// generated before RLS / schema-sync were applied. Also stops generateStaticParams
// from baking the slug set at build time (we now resolve everything at request time).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const s = await getProductBySlug(slug).catch(() => null);
    if (!s) return { title: 'Модель не знайдена' };
    const parts: string[] = [];
    if (s.power)    parts.push(`${s.power}W`);
    if (s.maxSpeed) parts.push(`до ${s.maxSpeed} км/год`);
    if (s.range)    parts.push(`${s.range} км ходу`);
    const specs = parts.length ? ` ${parts.join(', ')}.` : '';
    const tag = s.tagline ? `${s.tagline}.` : '';
    return {
      title: `${s.name} — купити в Україні`,
      description: `${s.name}.${tag ? ` ${tag}` : ''}${specs} Гарантія 12 міс, доставка 1–3 дні.`,
    };
  } catch {
    return { title: 'Модель' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scooter = await getProductBySlug(slug).catch((e) => {
    console.error('[ProductPage] getProductBySlug threw', e);
    return null;
  });
  if (!scooter) notFound();

  const all = await getAllProducts().catch(() => []);
  const related = all.filter((r) => r.slug !== scooter.slug).slice(0, 3);

  const primaryImage = scooter.gallery?.[0] ?? scooter.image ?? null;

  // Defensive defaults for everything the UI reads.
  const safeName     = scooter.name ?? 'KUKIRIN';
  const safeTagline  = scooter.tagline ?? '';
  const safeCategory = scooter.category ?? 'urban';
  const safeBattery  = scooter.battery ?? '—';
  const safePower    = Number.isFinite(scooter.power)    ? scooter.power    : 0;
  const safeSpeed    = Number.isFinite(scooter.maxSpeed) ? scooter.maxSpeed : 0;
  const safeRange    = Number.isFinite(scooter.range)    ? scooter.range    : 0;

  // Avoid `.split(' ').slice(-1)[0]` on a possibly empty name.
  const placeholderLabel = (() => {
    const parts = safeName.split(' ').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : 'KUKIRIN';
  })();

  const features = [
    { icon: Truck,  label: 'Доставка',   value: '1–3 дні по Україні' },
    { icon: Shield, label: 'Гарантія',   value: '12 місяців офіційно' },
    { icon: Wrench, label: 'Сервіс',     value: 'Власні майстерні' },
    { icon: Phone,  label: 'Підтримка',  value: '0 800 33 88 99' },
  ];

  return (
    <PageShell breadcrumb={`PRODUCT · ${scooter.slug.toUpperCase()}`}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="relative aspect-square overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
          <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
            {scooter.badge && (
              <span className="rounded-sm bg-[#FF6B00] px-2 py-1 text-[10px] font-medium tracking-[0.15em] text-white dark:text-black">
                {scooter.badge.toUpperCase()}
              </span>
            )}
            <span className="rounded-sm border border-[#E8E6DE] dark:border-white/20 px-2 py-1 text-[10px] tracking-[0.15em] text-[#4A4A48] dark:text-white/70">
              KUKIRIN · 2026
            </span>
          </div>
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={safeName}
              className="h-full w-full object-cover"
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

          <ul className="mb-6 space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Офіційна гарантія 12 місяців</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Доставка Новою Поштою 1–3 дні</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Розстрочка 0% до 12 місяців</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Передпродажна підготовка</li>
          </ul>

          {scooter.description && (
            <div className="prose mt-2 max-w-none text-sm leading-relaxed text-[#4A4A48] dark:text-white/65">
              <p>{scooter.description}</p>
            </div>
          )}
        </div>
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
            <Link href="/catalog" className="text-xs text-[#4A4A48] dark:text-white/60 hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">Усі моделі →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/product/${s.slug}`} className="group rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-4 transition hover:border-[#FF6B00]">
                <div className="mb-1 text-sm font-medium">{s.name}</div>
                <div className="mb-3 text-xs text-[#6C6A65] dark:text-white/45">{s.tagline}</div>
                <div className="flex items-end justify-between">
                  <div className="text-lg font-medium text-[#FF6B00]">{Number(s.price).toLocaleString('uk-UA')} ₴</div>
                  <span className="text-xs text-[#4A4A48] dark:text-white/60 group-hover:text-[#1a1a1a] dark:hover:text-[#1a1a1a] dark:text-white">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
