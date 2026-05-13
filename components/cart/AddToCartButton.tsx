'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { addItem } from '@/lib/store/cart';

type Props = {
  slug: string;
  name: string;
  price: number;
  image?: string | null;
  className?: string;
};

export default function AddToCartButton({ slug, name, price, image, className }: Props) {
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    addItem({ slug, name, price, image });
    setAdded(true);
    startTransition(() => {
      // Refresh server components that might read cart server-side (none yet, but harmless).
      router.refresh();
    });
    window.setTimeout(() => setAdded(false), 1800);
  }

  const base =
    'inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-xs font-medium tracking-[0.1em] transition';
  const style = added
    ? 'bg-emerald-500 text-black'
    : 'bg-[#FF6B00] text-white dark:text-black hover:bg-[#FF8A33]';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`${base} ${style} ${className ?? ''}`}
      aria-live="polite"
    >
      {added ? (
        <>
          ДОДАНО <Check size={14} />
        </>
      ) : (
        <>
          ДОДАТИ В КОШИК <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}
