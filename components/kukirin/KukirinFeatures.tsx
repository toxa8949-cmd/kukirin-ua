import { Truck, ShieldCheck, CreditCard, Headphones, Award, Wrench } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Доставка Новою Поштою', desc: 'По всій Україні за тарифом перевізника. Самовивіз у Києві.' },
  { icon: ShieldCheck, title: 'Офіційна гарантія', desc: 'Гарантія KUKIRIN на всі моделі та сервісна підтримка.' },
  { icon: CreditCard, title: 'Розтермінування', desc: 'Оплата частинами від Monobank і ПриватБанку.' },
  { icon: Wrench, title: 'Сервісний центр', desc: 'Власний сервіс у Києві. Виїзд майстра по місту.' },
  { icon: Award, title: 'Офіційний дистриб’ютор', desc: 'Прямий імпорт від виробника. Без сірих схем.' },
  { icon: Headphones, title: 'Підтримка 24/7', desc: 'Допомога з вибором, налаштуванням і ремонтом.' },
];

export default function KukirinFeatures() {
  return (
    <section className="border-t border-[#E8E6DE] bg-[#FAFAF7] py-16 text-[#1a1a1a] dark:border-white/10 dark:bg-[#0A0A0A] dark:text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10">
          <div className="mb-2 text-[11px] tracking-[0.3em] text-[#993C1D] dark:text-[#FF8A33]">
            // WHY KUKIRIN.UA
          </div>
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-4xl">
            Чому беруть<br />
            <span className="text-[#FF6B00]">саме у нас</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-[#E8E6DE] dark:bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-white p-6 transition hover:bg-[#FFFCF5] dark:bg-[#0A0A0A] dark:hover:bg-[#111]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-[#FF6B00]/10 text-[#FF6B00] transition group-hover:bg-[#FF6B00] group-hover:text-white dark:group-hover:text-black">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <h3 className="mb-2 text-base font-medium">{title}</h3>
              <p className="text-sm leading-relaxed text-[#6C6A65] dark:text-white/55">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
