import { NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase';

// This function will be used to create a profile when a user signs up
export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (existingProfile) {
      return NextResponse.json({ message: 'Profile already exists' });
    }
    
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId,
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Error in profile creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}