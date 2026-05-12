'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart, cartTotals } from '@/lib/store/cart';

export default function CartIcon() {
  const { items } = useCart();
  const { count } = cartTotals(items);

  return (
    <Link
      href="/cart"
      aria-label={`Кошик (${count})`}
      className="relative text-white/80 hover:text-white"
    >
      <ShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[10px] font-medium text-black">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
