'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  userGrowth: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
  creditUsage: {
    totalUsed: number;
    thisMonth: number;
    lastMonth: number;
    percentChange: number;
  };
  subscriptions: {
    free: number;
    monthly: number;
    yearly: number;
    revenue: number;
  };
  dailyStats: Array<{
    date: string;
    newUsers: number;
    creditsUsed: number;
    revenue: number;
  }>;
  topUsers: Array<{
    email: string;
    creditsUsed: number;
    subscriptionPlan: string;
  }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowTrendingUpIcon className="h-5 w-5 text-green-400" />
    ) : (
      <ArrowTrendingDownIcon className="h-5 w-5 text-red-400" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">Comprehensive insights into your platform&apos;s performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {analytics && [
          {
            name: 'Total Users',
            value: analytics.userGrowth.total,
            change: analytics.userGrowth.percentChange,
            icon: UsersIcon,
            color: 'bg-blue-500',
          },
          {
            name: 'Monthly Growth',
            value: analytics.userGrowth.thisMonth,
            change: analytics.userGrowth.percentChange,
            icon: ArrowTrendingUpIcon,
            color: 'bg-green-500',
          },
          {
            name: 'Credits Used',
            value: analytics.creditUsage.totalUsed,
            change: analytics.creditUsage.percentChange,
            icon: CreditCardIcon,
            color: 'bg-yellow-500',
          },
          {
            name: 'Revenue',
            value: `₹${analytics.subscriptions.revenue.toLocaleString()}`,
            change: 15.2, // Mock data
            icon: ChartBarIcon,
            color: 'bg-purple-500',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${metric.color} p-3 rounded-md`}>
                    <metric.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">{metric.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-medium text-white">
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(metric.change)}`}>
                        {getChangeIcon(metric.change)}
                        <span className="ml-1">{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg leading-6 font-medium text-white mb-4">User Growth Trend</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </motion.div>

        {/* Credit Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 shadow rounded-lg p-6"
        >
          <h3 className="text-lg leading-6 font-medium text-white mb-4">Credit Usage Pattern</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
            <div className="text-center">
              <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Daily/Weekly credit consumption trends</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subscription Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 shadow rounded-lg p-6"
      >
        <h3 className="text-lg leading-6 font-medium text-white mb-4">Subscription Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analytics && [
            { name: 'Free Users', count: analytics.subscriptions.free, color: 'bg-gray-500' },
            { name: 'Monthly Subscribers', count: analytics.subscriptions.monthly, color: 'bg-blue-500' },
            { name: 'Yearly Subscribers', count: analytics.subscriptions.yearly, color: 'bg-green-500' },
          ].map((sub) => (
            <div key={sub.name} className="text-center">
              <div className={`${sub.color} h-2 rounded-full mb-2`} />
              <div className="text-2xl font-bold text-white">{sub.count}</div>
              <div className="text-sm text-gray-400">{sub.name}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">Top Credit Users</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-700">
              {analytics?.topUsers?.slice(0, 5).map((user, index) => (
                <li key={user.email} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                          <span className="text-sm font-medium text-black">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <p className="text-sm text-gray-400">{user.subscriptionPlan} plan</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {user.creditsUsed} credits
                    </div>
                  </div>
                </li>
              )) || (
                <li className="py-4">
                  <p className="text-sm text-gray-400">No data available</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-800 shadow rounded-lg p-6"
      >
        <h3 className="text-lg leading-6 font-medium text-white mb-4">Daily Activity Summary</h3>
        <div className="space-y-4">
          {analytics?.dailyStats?.slice(0, 7).map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-white">
                  {new Date(day.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-blue-400">
                  <span className="font-medium">{day.newUsers}</span> new users
                </div>
                <div className="text-yellow-400">
                  <span className="font-medium">{day.creditsUsed}</span> credits used
                </div>
                <div className="text-green-400">
                  <span className="font-medium">₹{day.revenue}</span> revenue
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-400 py-8">
              No daily statistics available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
