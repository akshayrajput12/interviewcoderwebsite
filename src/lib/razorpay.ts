import Razorpay from 'razorpay';

// Server-side Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Client-side Razorpay configuration
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  name: 'GhostCoder',
  description: 'Subscription Plan',
  image: '/logo.png', // Add your logo here
  theme: {
    color: '#F8E71C'
  }
};

// Razorpay order creation options
export interface RazorpayOrderOptions {
  amount: number; // Amount in paise (multiply by 100)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

// Razorpay payment verification
export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Subscription plan interface
export interface SubscriptionPlan {
  id: number;
  name: string;
  price_monthly: number;
  price_yearly?: number;
  credits_per_month: number;
  max_interviews_per_month: number;
  features: string[];
  is_popular?: boolean;
}

// Payment success response
export interface PaymentSuccessResponse {
  success: boolean;
  orderId: string;
  paymentId: string;
  signature: string;
  planId: number;
  amount: number;
}
