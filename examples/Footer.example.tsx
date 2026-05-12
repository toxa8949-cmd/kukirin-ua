// ============================================================
// ПРИКЛАД нового Footer.tsx
// ============================================================
// Server component, тягне категорії + налаштування з БД.
// Можна повністю замінити твій поточний Footer цим файлом
// (якщо стилістика співпадає), або взяти звідси шматки.
// ============================================================

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/site-settings';

async function getFooterCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('slug, name')
    .order('sort_order', { ascending: true, nullsFirst: false });
  return (data ?? []) as Array<{ slug: string; name: string }>;
}

export default async function Footer() {
  const [categories, s] = await Promise.all([
    getFooterCategories(),
    getSiteSettings(),
  ]);

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + about */}
          <div>
            <Link href="/" className="text-xl font-medium tracking-tight">
              KUKIRIN<span className="text-[#FF6B00]">.UA</span>
            </Link>
            {s.footer_about && (
              <p className="mt-4 text-sm leading-relaxed text-white/55">{s.footer_about}</p>
            )}
            {/* Social */}
            {(s.telegram_url || s.instagram_url || s.facebook_url) && (
              <div className="mt-5 flex gap-3">
                {s.telegram_url && (
                  <a
                    href={s.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="rounded-sm border border-white/10 p-2 text-white/70 transition hover:border-[#FF6B00]/50 hover:text-[#FF6B00]"
                  >
                    <Send size={16} />
                  </a>
                )}
                {s.instagram_url && (
                  <a
                    href={s.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-sm border border-white/10 p-2 text-white/70 transition hover:border-[#FF6B00]/50 hover:text-[#FF6B00]"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {s.facebook_url && (
                  <a
                    href={s.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="rounded-sm border border-white/10 p-2 text-white/70 transition hover:border-[#FF6B00]/50 hover:text-[#FF6B00]"
                  >
                    <Facebook size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Categories — dynamic */}
          <div>
            <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// КАТАЛОГ</div>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-white/65 transition hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ІНФО</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-white/65 transition hover:text-white">
                  Блог
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-white/65 transition hover:text-white">
                  Сервіс
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-white/65 transition hover:text-white">
                  Контакти
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/65 transition hover:text-white">
                  Політика конфіденційності
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <div className="mb-4 text-[10px] tracking-[0.2em] text-[#FF8A33]">// ЗВ'ЯЗОК</div>
            <ul className="space-y-2 text-sm">
              {s.phone && (
                <li>
                  <a
                    href={`tel:${s.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-white/65 transition hover:text-white"
                  >
                    <Phone size={12} /> {s.phone}
                  </a>
                </li>
              )}
              {s.email && (
                <li>
                  <a
                    href={`mailto:${s.email}`}
                    className="inline-flex items-center gap-2 text-white/65 transition hover:text-white"
                  >
                    <Mail size={12} /> {s.email}
                  </a>
                </li>
              )}
              {s.address && (
                <li className="inline-flex items-start gap-2 text-white/65">
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{s.address}</span>
                </li>
              )}
              {s.work_hours && (
                <li className="inline-flex items-start gap-2 text-white/65">
                  <Clock size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{s.work_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <span>{s.copyright}</span>
          <span>Made with care for KUKIRIN riders</span>
        </div>
      </div>
    </footer>
  );
}
