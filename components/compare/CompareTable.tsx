import Image from 'next/image';
import Link from 'next/link';
import { Check, ShoppingCart } from 'lucide-react';

type Side = {
  slug: string;
  name: string;
  image: string;
  category: string;
  price: number;
  oldPrice?: number;
  maxSpeed: number;
  power: number;
  range: number;
  battery: string;
  weight?: number;
  dimensions?: string;
  loadCapacity?: number;
  ipRating?: string;
  tireSize?: string;
  warranty?: string;
  chargingTime?: string;
};

type Row =
  | {
      label: string;
      a: string | number | null | undefined;
      b: string | number | null | undefined;
      unit?: string;
      // 'higher' — більше = краще (швидкість, потужність)
      // 'lower' — менше = краще (вага, ціна)
      // 'equal' — не порівнюємо
      better?: 'higher' | 'lower' | 'equal';
    }
  | { divider: true; title: string };

function fmt(v: string | number | null | undefined, unit?: string): string {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'number') {
    return unit ? `${v.toLocaleString('uk-UA')} ${unit}` : v.toLocaleString('uk-UA');
  }
  return unit ? `${v} ${unit}` : String(v);
}

function getBetter(a: number | string | null | undefined, b: number | string | null | undefined, direction: 'higher' | 'lower'): 'a' | 'b' | 'eq' | null {
  if (typeof a !== 'number' || typeof b !== 'number') return null;
  if (a === b) return 'eq';
  if (direction === 'higher') return a > b ? 'a' : 'b';
  return a < b ? 'a' : 'b';
}

export default function CompareTable({ a, b }: { a: Side; b: Side }) {
  const rows: Row[] = [
    { divider: true, title: 'ПРОДУКТИВНІСТЬ' },
    { label: 'Максимальна швидкість', a: a.maxSpeed, b: b.maxSpeed, unit: 'км/год', better: 'higher' },
    { label: 'Потужність', a: a.power, b: b.power, unit: 'Вт', better: 'higher' },
    { label: 'Запас ходу', a: a.range, b: b.range, unit: 'км', better: 'higher' },

    { divider: true, title: 'БАТАРЕЯ' },
    { label: 'Батарея', a: a.battery, b: b.battery, better: 'equal' },
    { label: 'Час зарядки', a: a.chargingTime, b: b.chargingTime, better: 'lower' },

    { divider: true, title: 'ГАБАРИТИ' },
    { label: 'Вага', a: a.weight, b: b.weight, unit: 'кг', better: 'lower' },
    { label: 'Розмір шин', a: a.tireSize, b: b.tireSize, better: 'equal' },
    { label: 'Максимальне навантаження', a: a.loadCapacity, b: b.loadCapacity, unit: 'кг', better: 'higher' },
    { label: 'Габарити', a: a.dimensions, b: b.dimensions, better: 'equal' },

    { divider: true, title: 'ДОДАТКОВО' },
    { label: 'Захист (IP)', a: a.ipRating, b: b.ipRating, better: 'equal' },
    { label: 'Гарантія', a: a.warranty, b: b.warranty, better: 'equal' },
  ];

  function renderCell(side: 'a' | 'b', row: Row & { divider?: false }, betterSide: 'a' | 'b' | 'eq' | null) {
    const isBetter = betterSide === side;
    const value = side === 'a' ? row.a : row.b;
    return (
      <td
        className={`px-4 py-3 text-sm ${
          isBetter
            ? 'bg-[#FF6B00]/8 font-medium text-[#993C1D] dark:bg-[#FF6B00]/15 dark:text-[#FF8A33]'
            : 'text-[#1a1a1a] dark:text-white/85'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          {fmt(value, row.unit)}
          {isBetter && <Check size={14} className="text-[#FF6B00]" />}
        </span>
      </td>
    );
  }

  return (
    <div>
      {/* HEADER — карти моделей зверху */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-6">
        {[a, b].map((s) => (
          <Link
            key={s.slug}
            href={`/product/${s.slug}`}
            className="block rounded-sm border border-[#E8E6DE] bg-white p-3 transition hover:border-[#FF6B00] dark:border-white/10 dark:bg-[#0F0F0F] dark:hover:border-[#FF6B00] sm:p-5"
          >
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#FAFAF7] dark:bg-[#0A0A0A]">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 55%, rgba(255,107,0,0.10) 0%, transparent 60%)',
                }}
              />
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                unoptimized
                className="object-contain p-4"
              />
            </div>
            <div className="mt-3 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
              // {s.category.toUpperCase()}
            </div>
            <div className="mt-1 text-sm font-medium leading-tight sm:text-base">{s.name}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-medium text-[#FF6B00] sm:text-xl">
                {s.price.toLocaleString('uk-UA')} ₴
              </span>
              {s.oldPrice && s.oldPrice > s.price && (
                <span className="text-xs text-[#6C6A65] line-through dark:text-white/40">
                  {s.oldPrice.toLocaleString('uk-UA')} ₴
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-sm border border-[#E8E6DE] dark:border-white/10">
        <table className="w-full border-collapse">
          <tbody>
            {rows.map((row, i) => {
              if ('divider' in row) {
                return (
                  <tr key={`d-${i}`}>
                    <td colSpan={3} className="bg-[#FAFAF7] px-4 py-2 text-[10px] font-medium tracking-[0.2em] text-[#993C1D] dark:bg-[#0F0F0F] dark:text-[#FF8A33]">
                      // {row.title}
                    </td>
                  </tr>
                );
              }
              const betterSide =
                row.better === 'higher' || row.better === 'lower'
                  ? getBetter(row.a, row.b, row.better)
                  : null;
              return (
                <tr
                  key={`r-${i}`}
                  className="border-t border-[#E8E6DE] dark:border-white/10"
                >
                  <td className="w-1/3 px-4 py-3 text-xs text-[#6C6A65] dark:text-white/55 sm:text-sm">
                    {row.label}
                  </td>
                  {renderCell('a', row, betterSide)}
                  {renderCell('b', row, betterSide)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6">
        {[a, b].map((s) => (
          <Link
            key={s.slug}
            href={`/product/${s.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#1a1a1a] px-4 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF6B00] dark:bg-white dark:text-black dark:hover:bg-[#FF6B00] dark:hover:text-white sm:text-sm"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">ЗАМОВИТИ</span> {s.name.replace(/^kukirin\s*/i, '')}
          </Link>
        ))}
      </div>
    </div>
  );
}
