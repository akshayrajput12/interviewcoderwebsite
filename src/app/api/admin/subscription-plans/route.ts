import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Helper function to check if user is admin
async function isAdmin(supabase: any) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return false;
  }
  
  // Check if user has admin role
  const { data, error } = await supabase.rpc('is_admin', {
    user_id: session.user.id
  });
  
  if (error || !data) {
    return false;
  }
  
  return data;
}

// Get all subscription plans
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Check if user is admin
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get all subscription plans, including inactive ones
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly', { ascending: true });
    
    if (error) {
      console.error('Error fetching subscription plans:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get subscription statistics
    const { data: stats, error: statsError } = await supabase
      .from('admin_subscription_stats')
      .select('*');
    
    if (statsError) {
      console.error('Error fetching subscription stats:', statsError);
    }
    
    return NextResponse.json({
      plans,
      stats: stats || []
    });
  } catch (error) {
    console.error('Error in admin subscription plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new subscription plan
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Check if user is admin
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const planData = await request.json();
    
    // Validate required fields
    if (!planData.name || !planData.tag || planData.price_monthly === undefined || planData.credits_per_month === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new subscription plan
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert({
        ...planData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscription plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Log admin action
    await supabase.rpc('log_admin_action', {
      action: 'create_subscription_plan',
      entity: 'subscription_plans',
      entity_id: data.id.toString(),
      details: planData
    });
    
    return NextResponse.json({ plan: data });
  } catch (error) {
    console.error('Error in admin create subscription plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update a subscription plan
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // Check if user is admin
    const admin = await isAdmin(supabase);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const { planId, planData } = await request.json();
    
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }
    
    // Update subscription plan
    const { data, error } = await supabase
      .from('subscription_plans')
      .update({
        ...planData,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating subscription plan:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Log admin action
    await supabase.rpc('log_admin_action', {
      action: 'update_subscription_plan',
      entity: 'subscription_plans',
      entity_id: planId.toString(),
      details: planData
    });
    
    return NextResponse.json({ plan: data });
  } catch (error) {
    console.error('Error in admin update subscription plan API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}