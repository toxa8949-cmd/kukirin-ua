'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type ModelOption = {
  slug: string;
  name: string;
};

export default function CompareSelector({
  models,
  defaultA,
  defaultB,
}: {
  models: ModelOption[];
  defaultA?: string;
  defaultB?: string;
}) {
  const router = useRouter();
  const [a, setA] = useState(defaultA || models[0]?.slug || '');
  const [b, setB] = useState(defaultB || models[1]?.slug || models[0]?.slug || '');
  const [busy, setBusy] = useState(false);

  function onCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!a || !b) return;
    if (a === b) return;
    setBusy(true);
    router.push(`/compare/${a}-vs-${b}`);
  }

  return (
    <form onSubmit={onCompare} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
      <div>
        <label htmlFor="model-a" className="mb-2 block text-[10px] font-medium tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
          // МОДЕЛЬ 1
        </label>
        <select
          id="model-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="w-full rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-base text-[#1a1a1a] outline-none focus:border-[#FF6B00] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white"
        >
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden items-center justify-center pt-7 sm:flex">
        <div className="text-2xl font-medium tracking-[-0.05em] text-[#FF6B00]">VS</div>
      </div>

      <div>
        <label htmlFor="model-b" className="mb-2 block text-[10px] font-medium tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">
          // МОДЕЛЬ 2
        </label>
        <select
          id="model-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="w-full rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-base text-[#1a1a1a] outline-none focus:border-[#FF6B00] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white"
        >
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={busy || !a || !b || a === b}
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-5 py-3 text-xs font-medium tracking-[0.1em] text-white transition hover:bg-[#FF8A33] disabled:opacity-50 dark:text-black"
        >
          {busy ? 'ШУКАЮ…' : 'ПОРІВНЯТИ'}
          <ArrowRight size={14} />
        </button>
      </div>

      {a === b && (
        <div className="text-xs text-[#D43838] sm:col-span-4">
          Оберіть дві різні моделі для порівняння.
        </div>
      )}
    </form>
  );
}
