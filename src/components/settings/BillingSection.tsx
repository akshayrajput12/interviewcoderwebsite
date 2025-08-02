'use client';

interface UserProfile {
  email?: string;
  full_name?: string;
  subscription_plan?: {
    name?: string;
  };
  subscription_status?: string;
  subscription_end_date?: string;
  subscription_start_date?: string;
  total_credits?: number;
  used_credits?: number;
  remaining_credits?: number;
  subscription_plan_id?: number;
}

interface BillingSectionProps {
  profile: UserProfile;
  onProfileUpdate: () => void;
}

export default function BillingSection({ profile }: BillingSectionProps) {
  const currentPlan = profile?.subscription_plan;

  // Calculate next credit reset date (assuming monthly reset)
  const getNextResetDate = () => {
    if (!profile?.subscription_start_date) return 'N/A';

    const startDate = new Date(profile.subscription_start_date);
    const now = new Date();
    const nextReset = new Date(startDate);

    // Set to next month from start date
    nextReset.setMonth(startDate.getMonth() + Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) + 1);

    return nextReset.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-6">Billing & Subscription</h2>

        {/* Current Plan Details */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Current Plan Details</h3>
            <span className={`text-white text-xs px-3 py-1 rounded-full font-medium ${profile?.subscription_status === 'active' ? 'bg-green-500' : 'bg-gray-500'
              }`}>
              {profile?.subscription_status === 'active' ? 'ACTIVE' : 'FREE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Plan Name</p>
              <p className="text-white font-medium text-lg">
                {currentPlan?.name || 'Free Plan'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Monthly Credits</p>
              <p className="text-yellow-400 font-medium text-lg">
                {profile?.remaining_credits || 0} / {profile?.total_credits || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Next Credit Reset</p>
              <p className="text-white font-medium">
                {getNextResetDate()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">
                {profile?.subscription_status === 'active' ? 'Plan Expires' : 'Status'}
              </p>
              <p className="text-white font-medium">
                {profile?.subscription_end_date
                  ? new Date(profile.subscription_end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  : 'No expiration'
                }
              </p>
            </div>
          </div>

          {/* Usage Progress */}
          {profile?.total_credits && profile.total_credits > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Credit Usage This Month</span>
                <span className="text-gray-400">
                  {(((profile.total_credits - (profile.remaining_credits || 0)) / profile.total_credits) * 100).toFixed(0)}% used
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${((profile.total_credits - (profile.remaining_credits || 0)) / profile.total_credits) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{profile.total_credits - (profile.remaining_credits || 0)} credits used</span>
                <span>{profile.remaining_credits || 0} credits remaining</span>
              </div>
            </div>
          )}
        </div>

        {/* Customer Support */}
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Customer Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone Support</p>
                <a href="tel:+919653814628" className="text-white font-medium hover:text-yellow-400 transition-colors">
                  +91 9653814628
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Support</p>
                <a href="mailto:akshayrajput2616@gmail.com" className="text-white font-medium hover:text-yellow-400 transition-colors">
                  akshayrajput2616@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
