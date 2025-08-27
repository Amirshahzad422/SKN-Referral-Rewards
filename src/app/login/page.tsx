'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error || 'Login failed');
        return;
      }
      const redirectTo = searchParams.get('redirect') || '/';
      router.replace(redirectTo);
      // Refresh after redirect to ensure sidebar updates with role
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (e) {
      setServerError('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-xl overflow-hidden bg-white/95">
          {/* Header with image background (cover + center for equal top/bottom crop) */}
          <div className="relative h-40 bg-[url('/logo-bg.png')] bg-center bg-cover flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-xl shadow-gray-500/100 overflow-hidden">
              <Image src="/logo.jpeg" alt="Logo" width={112} height={112} className="rounded-full object-cover w-full h-full" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...form.register('email')}
                className={`w-full h-11 rounded-md border px-4 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  form.formState.errors.email ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...form.register('password')}
                className={`w-full h-11 rounded-md border px-4 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  form.formState.errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
              )}
            </div>

            {serverError && <div className="text-sm text-red-600">{serverError}</div>}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-11 rounded-md bg-gradient-to-b from-blue-500 to-blue-600 text-white font-semibold transition-colors disabled:opacity-60"
            >
              {form.formState.isSubmitting ? 'Logging in...' : 'LOGIN'}
            </button>

            <button
              type="button"
              className="w-full text-center text-sm text-blue-600 hover:text-blue-900"
              onClick={() => alert('Reset password coming soon')}
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 