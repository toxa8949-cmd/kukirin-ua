import PageShell from '@/components/kukirin/PageShell';
import { Shield, CheckCircle2, XCircle, FileText } from 'lucide-react';

export const metadata = { title: 'Гарантія KUKIRIN' };

export default function WarrantyPage() {
  return (
    <PageShell breadcrumb="WARRANTY" title="Гарантія" subtitle="Кожен самокат KUKIRIN — з офіційною гарантією виробника й українською сервісною підтримкою.">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <Shield size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Що покриває</h2>
          <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF6B00]" /> Рама і складальний механізм</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF6B00]" /> Електродвигун і контролер</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF6B00]" /> Батарея</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF6B00]" /> Дисплей і електронні компоненти</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#FF6B00]" /> Безкоштовна заміна несправних деталей</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6">
          <XCircle size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Що не покриває</h2>
          <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
            <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-[#6C6A65] dark:text-white/50" /> Витратні деталі: шини, гальмівні колодки, ручки</li>
            <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-[#6C6A65] dark:text-white/50" /> Механічні пошкодження від падінь і ДТП</li>
            <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-[#6C6A65] dark:text-white/50" /> Втручання в електроніку поза сервісом</li>
            <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-[#6C6A65] dark:text-white/50" /> Експлуатація під дощем понад IPX4</li>
            <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-[#6C6A65] dark:text-white/50" /> Перевантаження більше 120 кг для більшості моделей</li>
          </ul>
        </section>

        <section className="rounded-sm border border-[#E8E6DE] dark:border-white/10 bg-white dark:bg-[#0F0F0F] p-6 md:col-span-2">
          <FileText size={26} className="mb-3 text-[#FF6B00]" />
          <h2 className="mb-3 text-xl font-medium">Як скористатись</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[#4A4A48] dark:text-white/70">
            <li>Зателефонуйте на гарячу лінію <a href="tel:+380958981007" className="text-[#FF6B00] hover:underline">0 (95) 898-10-07</a> або напишіть у Telegram.</li>
            <li>Опишіть проблему, ми попередньо діагностуємо по фото/відео — у багатьох випадках обходимось без візиту.</li>
            <li>Якщо потрібен ремонт — привозите самокат у сервіс або відправляєте НП за наш рахунок.</li>
            <li>Діагностика — 1–2 дні. Заміна вузла — у середньому 3–7 днів за наявності запчастин.</li>
          </ol>
        </section>
      </div>
    </PageShell>
  );
}
