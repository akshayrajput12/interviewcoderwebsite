import { NextResponse } from 'next/server';
import { createServiceClient } from '@/utils/supabase';

// This webhook will be triggered by Supabase when a new user signs up
export async function POST(request: Request) {
  try {
    // Verify the webhook signature (in production, you should validate this)
    const payload = await request.json();
    
    // Handle user creation event
    if (payload.type === 'INSERT' && payload.table === 'auth.users') {
      const user = payload.record;
      const supabase = createServiceClient();
      
      // Create a profile for the new user
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
      
      if (error) {
        console.error('Error creating profile from webhook:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}