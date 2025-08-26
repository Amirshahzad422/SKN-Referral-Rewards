'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hardcoded admin credentials for testing
      if (formData.email === 'engineeramirshahzad11@gmail.com' && formData.password === '123456789') {
        // Set admin flag in localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', formData.email);
        
        // Simulate successful login and redirect to main dashboard
        setTimeout(() => {
          router.push('/'); // Redirect to main dashboard instead of admin
        }, 1000);
        return;
      }

      // For other users, use the actual login function
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to main dashboard for all users
        router.push('/');
      } else {
        if (result.error === 'Appwrite not configured') {
          setError('System is not configured. Please contact administrator.');
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-60 left-1/3 w-5 h-5 bg-emerald-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-80 right-20 w-2 h-2 bg-pink-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 left-1/4 w-3 h-3 bg-cyan-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-72 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Stars */}
        <div className="absolute top-16 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-48 right-16 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute top-56 left-1/5 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute top-84 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
        <div className="absolute top-28 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-76 right-2/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-44 left-1/6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.8s' }}></div>
        <div className="absolute top-92 right-1/6 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2.1s' }}></div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-gray-800 to-transparent transform rotate-12 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-gradient-to-t from-gray-700 to-transparent transform -rotate-6 origin-bottom-left"></div>
        <div className="absolute bottom-0 left-40 w-24 h-24 bg-gradient-to-t from-gray-800 to-transparent transform rotate-3 origin-bottom-left"></div>
        <div className="absolute bottom-0 right-40 w-36 h-36 bg-gradient-to-t from-gray-700 to-transparent transform -rotate-12 origin-bottom-right"></div>
        <div className="absolute bottom-0 right-20 w-28 h-28 bg-gradient-to-t from-gray-800 to-transparent transform rotate-6 origin-bottom-right"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-t from-gray-700 to-transparent transform -rotate-3 origin-bottom-right"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header Section - Changed to gradient */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-8 text-center relative">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full"></div>
            </div>
            
            {/* Logo Circle */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full blur-sm opacity-50"></div>
            </div>
            
            {/* Brand Text */}
            <div className="text-white relative z-10">
              <h1 className="text-2xl font-bold tracking-wider mb-2">SALES PRO</h1>
              <div className="flex items-center justify-center">
                <div className="w-12 h-px bg-white opacity-60"></div>
                <span className="text-sm tracking-wider mx-3 font-medium">NETWORK</span>
                <div className="w-12 h-px bg-white opacity-60"></div>
              </div>
            </div>
          </div>

          {/* White Form Section */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Password Field with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold tracking-wider hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>

              {/* Reset Password Link */}
              <div className="text-center">
                <a
                  href="#"
                  className="text-gray-500 text-sm hover:text-purple-600 transition-colors duration-200 font-medium"
                >
                  RESET PASSWORD
                </a>
              </div>

              {/* Admin Credentials Hint (for development) */}
              <div className="text-center text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Admin Credentials (for testing):</p>
                <p>Email: engineeramirshahzad11@gmail.com</p>
                <p>Password: 123456789</p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: 'engineeramirshahzad11@gmail.com',
                      password: '123456789'
                    });
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Fill Admin Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 