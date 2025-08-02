import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase';
import { razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay configuration missing');
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 });
    }

    // Initialize Supabase client with cookies
    const supabase = await createServerSupabaseClient();

    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, billingCycle } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    console.log('Creating order for plan:', planId, 'billing cycle:', billingCycle || 'auto-determined');

    // Fetch the subscription plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError) {
      console.error('Plan fetch error:', planError);
      return NextResponse.json({ error: 'Database error fetching plan' }, { status: 500 });
    }

    if (!plan) {
      console.error('Plan not found:', planId);
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    console.log('Found plan:', plan.name, 'Price:', plan.price_monthly);

    // Check if this is a one-time pro plan and user has already purchased it
    if (plan.tag === 'One-Time Pro') {
      const { data: canPurchase, error: checkError } = await supabase.rpc('can_purchase_one_time_pro', {
        p_user_id: session.user.id
      });

      if (checkError) {
        console.error('Error checking one-time pro eligibility:', checkError);
        return NextResponse.json({ error: 'Failed to check purchase eligibility' }, { status: 500 });
      }

      if (!canPurchase) {
        return NextResponse.json({
          error: 'You have already purchased the one-time pro upgrade. This offer is limited to one purchase per user.'
        }, { status: 400 });
      }
    }

    // Determine billing cycle and amount based on plan
    let amount: number;
    let description: string;
    let actualBillingCycle: string;

    if (plan.price_monthly === 49 && plan.tag === 'One-Time Pro') {
      // One-time pro plan - 49 rupees one-time payment
      actualBillingCycle = 'one-time';
      amount = plan.price_monthly * 100; // Convert to paise
      description = `${plan.name} - One-time upgrade with 5 credits`;
    } else if (plan.price_monthly === 999) {
      // 999/month plan - always bill yearly
      actualBillingCycle = 'yearly';
      const yearlyPrice = plan.price_yearly || (plan.price_monthly * 12);
      amount = yearlyPrice * 100; // Convert to paise
      description = `${plan.name} - Annual Subscription (₹${plan.price_monthly}/month billed annually)`;
    } else if (plan.price_monthly === 1499) {
      // 1499 plan - always bill monthly
      actualBillingCycle = 'monthly';
      amount = plan.price_monthly * 100; // Convert to paise
      description = `${plan.name} - Monthly Subscription`;
    } else {
      // Other plans - use the provided billing cycle (fallback)
      actualBillingCycle = billingCycle || 'monthly';
      if (actualBillingCycle === 'yearly' && plan.price_yearly) {
        amount = plan.price_yearly * 100;
        description = `${plan.name} - Annual Subscription`;
      } else {
        amount = plan.price_monthly * 100;
        description = `${plan.name} - Monthly Subscription`;
      }
    }

    // Don't create payment for free plans
    if (amount === 0) {
      return NextResponse.json({ error: 'Cannot create payment for free plan' }, { status: 400 });
    }

    console.log('Creating Razorpay order with amount:', amount, 'paise (₹' + (amount/100) + ')');

    // Generate unique receipt ID (max 40 characters for Razorpay)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const userIdShort = session.user.id.slice(-8); // Last 8 characters of user ID
    const receipt = `rcpt_${userIdShort}_${planId}_${timestamp}`;

    console.log('Receipt details:', {
      userIdShort,
      planId,
      timestamp,
      receipt,
      receiptLength: receipt.length
    });

    if (receipt.length > 40) {
      console.error('Receipt too long:', receipt.length, 'characters');
      return NextResponse.json({ error: 'Receipt ID too long' }, { status: 400 });
    }

    // Create Razorpay order
    const orderOptions = {
      amount,
      currency: 'INR',
      receipt,
      notes: {
        user_id: session.user.id,
        plan_id: planId.toString(),
        billing_cycle: billingCycle || 'monthly',
        user_email: session.user.email || '',
      },
    };

    console.log('Razorpay order options:', orderOptions);

    const order = await razorpay.orders.create(orderOptions);

    console.log('Razorpay order created:', order.id);

    // Store order details in database for verification later
    const { error: orderInsertError } = await supabase
      .from('payment_orders')
      .insert({
        order_id: order.id,
        user_id: session.user.id,
        plan_id: planId,
        amount: amount / 100, // Store in rupees
        currency: 'INR',
        billing_cycle: actualBillingCycle,
        status: 'created',
        razorpay_order_data: order,
        created_at: new Date().toISOString(),
      });

    if (orderInsertError) {
      console.error('Error storing order:', orderInsertError);
      // Continue anyway, as the order was created successfully
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        description,
      },
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
      },
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
