
// Copy the exact same types from the web version
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          available_quantity: number | null
          average_rating: number | null
          category: Database["public"]["Enums"]["product_category"] | null
          country_id: number | null
          county: string | null
          created_at: string
          currency: string | null
          description: string | null
          expires_at: string | null
          id: string
          in_stock: boolean | null
          likes: number | null
          price: number | null
          product_status: string | null
          shipping_info: string | null
          shop_id: string | null
          shop_name: string | null
          storage_path: string
          title: string | null
          user_id: string
          validity_period: string | null
          views: number | null
        }
        Insert: {
          available_quantity?: number | null
          average_rating?: number | null
          category?: Database["public"]["Enums"]["product_category"] | null
          country_id?: number | null
          county?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          in_stock?: boolean | null
          likes?: number | null
          price?: number | null
          product_status?: string | null
          shipping_info?: string | null
          shop_id?: string | null
          shop_name?: string | null
          storage_path: string
          title?: string | null
          user_id: string
          validity_period?: string | null
          views?: number | null
        }
        Update: {
          available_quantity?: number | null
          average_rating?: number | null
          category?: Database["public"]["Enums"]["product_category"] | null
          country_id?: number | null
          county?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          in_stock?: boolean | null
          likes?: number | null
          price?: number | null
          product_status?: string | null
          shipping_info?: string | null
          shop_id?: string | null
          shop_name?: string | null
          storage_path?: string
          title?: string | null
          user_id?: string
          validity_period?: string | null
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string
          address: string | null
          avatar_url: string | null
          contact_email: string | null
          created_at: string
          custom_product_limit: number | null
          full_name: string | null
          id: string
          is_active: boolean | null
          onboarding_completed: boolean | null
          phone_number: string | null
          shop_description: string | null
          shop_name: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
          username: string | null
        }
        Insert: {
          account_type?: string
          address?: string | null
          avatar_url?: string | null
          contact_email?: string | null
          created_at?: string
          custom_product_limit?: number | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          shop_description?: string | null
          shop_name?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Update: {
          account_type?: string
          address?: string | null
          avatar_url?: string | null
          contact_email?: string | null
          created_at?: string
          custom_product_limit?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          shop_description?: string | null
          shop_name?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_category:
        | "Automotive"
        | "Books"
        | "Clothing"
        | "Electronics"
        | "Food & Beverages"
        | "Health & Beauty"
        | "Home & Garden"
        | "Other"
        | "Sports & Outdoors"
        | "Toys & Games"
      user_type: "admin" | "super_admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
