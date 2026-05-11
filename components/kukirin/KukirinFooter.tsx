import { Instagram, Facebook, Youtube, Send } from 'lucide-react';

export default function KukirinFooter() {
  return (
    <footer className="bg-[#070707] py-14 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-10 md:grid-cols-4">
          {/* Бренд */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 text-lg font-medium tracking-[0.15em]">
              KUKIRIN<span className="text-[#FF6B00]">.</span>UA
            </div>
            <p className="mb-4 max-w-xs text-xs leading-relaxed text-white/45">
              Офіційний дистриб’ютор електросамокатів KUKIRIN в Україні.
              Гарантія, сервіс, доставка.
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-[#FF6B00] hover:text-[#FF6B00]">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-[#FF6B00] hover:text-[#FF6B00]">
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-[#FF6B00] hover:text-[#FF6B00]">
                <Youtube size={14} />
              </a>
              <a href="#" aria-label="Telegram" className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-white/60 transition hover:border-[#FF6B00] hover:text-[#FF6B00]">
                <Send size={14} />
              </a>
            </div>
          </div>

          {/* Каталог */}
          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-white/40">КАТАЛОГ</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/category/urban" className="hover:text-[#FF6B00]">Міські</a></li>
              <li><a href="/category/offroad" className="hover:text-[#FF6B00]">Off-road</a></li>
              <li><a href="/category/flagship" className="hover:text-[#FF6B00]">Флагмани</a></li>
              <li><a href="/accessories" className="hover:text-[#FF6B00]">Аксесуари</a></li>
            </ul>
          </div>

          {/* Допомога */}
          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-white/40">ДОПОМОГА</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/delivery" className="hover:text-[#FF6B00]">Доставка й оплата</a></li>
              <li><a href="/warranty" className="hover:text-[#FF6B00]">Гарантія</a></li>
              <li><a href="/service" className="hover:text-[#FF6B00]">Сервіс</a></li>
              <li><a href="/contacts" className="hover:text-[#FF6B00]">Контакти</a></li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <div className="mb-3 text-[10px] tracking-[0.2em] text-white/40">КОНТАКТИ</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="tel:+380800338899" className="hover:text-[#FF6B00]">0 800 33 88 99</a></li>
              <li><a href="mailto:info@kukirin.ua" className="hover:text-[#FF6B00]">info@kukirin.ua</a></li>
              <li className="text-xs text-white/40">Пн–Нд: 9:00 – 21:00</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 pt-6 text-[11px] text-white/40 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} KUKIRIN.UA · Усі права захищені</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">Конфіденційність</a>
            <a href="/terms" className="hover:text-white">Угода</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
