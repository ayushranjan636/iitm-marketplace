import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Fetch products with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (searchParams.get('category')) {
      query = query.eq('category', searchParams.get('category'));
    }
    
    if (searchParams.get('is_coupon')) {
      query = query.eq('is_coupon', searchParams.get('is_coupon') === 'true');
    }
    
    if (searchParams.get('mess_name')) {
      query = query.eq('mess_name', searchParams.get('mess_name'));
    }
    
    if (searchParams.get('meal_type')) {
      query = query.eq('meal_type', searchParams.get('meal_type'));
    }
    
    if (searchParams.get('location')) {
      query = query.eq('location', searchParams.get('location'));
    }
    
    if (searchParams.get('is_sold') !== null) {
      query = query.eq('is_sold', searchParams.get('is_sold') === 'true');
    }

    // Search by title or description
    if (searchParams.get('search')) {
      const searchTerm = searchParams.get('search')!;
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.category || !body.price || !body.seller_contact || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category, price, seller_contact, location' },
        { status: 400 }
      );
    }

    // Generate WhatsApp link
    const whatsapp_link = `https://wa.me/${body.seller_contact}?text=Hey%20I'm%20contacting%20you%20to%20talk%20about%20your%20${encodeURIComponent(body.title)}`;

    // Prepare product data
    const productData = {
      ...body,
      whatsapp_link,
      is_coupon: body.is_coupon || false,
      is_sold: false,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 