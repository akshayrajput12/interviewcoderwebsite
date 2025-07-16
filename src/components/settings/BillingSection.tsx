'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PaymentButton from '@/components/payment/PaymentButton';

interface BillingSectionProps {
  profile: any;
  onProfileUpdate: () => void;
}

export default function BillingSection({ profile, onProfileUpdate }: BillingSectionProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const currentPlan = profile?.subscription_plan || plans.find(p => p.id === 1); // Default to free plan

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>
        
        {/* Current Plan */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Current Plan</h3>
            <span className={`text-white text-xs px-3 py-1 rounded-full font-medium ${
              profile?.subscription_status === 'active' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              {profile?.subscription_status === 'active' ? 'ACTIVE' : 'FREE'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Plan</p>
              <p className="text-white font-medium">
                {currentPlan?.name || 'Free Plan'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Credits</p>
              <p className="text-yellow-400 font-medium">
                {profile?.remaining_credits || 0} / {profile?.total_credits || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {profile?.subscription_status === 'active' ? 'Expires' : 'Status'}
              </p>
              <p className="text-white">
                {profile?.subscription_end_date 
                  ? new Date(profile.subscription_end_date).toLocaleDateString()
                  : 'No expiration'
                }
              </p>
            </div>
          </div>

          {/* Usage Progress */}
          {profile?.total_credits > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Credit Usage</span>
                <span className="text-gray-400">
                  {((profile.total_credits - profile.remaining_credits) / profile.total_credits * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((profile.total_credits - profile.remaining_credits) / profile.total_credits * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Billing Cycle Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h3 className="text-lg font-medium mb-4">Available Plans</h3>
          
          {loading ? (
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan?.id === plan.id;
                const price = billingCycle === 'yearly' && plan.price_yearly 
                  ? plan.price_yearly 
                  : plan.price_monthly;
                const originalPrice = billingCycle === 'yearly' 
                  ? plan.price_monthly * 12 
                  : plan.price_monthly;
                
                return (
                  <motion.div
                    key={plan.id}
                    className={`bg-[#1a1a1a] rounded-lg p-6 border-2 transition-colors ${
                      isCurrentPlan 
                        ? 'border-yellow-400' 
                        : plan.is_popular 
                        ? 'border-blue-500' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-4">
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {plan.name}
                      </h4>
                      <p className="text-gray-400 text-sm">{plan.tag}</p>
                      
                      {/* Price */}
                      <div className="mt-4">
                        {plan.price_monthly === 0 ? (
                          <div className="text-2xl font-bold text-white">Free</div>
                        ) : (
                          <div>
                            <div className="text-2xl font-bold text-white">
                              ₹{price}
                              <span className="text-sm font-normal text-gray-400">
                                /{billingCycle === 'yearly' ? 'year' : 'month'}
                              </span>
                            </div>
                            {billingCycle === 'yearly' && plan.price_yearly && (
                              <div className="text-sm text-green-400">
                                Save ₹{originalPrice - plan.price_yearly} yearly
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      <div className="text-sm text-gray-300">
                        <span className="font-medium text-yellow-400">
                          {plan.credits_per_month}
                        </span> credits per month
                      </div>
                      <div className="text-sm text-gray-300">
                        Up to <span className="font-medium">
                          {plan.max_interviews_per_month}
                        </span> interviews
                      </div>
                      
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-1 mt-3">
                          {plan.features.slice(0, 3).map((feature: string, index: number) => (
                            <div key={index} className="flex items-center text-sm text-gray-300">
                              <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div>
                      {isCurrentPlan ? (
                        <div className="w-full py-2 text-center text-gray-400 border border-gray-600 rounded-lg">
                          Current Plan
                        </div>
                      ) : plan.price_monthly === 0 ? (
                        <div className="w-full py-2 text-center text-gray-400 border border-gray-600 rounded-lg">
                          Free Plan
                        </div>
                      ) : (
                        <PaymentButton
                          plan={plan}
                          buttonText="Upgrade"
                          buttonStyle={plan.is_popular ? 'primary' : 'secondary'}
                          billingCycle={billingCycle}
                          onSuccess={onProfileUpdate}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
