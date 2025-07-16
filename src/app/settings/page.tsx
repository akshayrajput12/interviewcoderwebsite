'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/app/home/home-components/Header';
import Footer from '@/app/home/home-components/Footer';
import BillingSection from '@/components/settings/BillingSection';
import CreditsSection from '@/components/settings/CreditsSection';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    console.log('Settings page - Auth loading:', authLoading, 'User:', !!user, user?.email);
    if (!authLoading && !user) {
      console.log('Redirecting to login from settings page');
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch user profile data
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not loading but no user, let the useEffect handle the redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-20">
          <div className="text-white">Redirecting...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-[#1a1a1a] rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'account'
                      ? 'bg-[#333] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                  }`}
                >
                  Account
                </button>
                {/* Only show billing tab for paid users */}
                {profile?.subscription_status === 'active' && (
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'billing'
                        ? 'bg-[#333] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Billing
                  </button>
                )}
                {/* Only show credits tab for paid users */}
                {profile?.subscription_status === 'active' && (
                  <button
                    onClick={() => setActiveTab('credits')}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === 'credits'
                        ? 'bg-[#333] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                  >
                    Credits
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* User Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black font-semibold text-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </h1>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'account' && (
                <div className="space-y-8">
                  {/* Current Plan Status */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-medium ${
                        profile?.subscription_status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`}>
                        {profile?.subscription_status === 'active' ? 'ACTIVE' : 'FREE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Plan</p>
                        <p className="text-white font-medium">
                          {profile?.subscription_plan?.name || 'Free Plan'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Credits</p>
                        <p className="text-yellow-400 font-medium">
                          {profile?.subscription_status === 'active'
                            ? `${profile?.remaining_credits || 0} / ${profile?.total_credits || 0}`
                            : 'No credits available'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Upgrade Button for Free Users */}
                    {profile?.subscription_status !== 'active' && (
                      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-yellow-400 font-medium mb-1">Upgrade to Premium</h4>
                            <p className="text-gray-300 text-sm">Get unlimited credits and premium features</p>
                          </div>
                          <button
                            onClick={() => router.push('/home#pricing')}
                            className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                          >
                            Upgrade Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-6">Account Details</h2>

                    <div className="space-y-6">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <div className="bg-[#2a2a2a] rounded-lg px-4 py-3 text-gray-300">
                          {user?.email}
                        </div>
                      </div>

                      {/* Change Password */}
                      <div>
                        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Change Password
                        </button>
                      </div>

                      {/* Delete Account */}
                      <div className="pt-4 border-t border-gray-700">
                        <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && profile?.subscription_status === 'active' && (
                <BillingSection
                  profile={profile}
                  onProfileUpdate={fetchProfile}
                />
              )}

              {activeTab === 'credits' && profile?.subscription_status === 'active' && (
                <CreditsSection profile={profile} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
