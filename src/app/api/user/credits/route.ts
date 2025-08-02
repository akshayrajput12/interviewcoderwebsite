import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';

// Get credit transaction history
export async function GET(request: Request) {
  try {
    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // Get credit transactions with pagination
    const { data: transactions, error, count } = await supabase
      .from('credit_transactions')
      .select('*', { count: 'exact' })
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching credit transactions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get current credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_credits, used_credits, remaining_credits')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile credit info:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      transactions,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      creditBalance: {
        total: profile.total_credits,
        used: profile.used_credits,
        remaining: profile.remaining_credits
      }
    });
  } catch (error) {
    console.error('Error in credits API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Use credits for an action
export async function POST(request: Request) {
  try {
    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request data
    const { credits, description } = await request.json();
    
    if (!credits || credits <= 0) {
      return NextResponse.json({ error: 'Invalid credit amount' }, { status: 400 });
    }

    // Check if user has enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('remaining_credits')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (profile.remaining_credits < credits) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        remainingCredits: profile.remaining_credits,
        creditsNeeded: credits
      }, { status: 400 });
    }

    // Use the database function to use credits
    const { error } = await supabase.rpc(
      'use_credits',
      {
        user_id: session.user.id,
        credits_to_use: credits,
        description: description || 'Credit usage'
      }
    );

    if (error) {
      console.error('Error using credits:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get updated profile
    const { data: updatedProfile, error: updatedProfileError } = await supabase
      .from('profiles')
      .select('total_credits, used_credits, remaining_credits')
      .eq('id', session.user.id)
      .single();

    if (updatedProfileError) {
      console.error('Error fetching updated profile:', updatedProfileError);
    }

    return NextResponse.json({ 
      success: true,
      creditsUsed: credits,
      creditBalance: updatedProfile ? {
        total: updatedProfile.total_credits,
        used: updatedProfile.used_credits,
        remaining: updatedProfile.remaining_credits
      } : null
    });
  } catch (error) {
    console.error('Error in use credits API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}