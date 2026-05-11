import PageShell from '@/components/kukirin/PageShell';
import { Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { KUKIRIN_SCOOTERS } from '@/lib/kukirin-data';

export const metadata = { title: 'Тест-драйв KUKIRIN' };

export default function TestDrivePage() {
  return (
    <PageShell
      breadcrumb="TEST DRIVE · БЕЗКОШТОВНО"
      title="Запис на тест-драйв"
      subtitle="20 хвилин з обраною моделлю на нашій тест-зоні. Безкоштовно, без зобовʼязань. Шоломи й захист видаємо."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-6">
          <h2 className="mb-5 text-xl font-medium">Залиште заявку</h2>
          <form className="space-y-3">
            <input type="text" placeholder="Ім'я" className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm placeholder:text-white/30 focus:border-[#FF6B00] focus:outline-none" />
            <input type="tel" placeholder="+380 __ ___ __ __" className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm placeholder:text-white/30 focus:border-[#FF6B00] focus:outline-none" />
            <select className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm focus:border-[#FF6B00] focus:outline-none">
              <option value="">Обрати модель</option>
              {KUKIRIN_SCOOTERS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
            <select className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm focus:border-[#FF6B00] focus:outline-none">
              <option value="">Місто</option>
              <option value="kyiv">Київ</option>
              <option value="lviv">Львів</option>
              <option value="odesa">Одеса</option>
            </select>
            <textarea rows={3} placeholder="Коментар (необовʼязково)" className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm placeholder:text-white/30 focus:border-[#FF6B00] focus:outline-none" />
            <button type="button" className="w-full rounded-sm bg-[#FF6B00] px-6 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]">
              ЗАПИСАТИСЬ
            </button>
          </form>
          <p className="mt-3 text-[10px] text-white/35">Ми передзвонимо протягом 30 хвилин для підтвердження часу.</p>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <Calendar size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">КОЛИ</div>
            <div className="text-sm">Пн–Сб: 11:00 – 18:00. Запис мінімум за 2 години.</div>
          </div>
          <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <Clock size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">СКІЛЬКИ ТРИВАЄ</div>
            <div className="text-sm">До 20 хвилин: інструктаж, посадка, заїзд на тест-полі.</div>
          </div>
          <div className="rounded-sm border border-white/10 bg-[#0F0F0F] p-5">
            <MapPin size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">ДЕ</div>
            <div className="text-sm">Київ, Львів, Одеса — адреси сервісних центрів.</div>
          </div>
          <div className="rounded-sm border border-[#FF6B00]/30 bg-[#FF6B00]/5 p-5">
            <Phone size={20} className="mb-2 text-[#FF6B00]" />
            <div className="text-[10px] tracking-[0.2em] text-white/40">ПЕРЕДЗВОНИТИ</div>
            <a href="tel:+380800338899" className="text-sm font-medium hover:text-[#FF6B00]">0 800 33 88 99</a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
