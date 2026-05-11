/**
 * Database types for Supabase (kukirin-ua).
 *
 * Mirrors the schema: categories, products, product_images,
 * orders, order_items, news, admins.
 *
 * These types can later be regenerated automatically with:
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
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      products: {
        Row: {
          id: string;
          category_id: string | null;
          slug: string;
          name: string;
          short_description: string | null;
          description: string | null;
          price: number;
          old_price: number | null;
          currency: string;
          stock: number;
          sku: string | null;
          specs: Json | null;
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          slug: string;
          name: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          old_price?: number | null;
          currency?: string;
          stock?: number;
          sku?: string | null;
          specs?: Json | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          slug?: string;
          name?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          old_price?: number | null;
          currency?: string;
          stock?: number;
          sku?: string | null;
          specs?: Json | null;
          is_active?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          status: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          delivery_method: string | null;
          delivery_address: string | null;
          payment_method: string | null;
          subtotal: number;
          shipping_cost: number;
          total: number;
          currency: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          status?: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          delivery_method?: string | null;
          delivery_address?: string | null;
          payment_method?: string | null;
          subtotal: number;
          shipping_cost?: number;
          total: number;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          status?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          delivery_method?: string | null;
          delivery_address?: string | null;
          payment_method?: string | null;
          subtotal?: number;
          shipping_cost?: number;
          total?: number;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_slug: string | null;
          unit_price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_slug?: string | null;
          unit_price: number;
          quantity: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_slug?: string | null;
          unit_price?: number;
          quantity?: number;
          subtotal?: number;
          created_at?: string;
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
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      admins: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          role?: string;
          created_at?: string;
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
  category: Category | null;
  images: ProductImage[];
};

/** Order with its line items (typical admin/orders query). */
export type OrderWithItems = Order & {
  items: OrderItem[];
};
