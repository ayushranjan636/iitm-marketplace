import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Fetch bids for a specific product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', productId)
      .order('bid_price', { ascending: false });

    if (error) {
      console.error('Error fetching bids:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/bids:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Submit a new bid
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.product_id || !body.bidder_name || !body.bidder_contact || !body.bid_price) {
      return NextResponse.json(
        { error: 'Missing required fields: product_id, bidder_name, bidder_contact, bid_price' },
        { status: 400 }
      );
    }

    // Validate bid price is a positive number
    if (typeof body.bid_price !== 'number' || body.bid_price <= 0) {
      return NextResponse.json(
        { error: 'bid_price must be a positive number' },
        { status: 400 }
      );
    }

    // Check if product exists and is not sold
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('is_sold, price')
      .eq('id', body.product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.is_sold) {
      return NextResponse.json(
        { error: 'Cannot bid on a sold product' },
        { status: 400 }
      );
    }

    // Optional: Check if bid is higher than current highest bid
    const { data: existingBids } = await supabase
      .from('bids')
      .select('bid_price')
      .eq('product_id', body.product_id)
      .order('bid_price', { ascending: false })
      .limit(1);

    if (existingBids && existingBids.length > 0) {
      const highestBid = existingBids[0].bid_price;
      if (body.bid_price <= highestBid) {
        return NextResponse.json(
          { error: `Bid must be higher than current highest bid (₹${highestBid})` },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('bids')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating bid:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/bids:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 