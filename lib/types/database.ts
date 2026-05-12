/**
 * Database types for Supabase (kukirin-ua).
 *
 * Mirrors the ACTUAL schema in DB ssxygllbnkjoklfhdfkb as of 2026-05-12.
 *
 * Tables: categories, products, product_images, orders, order_items,
 *         news, admins.
 *
 * Can later be regenerated automatically with:
 *   npx supabase gen types typescript --project-id ssxygllbnkjoklfhdfkb > lib/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          sort_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
      };

      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          price: number;
          old_price: number | null;
          category_id: string | null;
          specs: Json | null;
          stock: number | null;
          is_active: boolean | null;
          featured: boolean | null;
          cover_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          price: number;
          old_price?: number | null;
          category_id?: string | null;
          specs?: Json | null;
          stock?: number | null;
          is_active?: boolean | null;
          featured?: boolean | null;
          cover_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          price?: number;
          old_price?: number | null;
          category_id?: string | null;
          specs?: Json | null;
          stock?: number | null;
          is_active?: boolean | null;
          featured?: boolean | null;
          cover_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };

      product_images: {
        Row: {
          id: string;
          product_id: string | null;
          url: string;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          url: string;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          url?: string;
          sort_order?: number | null;
        };
      };

      orders: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          email: string | null;
          address: string | null;
          total: number;
          status: string;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          customer_name: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          total: number;
          status?: string;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          customer_name?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          total?: number;
          status?: string;
          notes?: string | null;
          created_at?: string | null;
        };
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          name_snapshot: string;
          price_snapshot: number;
          quantity: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          name_snapshot: string;
          price_snapshot: number;
          quantity: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          name_snapshot?: string;
          price_snapshot?: number;
          quantity?: number;
        };
      };

      news: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          cover_url: string | null;
          published: boolean | null;
          published_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          published?: boolean | null;
          published_at?: string | null;
          created_at?: string | null;
        };
      };

      admins: {
        Row: {
          user_id: string;
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          created_at?: string | null;
        };
        Update: {
          user_id?: string;
          created_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Convenience helper types
// ---------------------------------------------------------------------------

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Category = Tables<"categories">;
export type Product = Tables<"products">;
export type ProductImage = Tables<"product_images">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type NewsPost = Tables<"news">;
export type Admin = Tables<"admins">;

/** Product enriched with its category and images (typical catalog query). */
export type ProductWithRelations = Product & {
  category: Pick<Category, "slug" | "name"> | null;
  images: Pick<ProductImage, "url" | "sort_order">[];
};

/** Order with its line items (typical admin/orders query). */
export type OrderWithItems = Order & {
  items: OrderItem[];
};
