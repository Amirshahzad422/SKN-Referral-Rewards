'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, we'll use username as email since the form shows username
      // In a real app, you might want to validate if it's an email or username
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Redirect to admin dashboard if admin, otherwise to main dashboard
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-80 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-72 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-96 left-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-24 right-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute top-64 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-88 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '4.5s' }}></div>
        
        {/* More stars for density */}
        <div className="absolute top-16 left-1/3 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-48 right-16 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-56 left-1/5 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-84 right-1/3 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-28 left-2/3 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-76 right-2/3 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-44 left-1/6 w-0.5 h-0.5 bg-white rounded-full"></div>
        <div className="absolute top-92 right-1/6 w-0.5 h-0.5 bg-white rounded-full"></div>
      </div>

      {/* Rock Formations Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-900 transform rotate-12 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-16 w-24 h-24 bg-gray-800 transform -rotate-6 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-32 w-20 h-20 bg-gray-900 transform rotate-3 origin-bottom-left"></div>
        <div className="absolute bottom-0 right-32 w-28 h-28 bg-gray-800 transform -rotate-12 origin-bottom-right"></div>
        <div className="absolute bottom-0 right-16 w-20 h-20 bg-gray-900 transform rotate-6 origin-bottom-right"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-800 transform -rotate-3 origin-bottom-right"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Pink Header */}
          <div className="bg-pink-500 px-8 py-6 text-center">
            {/* Logo Circle */}
            <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-yellow-400 rounded-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-yellow-500 rounded-full transform rotate-45"></div>
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="text-white">
              <h1 className="text-xl font-bold tracking-wider">SALES PRO</h1>
              <div className="flex items-center justify-center mt-1">
                <div className="w-8 h-px bg-white"></div>
                <span className="text-xs tracking-wider mx-2">NETWORK</span>
                <div className="w-8 h-px bg-white"></div>
              </div>
            </div>
          </div>

          {/* White Form Section */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="User Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold tracking-wider hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              {/* Reset Password Link */}
              <div className="text-center">
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  RESET PASSWORD
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 