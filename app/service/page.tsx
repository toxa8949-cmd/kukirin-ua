import PageShell from '@/components/kukirin/PageShell';
import { Wrench, Battery, Cpu, Settings, Phone, MapPin, Gauge, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Сервіс і ремонт електросамокатів KUKIRIN у Києві',
  description:
    "Сервісний центр KUKIRIN у Києві (Ревуцького 40В): діагностика, ремонт двигуна та контролера, заміна батареї, прошивка. Безкоштовна діагностика, оригінальні запчастини.",
  keywords: ['ремонт електросамоката київ', 'сервіс kukirin', 'заміна батареї електросамоката', 'ремонт kugoo kirin', 'діагностика самоката'],
  alternates: { canonical: '/service' },
  openGraph: {
    title: 'Сервіс KUKIRIN у Києві — ремонт, діагностика, запчастини',
    description:
      "Сервісний центр KUKIRIN у Києві (Ревуцького 40В): діагностика, ремонт двигуна та контролера, заміна батареї, прошивка. Безкоштовна діагностика, оригінальні запчастини.",
    url: 'https://kukirinstore.com.ua/service',
    type: 'website',
    locale: 'uk_UA',
    siteName: 'kukirinstore.com.ua',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Сервіс KUKIRIN у Києві — ремонт, діагностика, запчастини' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Сервіс KUKIRIN у Києві — ремонт, діагностика, запчастини',
    images: ['/og-image.png'],
  },
};

const SERVICES = [
  { icon: Wrench, title: 'Технічне обслуговування', desc: 'Планове ТО: перевірка всіх вузлів, протяжка кріплень, змащення, підготовка до сезону' },
  { icon: Gauge, title: 'Діагностика', desc: 'Повна перевірка електроніки, гальм, підвіски, шин і кріплень — знаходимо проблему до того як вона стане поломкою' },
  { icon: Battery, title: 'Заміна та ремонт батареї', desc: 'Оригінальні батареї KUKIRIN, ремонт BMS, відновлення ємності, заміна елементів' },
  { icon: Cpu, title: 'Прошивка та налаштування', desc: 'Оновлення прошивки контролера, налаштування максимальної швидкості, круїз-контролю та режимів їзди' },
  { icon: Settings, title: 'Заміна деталей', desc: 'Шини, гальмівні колодки, троси, диски, ручки, крила, підніжки — оригінальні запчастини' },
  { icon: ShieldCheck, title: 'Гарантійний ремонт', desc: 'Безкоштовне усунення несправностей за гарантією. Діагностуємо й ремонтуємо офіційно' },
];

export default function ServicePage() {
  return (
    <PageShell
      breadcrumb="SERVICE · ОФІЦІЙНО"
      title="Сервісний центр"
      subtitle="Сервіс і самовивіз у магазині-партнері «Велокрай» у Києві. Виконуємо гарантійний та позагарантійний ремонт усіх моделей KUKIRIN."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
            <s.icon size={26} className="mb-3 text-[#FF6B00]" />
            <div className="mb-2 text-lg font-medium tracking-tight">{s.title}</div>
            <div className="text-xs leading-relaxed text-[#6C6A65] dark:text-white/55">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-[#E8E6DE] bg-white p-6 dark:border-white/10 dark:bg-[#0F0F0F]">
        <MapPin size={20} className="mb-2 text-[#FF6B00]" />
        <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КИЇВ · МАГАЗИН-ПАРТНЕР</div>
        <div className="text-sm font-medium">«Велокрай»</div>
        <div className="text-sm">вул. Ревуцького, 40В</div>
        <div className="text-xs text-[#6C6A65] dark:text-white/45">Пн–Сб: 10:00 – 19:00</div>
      </div>

      <div className="mt-8 rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-6 text-center">
        <Phone size={24} className="mx-auto mb-3 text-[#FF6B00]" />
        <h3 className="mb-2 text-xl font-medium">Записатись на сервіс</h3>
        <p className="mb-4 text-sm text-[#4A4A48] dark:text-white/65">Дзвоніть або пишіть у Telegram — підкажемо вільний слот і вартість робіт.</p>
        <a href="tel:+380958981007" className="inline-block rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white hover:bg-[#FF8A33] dark:text-black">
          0 (95) 898-10-07
        </a>
      </div>
    </PageShell>
  );
}
