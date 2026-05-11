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
      subtitle="Власні майстерні в Києві, Львові й Одесі. Виконуємо гарантійний та позагарантійний ремонт усіх моделей KUKIRIN."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div key={s.title} className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <s.icon size={26} className="mb-3 text-[#FF6B00]" />
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <div className="text-lg font-medium tracking-tight">{s.title}</div>
              <div className="text-sm text-[#FF6B00]">{s.price}</div>
            </div>
            <div className="text-xs leading-relaxed text-white/55">{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 rounded-sm border border-white/10 bg-[#0F0F0F] p-6 sm:grid-cols-3">
        <div>
          <MapPin size={20} className="mb-2 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-white/40">КИЇВ</div>
          <div className="text-sm">вул. Електриків, 26</div>
          <div className="text-xs text-white/45">Пн–Сб: 10:00 – 19:00</div>
        </div>
        <div>
          <MapPin size={20} className="mb-2 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-white/40">ЛЬВІВ</div>
          <div className="text-sm">вул. Городоцька, 359</div>
          <div className="text-xs text-white/45">Пн–Сб: 10:00 – 19:00</div>
        </div>
        <div>
          <MapPin size={20} className="mb-2 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-white/40">ОДЕСА</div>
          <div className="text-sm">вул. Велика Арнаутська, 56</div>
          <div className="text-xs text-white/45">Пн–Сб: 10:00 – 19:00</div>
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-6 text-center">
        <Phone size={24} className="mx-auto mb-3 text-[#FF6B00]" />
        <h3 className="mb-2 text-xl font-medium">Записатись на сервіс</h3>
        <p className="mb-4 text-sm text-white/65">Дзвоніть або пишіть у Telegram — підкажемо найближчий сервіс і вільний слот.</p>
        <a href="tel:+380800338899" className="inline-block rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]">
          0 800 33 88 99
        </a>
      </div>
    </PageShell>
  );
}
