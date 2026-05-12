import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { KukirinScooter } from "@/lib/kukirin-data";
import type { Product, ProductImage, Category, Json } from "@/lib/types/database";

type ProductRow = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  images: Pick<ProductImage, "url" | "sort_order">[];
};

/**
 * Maps a Supabase row to the legacy KukirinScooter shape so existing UI
 * components keep working without changes.
 *
 * NOTE: real DB schema (2026-05-12):
 *   products(id, slug, name, description, price, old_price, category_id,
 *            specs jsonb, stock, is_active, featured, cover_url,
 *            created_at, updated_at)
 *   product_images(id, product_id, url, sort_order)
 *     -- no is_primary, no alt
 *   categories(id, slug, name, description, image_url, sort_order, created_at)
 *     -- no is_active
 */

function pickPrimaryImage(
  images: ProductRow["images"],
  fallback?: string | null,
): string | undefined {
  if (!images || images.length === 0) return fallback ?? undefined;
  const sorted = [...images].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
  return sorted[0]?.url ?? fallback ?? undefined;
}

function specsField<T = unknown>(specs: Json | null, key: string): T | undefined {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return undefined;
  return (specs as Record<string, unknown>)[key] as T | undefined;
}

function toKukirin(row: ProductRow): KukirinScooter {
  const specs = row.specs;
  const cat = specsField<string>(specs, "category");
  const validCat: KukirinScooter["category"] =
    cat === "offroad" || cat === "flagship" || cat === "urban" ? cat : "urban";
  const badge = specsField<string>(specs, "badge");
  const validBadge: KukirinScooter["badge"] | undefined =
    badge === "hit" || badge === "new" || badge === "top" ? badge : undefined;

  return {
    slug: row.slug,
    name: row.name,
    category: validCat,
    badge: validBadge,
    power: Number(specsField<number | string>(specs, "power") ?? 0),
    maxSpeed: Number(specsField<number | string>(specs, "maxSpeed") ?? 0),
    range: Number(specsField<number | string>(specs, "range") ?? 0),
    battery: String(specsField<string>(specs, "battery") ?? ""),
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : undefined,
    image: pickPrimaryImage(row.images, row.cover_url ?? specsField<string>(specs, "image")),
    tagline:
      specsField<string>(specs, "tagline") ??
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
  const gallery = [...(row.images ?? [])]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((i) => i.url);
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
