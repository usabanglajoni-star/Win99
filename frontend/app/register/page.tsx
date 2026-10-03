'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না');
      return;
    }

    if (formData.phone.length < 10) {
      setError('সঠিক মোবাইল নম্বর দিন');
      return;
    }

    setIsLoading(true);

    try {
      // Phone specific format for email requirement in Supabase Auth
      const formattedEmail = `${formData.username.toLowerCase().trim()}@win99.com`;

      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: formattedEmail,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            phone: `+880${formData.phone}`,
          },
        },
      });

      if (supabaseError) {
        setError(supabaseError.message);
      } else if (data?.user) {
        router.push('/login?registered=true');
      } else {
        setError('নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch {
      setError('একটি সমস্যা দেখা দিয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-6 px-4">
      {/* Header / Logo */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="text-white text-xl">
          ✕
        </button>
        <div className="flex items-center gap-1 bg-green-500 text-black px-3 py-1 rounded-full font-extrabold text-lg tracking-wider">
          <span className="text-white">WIN</span>99
        </div>
      </div>

      {/* Hero Wheel Icon Placeholder */}
      <div className="relative mb-6 flex justify-center">
        <div className="w-40 h-40 rounded-full border-4 border-green-500/30 flex items-center justify-center bg-gradient-to-b from-green-900/40 to-black shadow-[0_0_50px_rgba(34,197,94,0.3)]">
          <span className="text-6xl">🎰</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#121212] rounded-t-3xl p-6 border-t border-gray-800">
        <h1 className="text-2xl font-bold text-green-500 mb-6">নিবন্ধন</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative border-b border-gray-700 pb-1">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg">👤</span>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="ব্যবহারকারী নাম"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative border-b border-gray-700 pb-1">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm py-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 text-sm"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative border-b border-gray-700 pb-1">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-lg">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm py-1"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 text-sm"
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="relative border-b border-gray-700 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-semibold">+880</span>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="মোবাইল নম্বর"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm py-1"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-bold rounded-xl transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
          >
            {isLoading ? 'প্রসেসিং হচ্ছে...' : 'নিবন্ধন'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <span className="relative px-3 bg-[#121212] text-xs text-gray-500">
            অথবা চালিয়ে যান
          </span>
        </div>

        {/* Google Sign In Option */}
        <button
          type="button"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
        >
          <span className="font-extrabold text-base">G</span> Google
        </button>

        {/* Login Link */}
        <div className="mt-8 text-xs text-gray-400 flex justify-between items-center">
          <div>
            ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-green-500 underline font-semibold ml-1">
              লগইন
            </Link>
          </div>
          <a href="#" className="flex items-center gap-1 text-green-500 bg-green-950/60 px-3 py-1.5 rounded-full border border-green-800/50">
            🎧 সেবা
          </a>
        </div>
      </div>
    </div>
  );
}
