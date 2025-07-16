import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Test database connection by fetching subscription plans
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true);

    if (plansError) {
      console.error('Plans error:', plansError);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: plansError,
      }, { status: 500 });
    }

    // Test session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    return NextResponse.json({
      success: true,
      data: {
        plans_count: plans?.length || 0,
        plans: plans,
        session_exists: !!session,
        user_email: session?.user?.email,
        session_error: sessionError,
      },
    });
  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
