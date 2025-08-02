'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaymentButton from '@/components/payment/PaymentButton';

type Plan = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  period: string;
  annualBilling?: string;
  features: string[];
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
  popular: boolean;
  highlight_text?: string;
  credits: number;
  credits_per_month: number;
  price_monthly: number;
  price_yearly?: number;
  billing_cycle: string;
};

export default function PricingCards() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        
        const data = await response.json();
        setPlans(data.plans);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // Fallback to static plans if API fails but no error is thrown
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No pricing plans available at the moment. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-3 md:gap-5">
      {plans.map((plan, index) => {
        // Determine pricing display
        const displayPrice = plan.price_monthly === 0 ? 'Free' : `₹${plan.price_monthly}`;
        const displayPeriod = plan.price_monthly === 0 ? '' :
                             plan.tag === 'One-Time Pro' ? ' one-time' : '/month';
        const yearlyPrice = plan.price_yearly || (plan.price_monthly * 12);

        return (
        <motion.div
          key={`${plan.id}-${plan.tag}`}
          className={`bg-[#111111] border rounded-lg p-6 relative ${
            plan.popular ? 'border-yellow-400 shadow-lg shadow-yellow-400/10' : 'border-gray-800'
          }`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          {plan.popular && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {!plan.popular && index === 2 && (
            <div className="absolute top-4 right-4">
              <div className="text-yellow-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-base font-medium text-white flex items-center gap-2">
              {plan.name}
              <span className={plan.popular ? "text-yellow-400" : "text-gray-400"}>
                {plan.tag}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
          </div>

          <div className="mb-4">
            <div className="text-4xl font-bold text-white flex items-baseline">
              {displayPrice}
              <span className="text-xs font-normal text-gray-400 ml-1">{displayPeriod}</span>
            </div>

            {/* Special messaging for different plans */}
            {plan.price_monthly === 49 && plan.tag === 'One-Time Pro' && (
              <div className="text-sm text-green-400 mt-1">
                One-time purchase only
              </div>
            )}
            {plan.price_monthly === 999 && (
              <div className="text-sm text-blue-400 mt-1">
                Billed annually (₹{yearlyPrice}/year)
              </div>
            )}
            {plan.price_monthly === 1499 && (
              <div className="text-sm text-gray-500 mt-1">
                Monthly billing
              </div>
            )}

            {plan.highlight_text && (
              <div className="mt-1 bg-yellow-400/10 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded-full inline-block">
                {plan.highlight_text}
              </div>
            )}
          </div>

          {/* Credits section - only for paid plans */}
          {plan.credits_per_month > 0 && (
            <div className="mb-4 bg-gray-800/50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Credits</span>
                <span className="text-base font-bold text-white">
                  {plan.credits_per_month}
                  <span className="text-xs text-gray-400 ml-1">
                    {plan.tag === 'One-Time Pro' ? ' one-time' : '/ month'}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: plan.popular ? '75%' : '50%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          )}

          <ul className="space-y-2 mb-6">
            {(() => {
              // Safely parse features
              let features: string[] = [];
              try {
                if (Array.isArray(plan.features)) {
                  features = plan.features;
                } else if (typeof plan.features === 'string') {
                  features = JSON.parse(plan.features);
                } else {
                  features = [];
                }
              } catch (error) {
                console.error('Error parsing features for plan:', plan.name, error);
                features = [];
              }

              return features.map((feature: string, featureIndex: number) => (
                <li key={featureIndex} className="flex items-center text-gray-300 text-xs">
                  <span className={`mr-2 ${plan.credits_per_month === 0 && featureIndex < 2 ? 'text-gray-400' : 'text-green-400'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {typeof feature === 'string' ? feature : String(feature)}
                </li>
              ));
            })()}
          </ul>

          <PaymentButton
            plan={plan}
            buttonText={plan.buttonText}
            buttonStyle={plan.buttonStyle}
          />
          </motion.div>
        );
      })}
    </div>
  );
}