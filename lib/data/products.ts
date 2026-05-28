import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { KukirinScooter } from "@/lib/kukirin-data";
import type { Product, ProductImage, Category, Json } from "@/lib/types/database";

type ProductRow = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  images: Pick<ProductImage, "url" | "sort_order">[];
};

/**
 * Maps a Supabase row to the legacy KukirinScooter shape.
 *
 * Real DB schema (2026-05-12):
 *   products(id, slug, name, description, price, old_price, category_id,
 *            specs jsonb, stock, is_active, featured, cover_url,
 *            created_at, updated_at)
 *   product_images(id, product_id, url, sort_order)
 *   categories(id, slug, name, description, image_url, sort_order, created_at)
 *
 * Tolerates string specs with unit suffixes ("600W", "55 km", "15Ah")
 * and dual-motor notation ("2x1200W", "2 × 1200 W").
 */

/**
 * Головне фото товара.
 *
 * ПРІОРИТЕТ: cover_url завжди головне (це те, що адмінка зберігає як перше
 * фото в галереї — drag&drop ставить головне саме в cover_url).
 * product_images використовується лише якщо cover_url порожній.
 *
 * Раніше було навпаки (images[0] перебивав cover_url), через що головне
 * фото з галереї не показувалось — показувалось друге.
 */
function pickPrimaryImage(
  images: ProductRow["images"],
  cover?: string | null,
): string | undefined {
  // 1. cover_url — головне фото, завжди в пріоритеті
  if (cover) return cover;
  // 2. fallback: перше фото галереї за sort_order
  if (!images || images.length === 0) return undefined;
  const sorted = [...images].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  return sorted[0]?.url ?? undefined;
}

function readSpec<T = unknown>(
  specs: Json | null,
  keys: string[],
): T | undefined {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return undefined;
  const o = specs as Record<string, unknown>;
  for (const k of keys) {
    if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k] as T;
  }
  return undefined;
}

/**
 * Parse a numeric value from a JSON cell that may be:
 *   - a number: 600
 *   - a string with a unit suffix: "600W", "55 km", "15Ah"
 *   - a multiplier expression: "2x1200W", "2 × 1200 W" → 2400
 *   - a range "40-55 km" → first number
 * Returns 0 on failure.
 */
function parseNumeric(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string") return 0;

  const s = v.replace(",", ".").trim();
  // Detect multiplier patterns: N × M, N x M, N*M
  const mul = s.match(/(\d+(?:\.\d+)?)\s*[x×*]\s*(\d+(?:\.\d+)?)/i);
  if (mul) {
    const a = Number(mul[1]);
    const b = Number(mul[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) return a * b;
  }
  // Fallback: first numeric token
  const m = s.match(/-?\d+(?:\.\d+)?/);
  if (m) {
    const n = Number(m[0]);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function toKukirin(row: ProductRow): KukirinScooter {
  const specs = row.specs;

  const cat = readSpec<string>(specs, ["category"]);
  const validCat: KukirinScooter["category"] =
    cat === "offroad" || cat === "flagship" || cat === "urban" ? cat : "urban";

  const badge = readSpec<string>(specs, ["badge"]);
  const validBadge: KukirinScooter["badge"] | undefined =
    badge === "hit" || badge === "new" || badge === "top" ? badge : undefined;

  const power    = parseNumeric(readSpec(specs, ["power", "power_w", "motor"]));
  const maxSpeed = parseNumeric(readSpec(specs, ["maxSpeed", "max_speed", "top_speed", "speed"]));
  const range    = parseNumeric(readSpec(specs, ["range", "range_km", "distance"]));
  const battery  = String(readSpec(specs, ["battery", "battery_label"]) ?? "");

  return {
    slug: row.slug,
    name: row.name,
    category: validCat,
    badge: validBadge,
    power,
    maxSpeed,
    range,
    battery,
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image: pickPrimaryImage(
      row.images,
      row.cover_url ?? readSpec<string>(specs, ["image"]),
    ),
    tagline:
      readSpec<string>(specs, ["tagline"]) ??
      (row.description ? row.description.slice(0, 120) : ""),
  };
}

const PRODUCT_SELECT = `
  *,
  category:categories(slug,name),
  images:product_images(url,sort_order)
`;

export async function getAllProducts(): Promise<KukirinScooter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getAllProducts]", error);
    return [];
  }
  return ((data ?? []) as unknown as ProductRow[]).map(toKukirin);
}

export async function getProductsByCategorySlug(
  slug: string,
): Promise<KukirinScooter[]> {
  const supabase = await createClient();
  // Try real category by slug first.
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catId: string | undefined = (cat as any)?.id;

  if (catId) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .eq("category_id", catId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getProductsByCategorySlug]", error);
      return [];
    }
    return ((data ?? []) as unknown as ProductRow[]).map(toKukirin);
  }
  // Legacy fallback: urban / offroad / flagship are stored in specs.category.
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .contains("specs", { category: slug });
  if (error) {
    console.error("[getProductsByCategorySlug fallback]", error);
    return [];
  }
  return ((data ?? []) as unknown as ProductRow[]).map(toKukirin);
}

export async function getProductBySlug(slug: string): Promise<
  | (KukirinScooter & {
      id: string;
      description: string | null;
      gallery: string[];
      stock: number;
    })
  | null
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[getProductBySlug]", error);
    return null;
  }
  const row = data as unknown as ProductRow;
  const base = toKukirin(row);
  // Галерея: cover_url першим (головне), потім решта з product_images за sort_order.
  // Уникаємо дублювання якщо cover_url випадково є і в product_images.
  const galleryFromImages = [...(row.images ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((i) => i.url);
  const gallery: string[] = [];
  if (row.cover_url) gallery.push(row.cover_url);
  for (const url of galleryFromImages) {
    if (url !== row.cover_url) gallery.push(url);
  }
  if (gallery.length === 0 && row.cover_url) gallery.push(row.cover_url);
  return {
    ...base,
    id: row.id,
    description: row.description,
    gallery,
    stock: row.stock ?? 0,
  };
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<KukirinScooter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
  return ((data ?? []) as unknown as ProductRow[]).map(toKukirin);
}
