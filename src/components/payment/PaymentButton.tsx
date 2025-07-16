'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface PaymentButtonProps {
  plan: any; // Using any for now since the plan structure comes from the API
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
  billingCycle?: 'monthly' | 'yearly';
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({
  plan,
  buttonText,
  buttonStyle,
  billingCycle = 'monthly',
  onSuccess
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    // Check if user is authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Free plan - no payment needed
    if (plan.price_monthly === 0) {
      // Handle free plan activation
      try {
        setLoading(true);
        // You can add free plan activation logic here
        router.push('/dashboard');
      } catch (error) {
        console.error('Error activating free plan:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);

    try {
      // Don't allow payment for free plans
      if (plan.price_monthly === 0 && billingCycle === 'monthly') {
        console.error('Cannot create payment for free plan');
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          // Let backend determine billing cycle based on plan
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Interview Coder',
        description: orderData.plan.description,
        order_id: orderData.order.id,
        prefill: {
          name: orderData.user.name,
          email: orderData.user.email,
        },
        theme: {
          color: '#F8E71C',
        },
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            // Call onSuccess callback if provided
            if (onSuccess) {
              onSuccess();
            }

            // Show success message and redirect
            alert('Payment successful! Your subscription has been activated.');
            router.push('/dashboard');
            
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full font-medium px-4 py-2 text-sm rounded-md transition-colors flex items-center justify-center ${
        buttonStyle === 'primary'
          ? 'bg-yellow-400 text-black hover:bg-yellow-500 disabled:bg-yellow-600'
          : 'bg-transparent text-white border border-gray-700 hover:bg-gray-800 disabled:bg-gray-900'
      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          {buttonText}
          <svg className="ml-2" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </>
      )}
    </motion.button>
  );
}
