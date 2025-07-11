import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price: number
          category: string
          material: string
          occasion: string
          image_url: string
          stock: number
          rating: number
          reviews_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price: number
          category: string
          material: string
          occasion: string
          image_url: string
          stock: number
          rating?: number
          reviews_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          category?: string
          material?: string
          occasion?: string
          image_url?: string
          stock?: number
          rating?: number
          reviews_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          total_amount: number
          status: string
          payment_method: string
          payment_status: string
          shipping_address: string
          customer_name: string
          customer_email: string
          customer_phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          total_amount: number
          status?: string
          payment_method: string
          payment_status?: string
          shipping_address: string
          customer_name: string
          customer_email: string
          customer_phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          total_amount?: number
          status?: string
          payment_method?: string
          payment_status?: string
          shipping_address?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          customer_name: string
          customer_image_url: string | null
          product_image_url: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          comment: string
          customer_name: string
          customer_image_url?: string | null
          product_image_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          comment?: string
          customer_name?: string
          customer_image_url?: string | null
          product_image_url?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          address: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          address?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          address?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}