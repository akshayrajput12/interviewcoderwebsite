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

// Get admin dashboard data
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
    
    // Get user statistics
    const { data: userStats, error: userStatsError } = await supabase
      .from('admin_user_stats')
      .select('*')
      .single();
    
    if (userStatsError) {
      console.error('Error fetching user stats:', userStatsError);
    }
    
    // Get subscription statistics
    const { data: subscriptionStats, error: subscriptionStatsError } = await supabase
      .from('admin_subscription_stats')
      .select('*');
    
    if (subscriptionStatsError) {
      console.error('Error fetching subscription stats:', subscriptionStatsError);
    }
    
    // Get recent activity
    const { data: recentActivity, error: recentActivityError } = await supabase
      .from('admin_recent_activity')
      .select('*');
    
    if (recentActivityError) {
      console.error('Error fetching recent activity:', recentActivityError);
    }
    
    // Get recent feedback
    const { data: recentFeedback, error: recentFeedbackError } = await supabase
      .from('user_feedback')
      .select(`
        *,
        profile:profile_id(email)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentFeedbackError) {
      console.error('Error fetching recent feedback:', recentFeedbackError);
    }
    
    // Get admin notifications
    const { data: notifications, error: notificationsError } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
    }
    
    // Get app settings
    const { data: appSettings, error: appSettingsError } = await supabase
      .from('app_settings')
      .select('*');
    
    if (appSettingsError) {
      console.error('Error fetching app settings:', appSettingsError);
    }
    
    // Calculate revenue metrics
    const totalRevenue = userStats?.total_revenue || 0;
    const activeSubscribers = userStats?.active_subscribers || 0;
    const arpu = activeSubscribers > 0 ? totalRevenue / activeSubscribers : 0;
    
    // Calculate interview metrics
    const { data: interviewStats, error: interviewStatsError } = await supabase
      .from('interview_sessions')
      .select('id', { count: 'exact' });
    
    const totalInterviews = interviewStats?.count || 0;
    
    // Calculate credit usage
    const { data: creditUsage, error: creditUsageError } = await supabase
      .from('credit_transactions')
      .select('amount')
      .eq('transaction_type', 'debit');
    
    const totalCreditsUsed = creditUsage?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
    
    return NextResponse.json({
      userStats: {
        ...userStats,
        arpu: parseFloat(arpu.toFixed(2))
      },
      subscriptionStats: subscriptionStats || [],
      recentActivity: recentActivity || [],
      recentFeedback: recentFeedback || [],
      notifications: notifications || [],
      appSettings: appSettings || [],
      metrics: {
        totalRevenue,
        totalInterviews,
        totalCreditsUsed,
        activeSubscribers
      }
    });
  } catch (error) {
    console.error('Error in admin dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}