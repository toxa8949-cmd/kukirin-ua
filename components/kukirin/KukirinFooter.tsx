import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { getSettings, telHref } from '@/lib/data/settings';

export default async function KukirinFooter() {
  const settings = await getSettings();

  return (
    <footer className="bg-[#F0EEE6] py-14 text-[#1a1a1a] dark:bg-[#070707] dark:text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 border-b border-[#E8E6DE] pb-10 dark:border-white/10 md:grid-cols-4">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 text-lg font-medium tracking-[0.15em]">
              KUKIRIN<span className="text-[#FF6B00]">.</span>UA
            </div>
            <p className="mb-4 max-w-xs text-xs leading-relaxed text-[#6C6A65] dark:text-white/45">
              {settings.footer_about}
            </p>
            <div className="flex gap-2">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60">
                  <Instagram size={14} />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60">
                  <Facebook size={14} />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60">
                  <Youtube size={14} />
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E8E6DE] text-[#6C6A65] transition hover:border-[#FF6B00] hover:text-[#FF6B00] dark:border-white/10 dark:text-white/60">
                  <Send size={14} />
                </a>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КАТАЛОГ</div>
            <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
              <li><a href="/category/urban" className="hover:text-[#FF6B00]">Міські</a></li>
              <li><a href="/category/offroad" className="hover:text-[#FF6B00]">Off-road</a></li>
              <li><a href="/category/flagship" className="hover:text-[#FF6B00]">Флагмани</a></li>
              <li><a href="/accessories" className="hover:text-[#FF6B00]">Аксесуари</a></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">ДОПОМОГА</div>
            <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
              <li><a href="/delivery" className="hover:text-[#FF6B00]">Доставка й оплата</a></li>
              <li><a href="/warranty" className="hover:text-[#FF6B00]">Гарантія</a></li>
              <li><a href="/service" className="hover:text-[#FF6B00]">Сервіс</a></li>
              <li><a href="/contacts" className="hover:text-[#FF6B00]">Контакти</a></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-[#6C6A65] dark:text-white/40">КОНТАКТИ</div>
            <ul className="space-y-2 text-sm text-[#4A4A48] dark:text-white/70">
              <li><a href={`tel:${telHref(settings.phone_raw || settings.phone)}`} className="hover:text-[#FF6B00]">{settings.phone}</a></li>
              <li><a href={`mailto:${settings.email}`} className="hover:text-[#FF6B00]">{settings.email}</a></li>
              <li className="text-xs text-[#6C6A65] dark:text-white/40">{settings.work_hours}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 pt-6 text-[11px] text-[#6C6A65] dark:text-white/40 md:flex-row md:items-center">
          <div>{settings.copyright}</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-[#1a1a1a] dark:hover:text-white">Конфіденційність</a>
            <a href="/terms" className="hover:text-[#1a1a1a] dark:hover:text-white">Угода</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
