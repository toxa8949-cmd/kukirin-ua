import PageShell from '@/components/kukirin/PageShell';
import OrderTrackForm from '@/components/order/OrderTrackForm';

export const metadata = {
  title: 'Відстеження замовлення — KUKIRIN.UA',
  description:
    'Перевірити статус замовлення KUKIRIN. Введіть номер замовлення і телефон — побачите поточний статус, склад і деталі доставки.',
  alternates: { canonical: '/orders/track' },
  openGraph: {
    title: 'Відстеження замовлення — KUKIRIN.UA',
    description: 'Перевірити статус замовлення KUKIRIN за номером і телефоном.',
    url: 'https://kukirinstore.com.ua/orders/track',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'KUKIRIN.UA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KUKIRIN.UA' }],
  },
  // Це не цільова SEO-сторінка для індексації (вона приватна за змістом),
  // але робимо доступною для пошуку якщо хтось гуглить
  robots: { index: true, follow: true },
};

export const dynamic = 'force-dynamic';

export default function TrackOrderPage() {
  return (
    <PageShell
      breadcrumb="ORDERS · TRACK"
      title="Відстеження замовлення"
      subtitle="Перевірте статус вашого замовлення за номером і телефоном."
    >
      <OrderTrackForm />
    </PageShell>
  );
}
