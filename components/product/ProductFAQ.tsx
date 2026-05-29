'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type FAQItem = { q: string; a: string };

/**
 * Акордеон з питаннями-відповідями для сторінки товара.
 * Працює зі схемою FAQPage — рендериться окремо в JsonLd.
 */
export default function ProductFAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="mt-16 border-t border-[#E8E6DE] dark:border-white/10 pt-10">
      <div className="mb-2 text-[10px] tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
        // ЧАСТІ ЗАПИТАННЯ
      </div>
      <h2 className="mb-6 text-2xl font-medium tracking-tight sm:text-3xl">
        Питання покупців
      </h2>

      <ul className="divide-y divide-[#E8E6DE] dark:divide-white/10 border-y border-[#E8E6DE] dark:border-white/10">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 py-4 text-left transition hover:text-[#993C1D] dark:hover:text-[#FF8A33]"
              >
                <span className="flex-1 text-sm font-medium leading-snug sm:text-base">
                  {it.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`mt-0.5 shrink-0 text-[#6C6A65] transition-transform dark:text-white/40 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="pb-5 pr-8 text-sm leading-relaxed text-[#4A4A48] dark:text-white/65">
                  {it.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
