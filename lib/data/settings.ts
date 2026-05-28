import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Налаштування сайту з таблиці site_settings (key/value).
 * Редагуються в адмінці /admin/settings.
 *
 * getSettings() повертає об'єкт { key: value } з усіма налаштуваннями.
 * Якщо БД недоступна або ключа немає — використовуються дефолти нижче.
 */

export type SiteSettings = Record<string, string>;

// Дефолти — якщо в БД ключа немає або БД недоступна.
const DEFAULTS: SiteSettings = {
  site_title: "KUKIRIN — офіційний магазин в Україні",
  footer_about:
    "Офіційний партнер KUKIRIN в Україні. Доставка по всій країні, гарантія від виробника, сервіс у Києві.",
  copyright: "© 2026 kukirinstore.com.ua",
  phone: "0 (95) 898-10-07",
  phone_raw: "+380958981007",
  email: "info@kukirin.ua",
  work_hours: "Пн–Нд: 9:00 – 21:00",
  telegram: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");
    if (error || !data) return { ...DEFAULTS };

    const out: SiteSettings = { ...DEFAULTS };
    for (const row of data as Array<{ key: string; value: string }>) {
      // Порожні значення з БД не перетирають дефолти.
      if (row.value !== null && row.value !== undefined && row.value !== "") {
        out[row.key] = row.value;
      }
    }
    return out;
  } catch {
    return { ...DEFAULTS };
  }
}

/** Перетворює показовий номер на формат для tel: (тільки + і цифри). */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}
