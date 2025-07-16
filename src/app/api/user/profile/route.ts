import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';

export async function GET(request: Request) {
  try {
    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user's profile with subscription plan details
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        subscription_plan:subscription_plan_id (
          name,
          description,
          price_monthly,
          price_yearly,
          credits_per_month,
          max_interviews_per_month,
          features
        )
      `)
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get recent credit transactions
    const { data: recentTransactions, error: transactionsError } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
    }

    // Get recent interview sessions
    const { data: recentInterviews, error: interviewsError } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (interviewsError) {
      console.error('Error fetching interviews:', interviewsError);
    }

    return NextResponse.json({ 
      profile,
      recentTransactions: recentTransactions || [],
      recentInterviews: recentInterviews || []
    });
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user profile
export async function PUT(request: Request) {
  try {
    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the profile data from the request
    const profileData = await request.json();
    
    // Fields that users are allowed to update
    const allowedFields = [
      'full_name',
      'avatar_url',
      'bio',
      'job_title',
      'company',
      'website',
      'github_username',
      'linkedin_username',
      'preferred_language',
      'preferred_interview_type',
      'experience_level'
    ];
    
    // Filter out any fields that aren't allowed
    const filteredData = Object.keys(profileData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {} as Record<string, any>);
    
    // Add updated_at timestamp
    filteredData.updated_at = new Date().toISOString();
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update(filteredData)
      .eq('id', session.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Error in profile update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}