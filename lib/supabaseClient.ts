import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Product {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  seller_contact: string;
  whatsapp_link: string;
  location: string;
  is_coupon: boolean;
  mess_name?: string;
  meal_type?: string;
  quantity?: number;
  created_at: string;
  is_sold: boolean;
}

export interface Bid {
  id: string;
  product_id: string;
  bidder_name: string;
  bidder_contact: string;
  bid_price: number;
  created_at: string;
} 