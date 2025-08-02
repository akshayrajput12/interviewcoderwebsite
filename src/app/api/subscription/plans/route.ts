import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Get all available subscription plans
export async function GET() {
  try {
    // Initialize Supabase client with cookies
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, any>) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: Record<string, any>) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get all active subscription plans
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });
      
    // Format the plans to match the frontend structure
    const formattedPlans = plans?.map(plan => ({
      ...plan,
      id: plan.id.toString(),
      price: plan.price_monthly,
      period: '/ month',
      annualBilling: plan.price_yearly ? `Billed annually (${plan.currency}${plan.price_yearly}/year)` : null,
      buttonText: plan.tag === 'One-Time Pro' ? 'Buy Once - ₹49' :
                  plan.price_monthly === 0 ? 'Get Started' : 'Subscribe',
      buttonStyle: plan.is_popular ? 'primary' : 'secondary',
      popular: plan.is_popular,
      credits: plan.tag === 'One-Time Pro' ? 5 : plan.credits_per_month, // Show 5 credits for one-time pro
      credits_per_month: plan.tag === 'One-Time Pro' ? 5 : plan.credits_per_month, // Override for one-time pro
      billing_cycle: plan.tag === 'One-Time Pro' ? 'one-time' :
                     plan.price_yearly ? 'yearly' : 'monthly',
      // Ensure features is always an array
      features: Array.isArray(plan.features) ? plan.features :
                typeof plan.features === 'string' ? JSON.parse(plan.features) : []
    }));

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the current user's subscription if they're logged in
    let currentPlan = null;
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          subscription_plan_id,
          subscription_status,
          subscription_plan:subscription_plan_id (*)
        `)
        .eq('id', session.user.id)
        .single();

      if (!profileError && profile) {
        currentPlan = {
          id: profile.subscription_plan_id,
          status: profile.subscription_status,
          details: profile.subscription_plan
        };
      }
    }

    return NextResponse.json({ 
      plans: formattedPlans || [],
      rawPlans: plans || [],
      currentPlan
    });
  } catch (error) {
    console.error('Error in subscription plans API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}