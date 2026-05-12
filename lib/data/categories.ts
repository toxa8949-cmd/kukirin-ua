import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database";

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false });
  if (error) {
    console.error("[getAllCategories]", error);
    return [];
  }
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[getCategoryBySlug]", error);
    return null;
  }
  return data;
}
