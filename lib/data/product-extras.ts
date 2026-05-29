import type { Json } from "@/lib/types/database";

/**
 * Допоміжний модуль для читання SEO-розширень з products.specs (jsonb).
 *
 * Поля, які можна додати в specs через адмінку:
 *   long_description: string         — розширений опис (1000+ символів)
 *   faq: [{q,a}, ...]                — питання-відповіді
 *   video_url: string                — YouTube посилання на огляд
 *   video_title?: string             — заголовок відео (опц.)
 *   weight: number                   — вага в кг
 *   color: string                    — колір
 *   sku, mpn, gtin: string           — для magazine schema
 *   features: string[]               — список ключових переваг для тексту
 *   dimensions: "100×50×30"          — габарити
 *   load_capacity: number            — макс. навантаження кг
 *   ip_rating: string                — IPX4 / IP54 / тощо
 *   tire_size: string                — розмір коліс
 *   warranty: string                 — гарантія (наприклад "12 місяців")
 *   charging_time: string            — час зарядки
 *
 * Усі поля опційні — функції повертають undefined / порожні масиви, якщо їх немає,
 * тож існуючі товари без розширених полів продовжать працювати.
 */

export type ProductFAQ = { q: string; a: string };

function read<T = unknown>(specs: Json | null | undefined, key: string): T | undefined {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return undefined;
  const v = (specs as Record<string, unknown>)[key];
  return v === undefined || v === null || v === "" ? undefined : (v as T);
}

function readString(specs: Json | null | undefined, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = read<unknown>(specs, k);
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function readNumber(specs: Json | null | undefined, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = read<unknown>(specs, k);
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v.replace(",", "."));
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}

export function getLongDescription(specs: Json | null | undefined): string | undefined {
  return readString(specs, "long_description", "longDescription", "full_description");
}

export function getFAQ(specs: Json | null | undefined): ProductFAQ[] {
  const v = read<unknown>(specs, "faq");
  if (!Array.isArray(v)) return [];
  return v
    .filter((it): it is Record<string, unknown> => !!it && typeof it === "object")
    .map((it) => ({
      q: String(it.q ?? it.question ?? "").trim(),
      a: String(it.a ?? it.answer ?? "").trim(),
    }))
    .filter((it) => it.q && it.a);
}

export function getVideoUrl(specs: Json | null | undefined): string | undefined {
  return readString(specs, "video_url", "videoUrl", "youtube_url");
}

/** Витягує YouTube id з різних варіантів URL. */
export function extractYouTubeId(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return m ? m[1] : undefined;
}

export function getVideoTitle(specs: Json | null | undefined): string | undefined {
  return readString(specs, "video_title", "videoTitle");
}

export function getExtraSpecs(specs: Json | null | undefined) {
  return {
    weight: readNumber(specs, "weight", "weight_kg"),
    color: readString(specs, "color"),
    sku: readString(specs, "sku"),
    mpn: readString(specs, "mpn"),
    gtin: readString(specs, "gtin", "gtin13", "ean"),
    dimensions: readString(specs, "dimensions"),
    loadCapacity: readNumber(specs, "load_capacity", "max_load", "loadCapacity"),
    ipRating: readString(specs, "ip_rating", "ipRating"),
    tireSize: readString(specs, "tire_size", "tireSize", "tires"),
    warranty: readString(specs, "warranty"),
    chargingTime: readString(specs, "charging_time", "chargingTime"),
  };
}

export function getFeatureList(specs: Json | null | undefined): string[] {
  const v = read<unknown>(specs, "features");
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}
