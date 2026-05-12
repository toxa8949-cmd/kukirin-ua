import PageShell from '@/components/kukirin/PageShell';
import CartView from '@/components/cart/CartView';

export const metadata = { title: 'Кошик' };

export default function CartPage() {
  return (
    <PageShell breadcrumb="CART" title="Кошик">
      <CartView />
    </PageShell>
  );
}
