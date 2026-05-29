import PageShell from '@/components/kukirin/PageShell';
import { Truck, CreditCard, Banknote, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Доставка електросамокатів по Україні — Новою Поштою',
  description:
    "Доставка KUKIRIN Новою Поштою по всій Україні: безкоштовно при передплаті, накладений платіж від 200 ₴, самовивіз у Києві (Ревуцького 40В). Відправка 1–3 дні.",
  keywords: ['доставка електросамоката', 'kukirin доставка', 'доставка нова пошта', 'самовивіз київ', 'оплата при отриманні'],
  alternates: { canonical: '/delivery' },
  openGraph: {
    title: 'Доставка KUKIRIN — Новою Поштою по Україні',
    description:
      "Доставка KUKIRIN Новою Поштою по всій Україні: безкоштовно при передплаті, накладений платіж від 200 ₴, самовивіз у Києві (Ревуцького 40В). Відправка 1–3 дні.",
    url: 'https://kukirinstore.com.ua/delivery',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'KUKIRIN.UA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Доставка KUKIRIN — Новою Поштою по Україні' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Доставка KUKIRIN — Новою Поштою по Україні',
    images: ['/og-image.png'],
  },
};

export default function DeliveryPage() {
  return (
    <PageShell breadcrumb="DELIVERY · УКРАЇНА" title="Доставка й оплата" subtitle="Швидко й прозоро. Самокат їде до вас Новою Поштою, або забирайте самовивозом у Києві.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <Truck size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Доставка</h2>
          <ul className="space-y-3 text-sm text-[#4A4A48] dark:text-white/70">
            <li><span className="text-[#1a1a1a] dark:text-white">Нова Пошта</span> — відділення/поштомат: 1–2 дні, за тарифом перевізника (для габаритних товарів — згідно з тарифом НП).</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Курʼєр Нової Пошти</span> — за адресою: 1–3 дні, за тарифом перевізника.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Самовивіз</span> — магазин-партнер «Велокрай», м. Київ, вул. Ревуцького, 40В.</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <CreditCard size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Оплата</h2>
          <ul className="space-y-3 text-sm text-[#4A4A48] dark:text-white/70">
            <li><span className="text-[#1a1a1a] dark:text-white">При отриманні</span> — готівкою або карткою у відділенні НП.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Картою онлайн</span> — Visa / Mastercard, Apple Pay, Google Pay через LiqPay або WayForPay.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Розтермінування</span> — ПриватБанк, Monobank: оплата частинами.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Безготівковий розрахунок</span> — для юридичних осіб з ПДВ.</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <Calendar size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Терміни</h2>
          <p className="text-sm leading-relaxed text-[#4A4A48] dark:text-white/70">
            Замовлення до 14:00 — відправляємо в той самий день. Після 14:00 — наступного робочого дня. У будні замовлення опрацьовуються в порядку черги, у вихідні відправок немає.
          </p>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <Banknote size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Передплата</h2>
          <p className="text-sm leading-relaxed text-[#4A4A48] dark:text-white/70">
            Для габаритних товарів (самокати) Нова Пошта вимагає невелику передплату — 200 ₴, яка зараховується в загальну вартість. Решту оплачуєте при отриманні після огляду.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
