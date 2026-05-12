import PageShell from '@/components/kukirin/PageShell';
import CheckoutForm from '@/components/cart/CheckoutForm';

export const metadata = { title: 'Оформлення замовлення' };

export default function CheckoutPage() {
  return (
    <PageShell breadcrumb="CHECKOUT" title="Оформлення замовлення" subtitle="Залиште контакти — менеджер передзвонить протягом 15 хвилин і підтвердить деталі.">
      <CheckoutForm />
    </PageShell>
  );
}
