export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_number: string | null
          activity_text: string
          category: string | null
          created_at: string
          id: string
          organization_id: string
        }
        Insert: {
          activity_number?: string | null
          activity_text: string
          category?: string | null
          created_at?: string
          id?: string
          organization_id: string
        }
        Update: {
          activity_number?: string | null
          activity_text?: string
          category?: string | null
          created_at?: string
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
      board_members: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean | null
          organization_id: string
          position_order: number | null
          title: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean | null
          organization_id: string
          position_order?: number | null
          title: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          organization_id?: string
          position_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: Database["public"]["Enums"]["product_category"]
        }
        Insert: {
          created_at?: string
          id?: string
          name: Database["public"]["Enums"]["product_category"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: Database["public"]["Enums"]["product_category"]
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email_primary: string | null
          email_secondary: string | null
          id: string
          organization_id: string
          phone_number: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email_primary?: string | null
          email_secondary?: string | null
          id?: string
          organization_id: string
          phone_number?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email_primary?: string | null
          email_secondary?: string | null
          id?: string
          organization_id?: string
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_info_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
      core_values: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          organization_id: string
          value_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          organization_id: string
          value_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          organization_id?: string
          value_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_values_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
      counties: {
        Row: {
          created_at: string
          id: string
          name: string
          state: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          state: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          state?: string
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
      currencies: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          rate: number
          status:
            | Database["public"]["Enums"]["supported_currency_status"]
            | null
          symbol: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          rate: number
          status?:
            | Database["public"]["Enums"]["supported_currency_status"]
            | null
          symbol?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          rate?: number
          status?:
            | Database["public"]["Enums"]["supported_currency_status"]
            | null
          symbol?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          country_id: number
          created_at: string
          id: number
          name: string
        }
        Insert: {
          country_id: number
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          country_id?: number
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          link: string | null
          read: boolean
          related_product_id: string | null
          related_review_id: string | null
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          related_product_id?: string | null
          related_review_id?: string | null
          thumbnail_url?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          related_product_id?: string | null
          related_review_id?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_review_id_fkey"
            columns: ["related_review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      objectives: {
        Row: {
          created_at: string
          id: string
          objective_number: number | null
          objective_text: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          objective_number?: number | null
          objective_text: string
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          objective_number?: number | null
          objective_text?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "objectives_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          id: string
          step: Database["public"]["Enums"]["onboarding_step"]
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          step: Database["public"]["Enums"]["onboarding_step"]
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          step?: Database["public"]["Enums"]["onboarding_step"]
          user_id?: string | null
        }
        Relationships: []
      }
      operational_areas: {
        Row: {
          area_name: string
          created_at: string
          description: string | null
          id: string
          organization_id: string
        }
        Insert: {
          area_name: string
          created_at?: string
          description?: string | null
          id?: string
          organization_id: string
        }
        Update: {
          area_name?: string
          created_at?: string
          description?: string | null
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_areas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_info"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          payment_method: string | null
          payment_status: string | null
          product_id: string
          quantity: number
          seller_id: string
          shipping_address: string
          status: string | null
          total_amount: number
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          product_id: string
          quantity: number
          seller_id: string
          shipping_address: string
          status?: string | null
          total_amount: number
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          product_id?: string
          quantity?: number
          seller_id?: string
          shipping_address?: string
          status?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_info: {
        Row: {
          acronym: string | null
          background_info: string | null
          created_at: string
          formation_date: string | null
          id: string
          logo_url: string | null
          mission: string | null
          name: string
          registration_info: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          acronym?: string | null
          background_info?: string | null
          created_at?: string
          formation_date?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name: string
          registration_info?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          acronym?: string | null
          background_info?: string | null
          created_at?: string
          formation_date?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name?: string
          registration_info?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_main: boolean | null
          product_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_main?: boolean | null
          product_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_main?: boolean | null
          product_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_views: {
        Row: {
          id: string
          ip_address: string | null
          product_id: string
          view_date: string
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          product_id: string
          view_date?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          product_id?: string
          view_date?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "products_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      regions: {
        Row: {
          country_id: number
          created_at: string
          id: number
          name: string
          region_type: string
        }
        Insert: {
          country_id: number
          created_at?: string
          id?: number
          name: string
          region_type: string
        }
        Update: {
          country_id?: number
          created_at?: string
          id?: number
          name?: string
          region_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "regions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      review_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          review_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          review_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          review_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          category: Database["public"]["Enums"]["shop_category"] | null
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["shop_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["shop_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_at: string
          id: string
          product_id: string
          wishlist_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          product_id: string
          wishlist_id: string
        }
        Update: {
          added_at?: string
          id?: string
          product_id?: string
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          name: string
          share_token: string | null
          updated_at: string
          user_id: string
          visibility: Database["public"]["Enums"]["wishlist_visibility"]
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          share_token?: string | null
          updated_at?: string
          user_id: string
          visibility?: Database["public"]["Enums"]["wishlist_visibility"]
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          share_token?: string | null
          updated_at?: string
          user_id?: string
          visibility?: Database["public"]["Enums"]["wishlist_visibility"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_unread_notifications: {
        Args: { user_id_input: string }
        Returns: number
      }
      get_enhanced_product_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          price: number
          currency: string
          category: string
          county: string
          country: string
          shop_name: string
          in_stock: boolean
          available_quantity: number
          views: number
          average_rating: number
          seller_name: string
          created_at: string
          storage_path: string
          country_id: number
        }[]
      }
      get_or_create_default_shop: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_product_comprehensive_details: {
        Args: { product_id_param: string }
        Returns: {
          id: string
          title: string
          description: string
          price: number
          currency: string
          category: string
          county: string
          country: string
          shop_name: string
          in_stock: boolean
          available_quantity: number
          views: number
          average_rating: number
          seller_name: string
          seller_contact: string
          seller_phone: string
          created_at: string
          storage_path: string
          shipping_info: string
          product_images: Json
          reviews_summary: Json
          country_id: number
        }[]
      }
      get_similar_products: {
        Args: { product_id_param: string; limit_count?: number }
        Returns: {
          id: string
          title: string
          price: number
          currency: string
          category: string
          country: string
          in_stock: boolean
          average_rating: number
          storage_path: string
          main_image_path: string
        }[]
      }
      get_user_wishlist_products: {
        Args: { user_id_param: string }
        Returns: {
          product_id: string
          title: string
          price: number
          currency: string
          category: string
        }[]
      }
      insert_test_products: {
        Args: { user_email: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      manage_admin_user: {
        Args: { target_user_id: string; should_be_admin: boolean }
        Returns: undefined
      }
      search_products_with_context: {
        Args: {
          query_text?: string
          category_filter?: string
          country_filter?: string
          min_price?: number
          max_price?: number
          currency_filter?: string
          in_stock_only?: boolean
          limit_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          price: number
          currency: string
          category: string
          county: string
          country: string
          shop_name: string
          in_stock: boolean
          available_quantity: number
          views: number
          average_rating: number
          seller_name: string
          created_at: string
          storage_path: string
          main_image_path: string
          seller_contact: string
          country_id: number
        }[]
      }
      update_product_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      notification_type: "review_comment" | "review_reply" | "product_message"
      onboarding_step: "profile_complete" | "shop_created" | "first_product"
      product_category:
        | "Electronics"
        | "Clothing"
        | "Home & Garden"
        | "Books"
        | "Sports & Outdoors"
        | "Toys & Games"
        | "Health & Beauty"
        | "Automotive"
        | "Food & Beverages"
        | "Other"
      shop_category:
        | "Electronics"
        | "Clothing"
        | "Home & Garden"
        | "Books"
        | "Sports & Outdoors"
        | "Toys & Games"
        | "Health & Beauty"
        | "Automotive"
        | "Food & Beverages"
        | "Other"
      supported_currency_status: "active" | "inactive"
      user_type: "buyer" | "seller" | "admin" | "super_admin" | "user"
      wishlist_visibility: "private" | "public" | "shared"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_type: ["review_comment", "review_reply", "product_message"],
      onboarding_step: ["profile_complete", "shop_created", "first_product"],
      product_category: [
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Books",
        "Sports & Outdoors",
        "Toys & Games",
        "Health & Beauty",
        "Automotive",
        "Food & Beverages",
        "Other",
      ],
      shop_category: [
        "Electronics",
        "Clothing",
        "Home & Garden",
        "Books",
        "Sports & Outdoors",
        "Toys & Games",
        "Health & Beauty",
        "Automotive",
        "Food & Beverages",
        "Other",
      ],
      supported_currency_status: ["active", "inactive"],
      user_type: ["buyer", "seller", "admin", "super_admin", "user"],
      wishlist_visibility: ["private", "public", "shared"],
    },
  },
} as const
