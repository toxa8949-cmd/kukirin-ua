import PageShell from '@/components/kukirin/PageShell';
import { ShieldCheck, Battery, Zap, Bike, Lock, Lightbulb } from 'lucide-react';

export const metadata = {
  title: 'Аксесуари для електросамокатів KUKIRIN — батареї, шини, шоломи',
  description:
    "Оригінальні аксесуари KUKIRIN: запасні батареї (48V/52V/60V), шини, шоломи, замки, GPS-трекери, тримачі. Офіційна гарантія, доставка Новою Поштою по Україні.",
  keywords: ['аксесуари електросамоката', 'запасна батарея kukirin', 'шини електросамоката', 'шолом самокат', 'замок для самоката'],
  alternates: { canonical: '/accessories' },
  openGraph: {
    title: 'Аксесуари KUKIRIN — батареї, шини, захист',
    description:
      "Оригінальні аксесуари KUKIRIN: запасні батареї (48V/52V/60V), шини, шоломи, замки, GPS-трекери, тримачі. Офіційна гарантія, доставка Новою Поштою по Україні.",
    url: 'https://kukirinstore.com.ua/accessories',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'KUKIRIN.UA',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Аксесуари KUKIRIN — батареї, шини, захист' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Аксесуари KUKIRIN — батареї, шини, захист',
    images: ['/og-image.png'],
  },
};

const ACCESSORIES = [
  { icon: Battery, title: 'Запасні батареї', desc: '48V / 52V / 60V — оригінальні KUKIRIN з гарантією 6 міс', price: 'від 6 999 ₴' },
  { icon: ShieldCheck, title: 'Шоломи', desc: 'Open-face та full-face моделі для міста і off-road', price: 'від 1 499 ₴' },
  { icon: Bike, title: 'Шини й камери', desc: '8.5", 10", 11" — повітряні та безкамерні (tubeless)', price: 'від 599 ₴' },
  { icon: Lock, title: 'Замки й сигналізації', desc: 'U-замки, ланцюги, GPS-трекери, кодові тривоги', price: 'від 799 ₴' },
  { icon: Lightbulb, title: 'Освітлення', desc: 'Передні LED фари, габарити, поворотники', price: 'від 449 ₴' },
  { icon: Zap, title: 'Зарядні пристрої', desc: 'Швидкі та подвійні — оригінали і сумісні аналоги', price: 'від 1 199 ₴' },
];

export default function AccessoriesPage() {
  return (
    <PageShell
      breadcrumb="ACCESSORIES · 6 КАТЕГОРІЙ"
      title="Аксесуари"
      subtitle="Усе для комфортної і безпечної їзди: батареї, шоломи, шини, замки, освітлення та зарядки. Офіційно з гарантією."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACCESSORIES.map((a) => (
          <div key={a.title} className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
            <a.icon size={28} className="mb-4 text-[#FF6B00]" />
            <div className="mb-1 text-lg font-medium tracking-tight">{a.title}</div>
            <div className="mb-4 text-xs leading-relaxed text-[#4A4A48] dark:text-white/55">{a.desc}</div>
            <div className="text-sm text-[#4A4A48] dark:text-white/80">{a.price}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-6 text-center">
        <div className="mb-2 text-xs tracking-[0.2em] text-[#993C1D] dark:text-[#FF8A33]">// ПОВНИЙ КАТАЛОГ</div>
        <h3 className="mb-3 text-xl font-medium">Не знайшли потрібне?</h3>
        <p className="mb-4 text-sm text-[#4A4A48] dark:text-white/65">Зателефонуйте нам або напишіть у Telegram — підберемо аксесуар під вашу модель.</p>
        <a href="tel:+380800338899" className="inline-block rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white dark:text-black hover:bg-[#FF8A33]">
          0 800 33 88 99
        </a>
      </div>
    </PageShell>
  );
}
