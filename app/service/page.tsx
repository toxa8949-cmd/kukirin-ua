import PageShell from '@/components/kukirin/PageShell';
import { Wrench, Battery, Cpu, Settings, Phone, MapPin } from 'lucide-react';

export const metadata = { title: 'Сервісний центр KUKIRIN' };

const SERVICES = [
  { icon: Wrench, title: 'Загальна діагностика', price: 'безкоштовно при ТО', desc: 'Перевірка електроніки, гальм, підвіски, шин і кріплень' },
  { icon: Battery, title: 'Заміна батареї', price: 'від 600 ₴ роботи', desc: 'Оригінальні батареї KUKIRIN з гарантією 6 місяців' },
  { icon: Cpu, title: 'Прошивка контролера', price: '400 ₴', desc: 'Оновлення прошивки, налаштування максимальної швидкості і круїз-контролю' },
  { icon: Settings, title: 'Заміна шин / гальм', price: 'від 350 ₴', desc: 'Заміна гум, гальмівних колодок, тросів, дисків' },
];

export default function ServicePage() {
  return (
    <PageShell
      breadcrumb="SERVICE · ОФІЦІЙНО"
      title="Сервісний центр"
      subtitle="Сервіс і самовивіз у магазині-партнері «Велокрай» у Києві. Виконуємо гарантійний та позагарантійний ремонт усіх моделей KUKIRIN."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-sm border border-[#E8E6DE] bg-white p-5 dark:border-white/10 dark:bg-[#0F0F0F]">
            <s.icon size={26} className="mb-3 text-[#FF6B00]" />
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <div className="text-lg font-medium tracking-tight">{s.title}</div>
              <div className="text-sm text-[#FF6B00]">{s.price}</div>
            </div>
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
        <p className="mb-4 text-sm text-[#4A4A48] dark:text-white/65">Дзвоніть або пишіть у Telegram — підкажемо вільний слот.</p>
        <a href="tel:+380800338899" className="inline-block rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-white hover:bg-[#FF8A33] dark:text-black">
          0 800 33 88 99
        </a>
      </div>
    </PageShell>
  );
}
