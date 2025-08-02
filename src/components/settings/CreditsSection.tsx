'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UserProfile {
  email?: string;
  full_name?: string;
  subscription_plan?: {
    name?: string;
  };
  subscription_status?: string;
  subscription_end_date?: string;
  total_credits?: number;
  used_credits?: number;
  remaining_credits?: number;
  subscription_plan_id?: number;
}

interface CreditsSectionProps {
  profile: UserProfile;
}

interface CreditTransaction {
  id: number;
  amount: number;
  transaction_type: 'credit' | 'debit' | 'reset' | 'bonus';
  description: string;
  balance_after: number;
  created_at: string;
}

export default function CreditsSection({ profile }: CreditsSectionProps) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch credit transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/user/credits?page=${page}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          if (page === 1) {
            setTransactions(data.transactions || []);
          } else {
            setTransactions(prev => [...prev, ...(data.transactions || [])]);
          }
          setHasMore(data.hasMore || false);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'debit':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case 'bonus':
        return (
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'credit':
        return 'Added';
      case 'debit':
        return 'Used';
      case 'bonus':
        return 'Bonus';
      case 'reset':
        return 'Reset';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Credits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-[#1a1a1a] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Credits</p>
              <p className="text-2xl font-bold text-white">
                {profile?.total_credits || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-[#1a1a1a] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Remaining</p>
              <p className="text-2xl font-bold text-yellow-400">
                {profile?.remaining_credits || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-[#1a1a1a] rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Used</p>
              <p className="text-2xl font-bold text-red-400">
                {profile?.used_credits || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Progress */}
      {profile?.total_credits && profile.total_credits > 0 && (
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Credit Usage</h3>
            <span className="text-sm text-gray-400">
              {(((profile.total_credits - (profile.remaining_credits || 0)) / profile.total_credits) * 100).toFixed(1)}% used
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(((profile.total_credits - (profile.remaining_credits || 0)) / profile.total_credits * 100), 100)}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0</span>
            <span>{profile.total_credits || 0}</span>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Transaction History</h3>
        
        {loading && transactions.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.transaction_type)}
                  <div>
                    <p className="text-white font-medium">
                      {formatTransactionType(transaction.transaction_type)} {Math.abs(transaction.amount)} credits
                    </p>
                    <p className="text-gray-400 text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.transaction_type === 'credit' || transaction.transaction_type === 'bonus'
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {transaction.transaction_type === 'credit' || transaction.transaction_type === 'bonus' ? '+' : '-'}
                    {Math.abs(transaction.amount)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Balance: {transaction.balance_after}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
