import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { is_sold } = body;

    if (typeof is_sold !== 'boolean') {
      return NextResponse.json(
        { error: 'is_sold must be a boolean value' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .update({ is_sold })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/products/[id]/sold:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 