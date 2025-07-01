-- BKL Marketplace Database Schema
-- Run this in your Supabase SQL Editor

-- PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  seller_contact TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,
  location TEXT NOT NULL,
  is_coupon BOOLEAN NOT NULL DEFAULT false,
  mess_name TEXT,
  meal_type TEXT,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_sold BOOLEAN NOT NULL DEFAULT false
);

-- BIDS TABLE
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  bidder_name TEXT NOT NULL,
  bidder_contact TEXT NOT NULL,
  bid_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products table
-- Allow anyone to read products (public listings)
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow product owners to update their products
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid()::text = seller_contact);

-- RLS Policies for bids table
-- Allow anyone to read bids for a product
CREATE POLICY "Anyone can read bids"
  ON bids FOR SELECT
  USING (true);

-- Allow authenticated users to insert bids
CREATE POLICY "Authenticated users can insert bids"
  ON bids FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_coupon ON products(is_coupon);
CREATE INDEX idx_products_mess_name ON products(mess_name);
CREATE INDEX idx_products_meal_type ON products(meal_type);
CREATE INDEX idx_products_location ON products(location);
CREATE INDEX idx_products_is_sold ON products(is_sold);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_bids_product_id ON bids(product_id);
CREATE INDEX idx_bids_created_at ON bids(created_at DESC);

-- Insert sample data (optional)
INSERT INTO products (
  title, 
  description, 
  category, 
  price, 
  seller_contact, 
  whatsapp_link, 
  location, 
  is_coupon, 
  mess_name, 
  meal_type, 
  quantity
) VALUES 
(
  'Mess Coupon - Nilgiri Breakfast',
  'Selling my breakfast coupon for Nilgiri mess',
  'coupons',
  50,
  '919876543210',
  'https://wa.me/919876543210?text=Hey%20I%27m%20contacting%20you%20to%20talk%20about%20your%20Mess%20Coupon%20-%20Nilgiri%20Breakfast',
  'Online',
  true,
  'Nilgiri',
  'Breakfast',
  1
),
(
  'Used Cycle - Hero Sprint',
  'Good condition cycle, selling because I am graduating',
  'cycles',
  2000,
  '919876543211',
  'https://wa.me/919876543211?text=Hey%20I%27m%20contacting%20you%20to%20talk%20about%20your%20Used%20Cycle%20-%20Hero%20Sprint',
  'Hostel 2',
  false,
  NULL,
  NULL,
  NULL
),
(
  'Laptop Stand - Adjustable',
  'Metal laptop stand, barely used',
  'electronics',
  500,
  '919876543212',
  'https://wa.me/919876543212?text=Hey%20I%27m%20contacting%20you%20to%20talk%20about%20your%20Laptop%20Stand%20-%20Adjustable',
  'Hostel 5',
  false,
  NULL,
  NULL,
  NULL
); 