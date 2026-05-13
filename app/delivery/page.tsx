import PageShell from '@/components/kukirin/PageShell';
import { Truck, CreditCard, Banknote, Calendar } from 'lucide-react';

export const metadata = { title: 'Доставка й оплата' };

export default function DeliveryPage() {
  return (
    <PageShell breadcrumb="DELIVERY · УКРАЇНА" title="Доставка й оплата" subtitle="Швидко, прозоро, без передплати. Самокат їде до вас 1–3 дні, оплата при отриманні.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <Truck size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Доставка</h2>
          <ul className="space-y-3 text-sm text-[#4A4A48] dark:text-white/70">
            <li><span className="text-[#1a1a1a] dark:text-white">Нова Пошта</span> — відділення/поштомат: 1–2 дні, від 90 ₴ (для габаритних — за тарифом перевізника).</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Курʼєр НП</span> — за адресою: 1–3 дні, від 120 ₴ + габаритне.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Самовивіз</span> — Київ / Львів / Одеса з сервісного центру, безкоштовно у будь-який день.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Безкоштовна доставка</span> при замовленні від 20 000 ₴ — Новою Поштою у відділення.</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <CreditCard size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Оплата</h2>
          <ul className="space-y-3 text-sm text-[#4A4A48] dark:text-white/70">
            <li><span className="text-[#1a1a1a] dark:text-white">При отриманні</span> — готівкою або карткою у відділенні НП.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Картою онлайн</span> — Visa / Mastercard, Apple Pay, Google Pay через LiqPay або WayForPay.</li>
            <li><span className="text-[#1a1a1a] dark:text-white">Розстрочка 0%</span> — ПриватБанк, Monobank: 3 / 6 / 12 платежів без переплати.</li>
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
