import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Phone, Truck, Shield, Wrench } from 'lucide-react';
import PageShell from '@/components/kukirin/PageShell';
import {
  getAllProducts,
  getProductBySlug,
  toKukirin,
} from '@/lib/data/products';

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await getAllProducts().catch(() => []);
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getProductBySlug(slug).catch(() => null);
  if (!row) return { title: 'Модель не знайдена' };
  const s = toKukirin(row);
  return {
    title: `${s.name} — купити в Україні`,
    description: `${s.name}: ${s.tagline}. ${s.power}W, до ${s.maxSpeed} км/год, ${s.range} км. Гарантія 12 міс.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getProductBySlug(slug).catch(() => null);
  if (!row) notFound();

  const scooter = toKukirin(row!);

  // Related: other products, max 3
  const all = await getAllProducts().catch(() => []);
  const related = all
    .filter((r) => r.slug !== scooter.slug)
    .slice(0, 3)
    .map(toKukirin);

  // Primary image (if any)
  const primaryImage =
    row!.product_images?.find((img) => img.is_primary)?.url ??
    row!.product_images?.[0]?.url ??
    null;

  const features = [
    { icon: Truck, label: 'Доставка', value: '1–3 дні по Україні' },
    { icon: Shield, label: 'Гарантія', value: '12 місяців офіційно' },
    { icon: Wrench, label: 'Сервіс', value: 'Власні майстерні' },
    { icon: Phone, label: 'Підтримка', value: '0 800 33 88 99' },
  ];

  return (
    <PageShell breadcrumb={`PRODUCT · ${scooter.slug.toUpperCase()}`}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="relative aspect-square overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
          <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
            {scooter.badge && (
              <span className="rounded-sm bg-[#FF6B00] px-2 py-1 text-[10px] font-medium tracking-[0.15em] text-black">
                {scooter.badge.toUpperCase()}
              </span>
            )}
            <span className="rounded-sm border border-white/20 px-2 py-1 text-[10px] tracking-[0.15em] text-white/70">
              KUKIRIN · 2026
            </span>
          </div>
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={scooter.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#FF6B00]/30">
              <div className="text-center">
                <div className="text-7xl font-medium tracking-tight">{scooter.name.split(' ').slice(-1)[0]}</div>
                <div className="mt-2 text-xs tracking-[0.3em] text-white/30">// {scooter.tagline.toUpperCase()}</div>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 text-[11px] tracking-[0.2em] text-[#FF8A33]">// {scooter.category.toUpperCase()}</div>
          <h1 className="mb-2 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">{scooter.name}</h1>
          <p className="mb-6 text-sm text-white/55">{scooter.tagline}. Офіційно від KUKIRIN.UA з гарантією та сервісом.</p>

          <div className="mb-6 flex items-end gap-3">
            <div className="text-3xl font-medium text-[#FF6B00] sm:text-4xl">{scooter.price.toLocaleString('uk-UA')} ₴</div>
            {scooter.oldPrice && (
              <div className="text-base text-white/30 line-through">{scooter.oldPrice.toLocaleString('uk-UA')} ₴</div>
            )}
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black transition hover:bg-[#FF8A33]">
              ДОДАТИ В КОШИК <ArrowRight size={14} />
            </button>
            <Link href="/test-drive" className="inline-flex items-center justify-center rounded-sm border border-white/25 px-6 py-3 text-xs font-medium tracking-wide text-white transition hover:border-white/50">
              Тест-драйв
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-sm border border-white/10 p-3">
              <div className="text-xl font-medium">{scooter.power}<span className="ml-1 text-xs text-white/40">W</span></div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">МОТОР</div>
            </div>
            <div className="rounded-sm border border-white/10 p-3">
              <div className="text-xl font-medium">{scooter.maxSpeed}<span className="ml-1 text-xs text-white/40">km/h</span></div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">ШВИДКІСТЬ</div>
            </div>
            <div className="rounded-sm border border-white/10 p-3">
              <div className="text-xl font-medium">{scooter.range}<span className="ml-1 text-xs text-white/40">km</span></div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">ЗАПАС</div>
            </div>
            <div className="rounded-sm border border-white/10 p-3">
              <div className="text-xs font-medium">{scooter.battery}</div>
              <div className="text-[9px] tracking-[0.2em] text-[#FF6B00]">БАТАРЕЯ</div>
            </div>
          </div>

          <ul className="mb-6 space-y-2 text-sm text-white/70">
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Офіційна гарантія 12 місяців</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Доставка Новою Поштою 1–3 дні</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Розстрочка 0% до 12 місяців</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[#FF6B00]" /> Передпродажна підготовка</li>
          </ul>
        </div>
      </div>

      {/* Service blocks */}
      <div className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <f.icon size={20} className="text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">{f.label.toUpperCase()}</div>
            <div className="text-sm">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12 border-t border-white/10 pt-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Інші моделі</h2>
            <Link href="/catalog" className="text-xs text-white/60 hover:text-white">Усі моделі →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} href={`/product/${s.slug}`} className="group rounded-sm border border-white/10 bg-[#0F0F0F] p-4 transition hover:border-[#FF6B00]">
                <div className="mb-1 text-sm font-medium">{s.name}</div>
                <div className="mb-3 text-xs text-white/45">{s.tagline}</div>
                <div className="flex items-end justify-between">
                  <div className="text-lg font-medium text-[#FF6B00]">{s.price.toLocaleString('uk-UA')} ₴</div>
                  <span className="text-xs text-white/60 group-hover:text-white">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
