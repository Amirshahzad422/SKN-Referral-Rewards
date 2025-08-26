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
      if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
        console.warn('Appwrite environment variables not configured');
        setUser(null);
        setLoading(false);
        return;
      }

      // Check if account object is properly initialized
      if (!account || typeof account.get !== 'function') {
        console.warn('Appwrite account service not properly initialized');
        setUser(null);
        setLoading(false);
        return;
      }

      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.log('No active session found or Appwrite not configured');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
        throw new Error('Appwrite not configured');
      }

      // Check if account object is properly initialized
      if (!account || typeof account.createEmailSession !== 'function') {
        throw new Error('Authentication service not available');
      }

      const session = await account.createEmailSession(email, password);
      await checkUser();
      return { success: true, session };
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Throw the error instead of returning it
    }
  };

  const logout = async () => {
    try {
      // Check if Appwrite is properly configured
      if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
        setUser(null);
        return { success: true };
      }

      // Check if account object is properly initialized
      if (!account || typeof account.deleteSessions !== 'function') {
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
      if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
        throw new Error('Appwrite not configured');
      }

      // Check if account object is properly initialized
      if (!account || typeof account.create !== 'function') {
        throw new Error('Registration service not available');
      }

      const user = await account.create('unique()', email, password, name);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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