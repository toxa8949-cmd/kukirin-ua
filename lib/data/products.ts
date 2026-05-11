import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { KukirinScooter } from "@/lib/kukirin-data";
import type { Product, ProductImage, Category, Json } from "@/lib/types/database";

type ProductRow = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  images: Pick<ProductImage, "url" | "alt" | "is_primary" | "sort_order">[];
};

/**
 * Maps a Supabase row to the legacy KukirinScooter shape so existing UI
 * components keep working without changes.
 */
function pickPrimaryImage(
  images: ProductRow["images"],
  fallback?: string | null,
): string | undefined {
  if (!images || images.length === 0) return fallback ?? undefined;
  const primary = images.find((i) => i.is_primary);
  if (primary?.url) return primary.url;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
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
    image: pickPrimaryImage(row.images, specsField<string>(specs, "image")),
    tagline:
      specsField<string>(specs, "tagline") ?? row.short_description ?? "",
  };
}

const PRODUCT_SELECT = `
  *,
  category:categories(slug,name),
  images:product_images(url,alt,is_primary,sort_order)
`;

export async function getAllProducts(): Promise<KukirinScooter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
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

  if (cat?.id) {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .eq("category_id", cat.id)
      .order("sort_order", { ascending: true });
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
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)
    .map((i) => i.url);
  return {
    ...base,
    id: row.id,
    description: row.description,
    gallery,
    stock: row.stock,
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
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) {
    console.error("[getFeaturedProducts]", error);
    return [];
  }
  return ((data ?? []) as unknown as ProductRow[]).map(toKukirin);
}
