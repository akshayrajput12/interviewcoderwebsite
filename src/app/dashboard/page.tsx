'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '../home/home-components/Header';
import Footer from '../home/home-components/Footer';

interface UserProfile {
  email?: string;
  full_name?: string;
  subscription_plan?: string;
  subscription_status?: string;
  subscription_end_date?: string;
  total_credits?: number;
  used_credits?: number;
  remaining_credits?: number;
  interviews_this_month?: number;
  subscription_plan_id?: number;
}

interface Transaction {
  created_at: string;
  transaction_type: string;
  amount: number;
  description: string;
  balance_after: number;
}

interface Interview {
  problem_title?: string;
  status: string;
  interview_type: string;
  start_time: string;
  credits_used: number;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Redirect if not logged in - but only after loading is complete
  useEffect(() => {
    if (!loading && !user) {
      console.log('Dashboard: No user found after loading, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);

  // Fetch user profile and related data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/profile');
          
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          
          const data = await response.json();
          setProfile(data.profile);
          setRecentTransactions(data.recentTransactions || []);
          setRecentInterviews(data.recentInterviews || []);
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to basic profile
          setProfile({
            email: user.email,
            subscription_plan_id: 1,
            subscription_status: 'inactive',
            total_credits: 0,
            used_credits: 0,
            remaining_credits: 0
          });
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Show loading state while auth is loading or user is not yet available
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
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
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white">Redirecting...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state while profile is loading
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          {/* Credit Status Card */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-black">Credits</h2>
              <span className="text-sm bg-black bg-opacity-20 px-3 py-1 rounded-full text-black">
                {profile?.subscription_plan || 'Free'} Plan
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-black">{profile?.remaining_credits || 0}</span>
              <span className="text-sm text-black">remaining credits</span>
            </div>
            <div className="w-full bg-black bg-opacity-20 rounded-full h-2.5 mb-1">
              <div 
                className="bg-black h-2.5 rounded-full" 
                style={{
                  width: `${profile?.total_credits ? ((profile?.used_credits || 0) / profile.total_credits) * 100 : 0}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-black">
              <span>Used: {profile?.used_credits || 0}</span>
              <span>Total: {profile?.total_credits || 0}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-white mb-3">Account Information</h2>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-500">Email:</span> {profile?.email}</p>
                <p><span className="text-gray-500">Name:</span> {profile?.full_name || 'Not set'}</p>
                <p><span className="text-gray-500">Subscription:</span> {profile?.subscription_plan || 'Free'}</p>
                <p><span className="text-gray-500">Status:</span> {profile?.subscription_status || 'Inactive'}</p>
                {profile?.subscription_end_date && (
                  <p><span className="text-gray-500">Renews:</span> {new Date(profile.subscription_end_date).toLocaleDateString()}</p>
                )}
                <p><span className="text-gray-500">Interviews:</span> {profile?.interviews_this_month || 0} / 5 this month</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors">
                  Practice Interview
                </button>
                <button className="bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition-colors">
                  View History
                </button>
                <button className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors">
                  Upgrade Plan
                </button>
                <button className="bg-yellow-600 text-white p-3 rounded-md hover:bg-yellow-700 transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Recent Credit Transactions</h2>
            {recentTransactions && recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="px-4 py-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.transaction_type === 'credit' ? 'bg-green-900 text-green-300' : 
                            transaction.transaction_type === 'debit' ? 'bg-red-900 text-red-300' : 
                            'bg-blue-900 text-blue-300'
                          }`}>
                            {transaction.transaction_type}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {transaction.transaction_type === 'credit' ? '+' : '-'}{transaction.amount}
                        </td>
                        <td className="px-4 py-2">{transaction.description}</td>
                        <td className="px-4 py-2">{transaction.balance_after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                No recent transactions
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Practice Sessions</h2>
          {recentInterviews && recentInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recentInterviews.map((interview, index) => (
                <div key={index} className="bg-gray-800 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{interview.problem_title || 'Interview Session'}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      interview.status === 'completed' ? 'bg-green-900 text-green-300' : 
                      interview.status === 'abandoned' ? 'bg-red-900 text-red-300' : 
                      'bg-yellow-900 text-yellow-300'
                    }`}>
                      {interview.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    <p>Type: {interview.interview_type}</p>
                    <p>Date: {new Date(interview.start_time).toLocaleDateString()}</p>
                    <p>Credits used: {interview.credits_used}</p>
                  </div>
                  <button className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-md p-4 text-center text-gray-400">
              No recent practice sessions. Start a new interview to begin practicing!
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}