import PageShell from '@/components/kukirin/PageShell';
import { Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { getAllProducts } from '@/lib/data/products';

export const metadata = {
  title: 'Тест-драйв електросамокатів KUKIRIN у Києві — безкоштовно',
  description:
    "Запис на безкоштовний тест-драйв електросамокатів KUKIRIN у Києві. Будь-яка модель з наявності — G2 Pro, G2 Master, G4 Max, M4 Pro. Запис телефоном 0 (95) 898-10-07.",
  keywords: ['тест-драйв електросамоката', 'kukirin тест', 'де покататись на самокаті', 'тест електросамоката київ'],
  alternates: { canonical: '/test-drive' },
  openGraph: {
    title: 'Тест-драйв KUKIRIN — безкоштовно у Києві',
    description:
      "Запис на безкоштовний тест-драйв електросамокатів KUKIRIN у Києві. Будь-яка модель з наявності — G2 Pro, G2 Master, G4 Max, M4 Pro. Запис телефоном 0 (95) 898-10-07.",
    url: 'https://kukirinstore.com.ua/test-drive',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'kukirinstore.com.ua',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Тест-драйв KUKIRIN — безкоштовно у Києві' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тест-драйв KUKIRIN — безкоштовно у Києві',
    images: ['/og-image.png'],
  },
};
export const dynamic = 'force-dynamic';

export default async function TestDrivePage() {
  // Беремо моделі з БД, а не з захардкодженого масиву
  const list = await getAllProducts().catch(() => []);

  const inputCls =
    'w-full rounded-sm border border-[#E8E6DE] bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#6C6A65] outline-none focus:border-[#FF6B00] dark:border-white/15 dark:bg-[#0A0A0A] dark:text-white dark:placeholder:text-white/30';

  return (
    <PageShell
      breadcrumb="TEST DRIVE · БЕЗКОШТОВНО"
      title="Запис на тест-драйв"
      subtitle="20 хвилин з обраною моделлю на нашій тест-зоні. Безкоштовно, без зобовʼязань. Шоломи й захист видаємо."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-sm border border-[#E8E6DE] bg-white p-6 dark:border-white/10 dark:bg-[#0F0F0F]">
          <h2 className="mb-5 text-xl font-medium">Залиште заявку</h2>
          <form className="space-y-3">
            <input type="text" placeholder="Ім'я" className={inputCls} />
            <input type="tel" placeholder="+380 __ ___ __ __" className={inputCls} />
            <select className={inputCls}>
              <option value="">Обрати модель</option>
              {list.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select className={inputCls}>
              <option value="">Місто</option>
              <option value="kyiv">Київ</option>
            </select>
            <textarea rows={3} placeholder="Коментар (необовʼязково)" className={inputCls} />
            <button type="button" className="w-full rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white hover:bg-[#FF8A33] dark:text-black">
              ЗАПИСАТИСЬ
            </button>
          </form>
          <p className="mt-3 text-[10px] text-[#6C6A65] dark:text-white/35">Ми передзвонимо протягом 30 хвилин для підтвердження часу.</p>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
            <Calendar size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КОЛИ</div>
            <div className="text-sm">Пн–Сб: 11:00 – 18:00. Запис мінімум за 2 години.</div>
          </div>
          <div className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
            <Clock size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">СКІЛЬКИ ТРИВАЄ</div>
            <div className="text-sm">До 20 хвилин: інструктаж, посадка, заїзд на тест-полі.</div>
          </div>
          <div className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
            <MapPin size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">ДЕ</div>
            <div className="text-sm">Київ, магазин-партнер «Велокрай», вул. Ревуцького, 40В.</div>
          </div>
          <div className="rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-5">
            <Phone size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">ПЕРЕДЗВОНИТИ</div>
            <a href="tel:+380958981007" className="text-sm font-medium hover:text-[#FF6B00]">0 (95) 898-10-07</a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
