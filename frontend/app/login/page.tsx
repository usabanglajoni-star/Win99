'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanUsername = formData.username.toLowerCase().trim();
      const formattedEmail = `${cleanUsername}@win99.com`;

      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: formData.password,
      });

      if (supabaseError) {
        setError('ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে!');
      } else if (data?.user) {
        router.push('/dashboard');
      } else {
        setError('লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
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
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-start pt-4 px-4 pb-12 font-sans selection:bg-green-500 selection:text-black">
      {/* Header / Logo */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 px-2">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white text-xl transition-all">
          ✕
        </button>
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-500 text-black px-4 py-1.5 rounded-full font-black text-lg tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <span className="text-black">WIN</span>99
        </div>
      </div>

      {/* Website Category & Gaming Badges */}
      <div className="w-full max-w-md mb-5 text-center">
        <div className="flex justify-center items-center gap-2 flex-wrap mb-2">
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            🎰 লাইভ ক্যাসিনো
          </span>
          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            ⚽ স্পোর্টস বেটিং
          </span>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            🃏 স্লট গেম
          </span>
        </div>
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-950/80 via-emerald-900/40 to-green-950/80 border border-green-500/30 rounded-2xl p-3 shadow-lg shadow-green-900/20">
          <p className="text-xs text-green-400 font-semibold uppercase tracking-widest">পুনরায় স্বাগতম</p>
          <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400">
            আপনার অ্যাকাউন্টে লগইন করুন 🔑
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#12141a] rounded-3xl p-6 border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800/80 pb-3">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            লগইন করুন
          </h1>
          <span className="text-xs text-gray-500 bg-gray-900 px-2.5 py-1 rounded-md border border-gray-800">
            অফিশিয়াল পোর্টাল
          </span>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-500/60 text-red-300 text-xs p-3 rounded-xl mb-4 text-center font-medium shadow-inner">
            🚨 {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <label className="text-[11px] text-gray-400 ml-1 mb-1 block font-medium">ব্যবহারকারী নাম (Username)</label>
            <div className="flex items-center gap-3 bg-[#1a1d26] px-3.5 py-2.5 rounded-xl border border-gray-800 focus-within:border-green-500 transition-all">
              <span className="text-gray-400 text-base">👤</span>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="যেমন: joni99"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-600 text-sm font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-[11px] text-gray-400 ml-1 mb-1 block font-medium">পাসওয়ার্ড</label>
            <div className="flex items-center gap-3 bg-[#1a1d26] px-3.5 py-2.5 rounded-xl border border-gray-800 focus-within:border-green-500 transition-all">
              <span className="text-gray-400 text-base">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-600 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white text-xs"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-500 text-black font-black text-base rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] disabled:opacity-40 uppercase tracking-wider"
          >
            {isLoading ? 'প্রসেসিং হচ্ছে...' : 'লগইন করুন 🚀'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-gray-800/80 text-xs text-gray-400 flex justify-between items-center">
          <div>
            অ্যাকোউন্ট নেই?{' '}
            <Link href="/register" className="text-green-400 hover:text-green-300 font-bold underline ml-1">
              নিবন্ধন করুন
            </Link>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-green-400 bg-green-950/40 hover:bg-green-900/60 px-3 py-1.5 rounded-full border border-green-800/50 transition-all font-semibold"
          >
            🎧 লাইভ সাপোর্ট
          </a>
        </div>
      </div>
    </div>
  );
}
