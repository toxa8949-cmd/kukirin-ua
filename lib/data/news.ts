import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types/database";

export async function getPublishedNews(limit?: number): Promise<NewsPost[]> {
  const supabase = await createClient();
  let q = supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (typeof limit === "number") q = q.limit(limit);
  const { data, error } = await q;
  if (error) {
    console.error("[getPublishedNews]", error);
    return [];
  }
  return data ?? [];
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("[getNewsBySlug]", error);
    return null;
  }
  return data;
}
