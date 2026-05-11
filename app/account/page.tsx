import PageShell from '@/components/kukirin/PageShell';
import { User, Package, MapPin, LogIn } from 'lucide-react';

export const metadata = { title: 'Особистий кабінет' };

export default function AccountPage() {
  return (
    <PageShell breadcrumb="ACCOUNT" title="Особистий кабінет" subtitle="Увійдіть, щоб бачити історію замовлень, бонусний рахунок і збережені адреси доставки.">
      <div className="mx-auto max-w-md rounded-sm border border-white/10 bg-[#0F0F0F] p-6 sm:p-8">
        <User size={32} className="mx-auto mb-4 text-[#FF6B00]" />
        <h2 className="mb-2 text-center text-2xl font-medium">Вхід в акаунт</h2>
        <p className="mb-6 text-center text-sm text-white/55">Введіть номер телефону — ми надішлемо SMS-код для входу.</p>
        <form className="space-y-3">
          <input type="tel" placeholder="+380 __ ___ __ __" className="w-full rounded-sm border border-white/15 bg-black px-4 py-3 text-sm placeholder:text-white/30 focus:border-[#FF6B00] focus:outline-none" />
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF6B00] px-4 py-3 text-xs font-medium tracking-[0.1em] text-black hover:bg-[#FF8A33]">
            <LogIn size={14} /> ОТРИМАТИ КОД
          </button>
        </form>
        <p className="mt-4 text-center text-[10px] text-white/35">Натискаючи кнопку, ви погоджуєтесь з умовами використання й політикою конфіденційності.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-white/10 p-4 text-center">
          <Package size={20} className="mx-auto mb-2 text-[#FF6B00]" />
          <div className="text-sm font-medium">Історія замовлень</div>
          <div className="text-xs text-white/45">Статус, трекінг, документи</div>
        </div>
        <div className="rounded-sm border border-white/10 p-4 text-center">
          <MapPin size={20} className="mx-auto mb-2 text-[#FF6B00]" />
          <div className="text-sm font-medium">Адреси</div>
          <div className="text-xs text-white/45">Швидке оформлення доставки</div>
        </div>
        <div className="rounded-sm border border-white/10 p-4 text-center">
          <User size={20} className="mx-auto mb-2 text-[#FF6B00]" />
          <div className="text-sm font-medium">Бонуси</div>
          <div className="text-xs text-white/45">Кешбек на наступну покупку</div>
        </div>
      </div>
    </PageShell>
  );
}
