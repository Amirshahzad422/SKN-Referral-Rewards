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

  // Check if user is admin
  const isAdmin = user?.email === 'engineeramirshahzad11@gmail.com' || localStorage.getItem('isAdmin') === 'true';
  const userEmail = user?.email || localStorage.getItem('adminEmail') || 'User';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userEmail}!</p>
          {isAdmin && (
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Admin Access
              </span>
              <span className="ml-2 text-sm text-gray-500">
                You can access admin features from the sidebar
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">Rs. 0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Withdraw</p>
                <p className="text-2xl font-bold text-gray-900">Rs. 0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Direct</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🌳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <span className="text-2xl mb-2 block">👤+</span>
              <span className="text-sm font-medium text-gray-700">Create Account</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <span className="text-2xl mb-2 block">🔢</span>
              <span className="text-sm font-medium text-gray-700">Buy Pin Code</span>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors">
              <span className="text-2xl mb-2 block">🌳</span>
              <span className="text-sm font-medium text-gray-700">View My Tree</span>
            </button>
          </div>
        </div>

        {/* Admin Notice */}
        {isAdmin && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Admin Access Available</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have admin privileges. Use the sidebar to access admin features like payment management and user creation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
