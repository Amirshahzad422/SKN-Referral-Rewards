'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is logged in (either real user or hardcoded admin)
      const isLoggedIn = user || localStorage.getItem('isAdmin') === 'true';
      
      if (!isLoggedIn) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Check if user is logged in
  const isLoggedIn = user || localStorage.getItem('isAdmin') === 'true';
  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  // Get user info for display
  const userEmail = user?.email || localStorage.getItem('adminEmail') || 'zohaibishfaq.ajk@gmail.com';
  const userName = user?.name || 'zohaib';
  const userPhone = user?.phone || '03367516504';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <nav className="text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Dashboard</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome {userName}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-lg">→</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdraw</p>
                <p className="text-2xl font-bold text-gray-900">$0.00</p>
              </div>
              <div className="p-2 bg-pink-100 rounded-lg">
                <span className="text-pink-600 text-lg">↓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Direct</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-lg">👤</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-orange-600 text-lg">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
            PRIVACY POLICY
          </button>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
            CONTACT US
          </button>
        </div>

        {/* User Status Indicator */}
        <div className="absolute top-6 right-6 flex flex-col items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-green-600 font-medium mt-1">Active</span>
        </div>
      </div>
    </div>
  );
}
