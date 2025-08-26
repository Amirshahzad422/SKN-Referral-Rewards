'use client';

import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

export const useAuth = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
        console.warn('Appwrite environment variables not configured');
        setUser(null);
        setLoading(false);
        return;
      }

      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.log('No active session found');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
        return { success: false, error: 'Appwrite not configured' };
      }

      const session = await account.createEmailSession(email, password);
      await checkUser();
      return { success: true, session };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
        setUser(null);
        return { success: true };
      }

      await account.deleteSessions();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Logout failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
        return { success: false, error: 'Appwrite not configured' };
      }

      const user = await account.create('unique()', email, password, name);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    checkUser,
  };
}; 