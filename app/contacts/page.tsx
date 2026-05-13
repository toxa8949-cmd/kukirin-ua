import PageShell from '@/components/kukirin/PageShell';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Контакти KUKIRIN.UA' };

export default function ContactsPage() {
  return (
    <PageShell breadcrumb="CONTACTS" title="Контакти" subtitle="Зателефонуйте, напишіть або заїжджайте — ми завжди раді допомогти з вибором та сервісом.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a href="tel:+380800338899" className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
          <Phone size={22} className="mb-3 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">ТЕЛЕФОН</div>
          <div className="text-base font-medium">0 800 33 88 99</div>
          <div className="text-xs text-[#6C6A65] dark:text-white/45">Безкоштовно по Україні</div>
        </a>
        <a href="mailto:info@kukirin.ua" className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
          <Mail size={22} className="mb-3 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">EMAIL</div>
          <div className="text-base font-medium">info@kukirin.ua</div>
          <div className="text-xs text-[#6C6A65] dark:text-white/45">Відповідь до 2 годин</div>
        </a>
        <a href="#" className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
          <Send size={22} className="mb-3 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">TELEGRAM</div>
          <div className="text-base font-medium">@kukirin_ua</div>
          <div className="text-xs text-[#6C6A65] dark:text-white/45">Найшвидший канал</div>
        </a>
        <a href="#" className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5 transition hover:border-[#FF6B00]">
          <MessageCircle size={22} className="mb-3 text-[#FF6B00]" />
          <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">VIBER / WHATSAPP</div>
          <div className="text-base font-medium">+380 67 123 45 67</div>
          <div className="text-xs text-[#6C6A65] dark:text-white/45">Пишіть будь-коли</div>
        </a>
      </div>

      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-medium tracking-tight">Шоуруми і сервіс</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { city: 'КИЇВ', addr: 'вул. Електриків, 26', work: 'Пн–Сб: 10:00 – 19:00, Нд: 11:00 – 17:00' },
            { city: 'ЛЬВІВ', addr: 'вул. Городоцька, 359', work: 'Пн–Сб: 10:00 – 19:00, Нд: вихідний' },
            { city: 'ОДЕСА', addr: 'вул. Велика Арнаутська, 56', work: 'Пн–Сб: 10:00 – 19:00, Нд: 11:00 – 16:00' },
          ].map((p) => (
            <div key={p.city} className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-5">
              <MapPin size={20} className="mb-2 text-[#FF6B00]" />
              <div className="text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">{p.city}</div>
              <div className="mb-2 text-sm">{p.addr}</div>
              <div className="flex items-start gap-1 text-xs text-[#6C6A65] dark:text-white/45"><Clock size={12} className="mt-0.5" /> {p.work}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
        <h3 className="mb-2 text-lg font-medium">Реквізити</h3>
        <div className="grid grid-cols-1 gap-3 text-xs text-[#4A4A48] dark:text-white/60 sm:grid-cols-2">
          <div><span className="text-[#6C6A65] dark:text-white/40">Назва:</span> ФОП «KUKIRIN.UA»</div>
          <div><span className="text-[#6C6A65] dark:text-white/40">ЄДРПОУ:</span> 12345678</div>
          <div><span className="text-[#6C6A65] dark:text-white/40">IBAN:</span> UA00 0000 0000 0000 0000 0000 000</div>
          <div><span className="text-[#6C6A65] dark:text-white/40">Платник ПДВ:</span> ні</div>
        </div>
      </div>
    </PageShell>
  );
}
