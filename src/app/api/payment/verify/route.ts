import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ 
        error: 'Missing required payment parameters' 
      }, { status: 400 });
    }

    // Verify the payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ 
        error: 'Invalid payment signature' 
      }, { status: 400 });
    }

    // Get the order details from database
    const { data: order, error: orderError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('order_id', razorpay_order_id)
      .eq('user_id', session.user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({ 
        error: 'Payment already processed' 
      }, { status: 400 });
    }

    // Get the subscription plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', order.plan_id)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ 
        error: 'Plan not found' 
      }, { status: 404 });
    }

    // Check if this is a one-time pro plan
    if (plan.tag === 'One-Time Pro') {
      // Handle one-time pro purchase
      const { error: oneTimeProError } = await supabase.rpc('process_one_time_pro_upgrade', {
        p_user_id: session.user.id,
        p_order_id: razorpay_order_id,
        p_payment_id: razorpay_payment_id,
        p_signature: razorpay_signature
      });

      if (oneTimeProError) {
        console.error('One-time pro upgrade error:', oneTimeProError);
        return NextResponse.json({
          error: oneTimeProError.message || 'Failed to process one-time pro upgrade'
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'One-time Pro upgrade successful',
        upgrade: {
          plan_name: plan.name,
          credits_added: plan.credits_per_month,
          purchase_date: new Date().toISOString(),
        },
      });
    }

    // Calculate subscription dates for regular plans
    const now = new Date();
    const startDate = now;
    let endDate: Date;

    if (order.billing_cycle === 'yearly') {
      endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    // Start a transaction to update multiple tables (using monthly credit system)
    const { error: transactionError } = await supabase.rpc('process_successful_payment', {
      p_user_id: session.user.id,
      p_order_id: razorpay_order_id,
      p_payment_id: razorpay_payment_id,
      p_signature: razorpay_signature,
      p_plan_id: order.plan_id,
      p_billing_cycle: order.billing_cycle,
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
      p_credits_per_month: plan.credits_per_month // Monthly credits only
    });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      
      // Fallback: Update tables individually
      try {
        // Update payment order status
        await supabase
          .from('payment_orders')
          .update({
            status: 'paid',
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
            paid_at: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('order_id', razorpay_order_id);

        // Calculate next reset date
        const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

        // Update user profile with new subscription (monthly credit system)
        await supabase
          .from('profiles')
          .update({
            subscription_plan_id: order.plan_id,
            subscription_status: 'active',
            subscription_start_date: startDate.toISOString(),
            subscription_end_date: endDate.toISOString(),
            billing_cycle: order.billing_cycle,
            monthly_credit_limit: plan.credits_per_month,
            current_month_credits: plan.credits_per_month,
            current_month_used: 0,
            credit_reset_date: nextResetDate.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('id', session.user.id);

        // Add credit transaction record
        const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM format
        await supabase
          .from('credit_transactions')
          .insert({
            profile_id: session.user.id,
            transaction_type: 'credit',
            amount: plan.credits_per_month,
            description: `Subscription activated - Monthly credits (${order.billing_cycle} plan)`,
            month_year: currentMonth,
            credits_after: plan.credits_per_month,
            created_at: now.toISOString(),
          });

      } catch (fallbackError) {
        console.error('Fallback update error:', fallbackError);
        return NextResponse.json({ 
          error: 'Payment verified but failed to update subscription' 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        plan_name: plan.name,
        billing_cycle: order.billing_cycle,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        credits_added: plan.credits_per_month,
      },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
