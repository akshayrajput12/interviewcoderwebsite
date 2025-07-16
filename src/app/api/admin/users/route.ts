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

// Get all users with pagination and filtering
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
    
    // Get URL parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const filter = url.searchParams.get('filter') || '';
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabase
      .from('profiles')
      .select(`
        *,
        role:role_id(name),
        subscription_plan:subscription_plan_id(name, tag)
      `, { count: 'exact' });
    
    // Apply search if provided
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }
    
    // Apply filter if provided
    if (filter === 'active_subscribers') {
      query = query.eq('subscription_status', 'active');
    } else if (filter === 'free_users') {
      query = query.eq('subscription_plan_id', 1);
    } else if (filter === 'admins') {
      query = query.eq('role_id', 1);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data: users, error, count } = await query;
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get user statistics
    const { data: stats, error: statsError } = await supabase
      .from('admin_user_stats')
      .select('*')
      .single();
    
    if (statsError) {
      console.error('Error fetching user stats:', statsError);
    }
    
    return NextResponse.json({
      users,
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      stats
    });
  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user details (admin only)
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
    
    const { userId, userData } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Update user profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Log admin action
    await supabase.rpc('log_admin_action', {
      action: 'update_user',
      entity: 'profiles',
      entity_id: userId,
      details: userData
    });
    
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error in admin update user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add credits to a user (admin only)
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
    
    const { action, userEmail, data: actionData } = await request.json();
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }
    
    if (action === 'add_credits') {
      const { amount, reason } = actionData;
      
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Valid credit amount is required' }, { status: 400 });
      }
      
      // Add credits to user
      const { data, error } = await supabase.rpc('add_user_credits', {
        user_email: userEmail,
        credit_amount: amount,
        reason: reason || 'Admin credit adjustment'
      });
      
      if (error || !data) {
        console.error('Error adding credits:', error);
        return NextResponse.json({ error: error?.message || 'Failed to add credits' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: `Added ${amount} credits to ${userEmail}` });
    } 
    else if (action === 'promote_to_admin') {
      // Promote user to admin
      const { data, error } = await supabase.rpc('promote_to_admin', {
        user_email: userEmail
      });
      
      if (error || !data) {
        console.error('Error promoting user:', error);
        return NextResponse.json({ error: error?.message || 'Failed to promote user' }, { status: 500 });
      }
      
      return NextResponse.json({ success: true, message: `Promoted ${userEmail} to admin` });
    }
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in admin action API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}