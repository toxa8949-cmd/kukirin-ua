import Link from 'next/link';
import PageShell from '@/components/kukirin/PageShell';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export const metadata = { title: 'Кошик' };

export default function CartPage() {
  return (
    <PageShell breadcrumb="CART" title="Кошик">
      <div className="mx-auto max-w-lg rounded-sm border border-white/10 bg-[#0F0F0F] p-8 text-center sm:p-12">
        <ShoppingCart size={40} className="mx-auto mb-4 text-[#FF6B00]" />
        <h2 className="mb-2 text-xl font-medium sm:text-2xl">Ваш кошик порожній</h2>
        <p className="mb-6 text-sm text-white/55">Додайте електросамокат або аксесуар із каталогу — вони відобразяться тут.</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/catalog" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]">
            ДО КАТАЛОГУ <ArrowRight size={14} />
          </Link>
          <Link href="/accessories" className="inline-flex items-center justify-center rounded-sm border border-white/25 px-6 py-3 text-xs font-medium tracking-wide hover:border-white/50">
            Аксесуари
          </Link>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-white/40">// Корзина запрацює після інтеграції з базою — додавання, кількість, промокоди, оплата</div>
    </PageShell>
  );
}
