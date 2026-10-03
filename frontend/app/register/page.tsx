'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

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

  // ইউজারনেমে স্পেস আছে কিনা চেক
  const hasSpaceInUsername = /\s/.test(formData.username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (hasSpaceInUsername) {
      setError('ইউজারনেমে কোনো স্পেস দেওয়া যাবে না।');
      return;
    }

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
      const cleanUsername = formData.username.toLowerCase().trim();
      const formattedEmail = `${cleanUsername}@win99.com`;

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
            🎰 Live Casino
          </span>
          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            ⚽ Sports Betting
          </span>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            🃏 Slots
          </span>
        </div>
        
        {/* Welcome Bonus Banner */}
        <div className="bg-gradient-to-r from-green-950/80 via-emerald-900/40 to-green-950/80 border border-green-500/30 rounded-2xl p-3 shadow-lg shadow-green-900/20">
          <p className="text-xs text-green-400 font-semibold uppercase tracking-widest">নতুন প্লেয়ার অফার</p>
          <p className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400">
            ১০০% ওয়েলকাম বোনাস পান 🎁
          </p>
        </div>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-md bg-[#12141a] rounded-3xl p-6 border border-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800/80 pb-3">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            নিবন্ধন করুন
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
            <div className={`flex items-center gap-3 bg-[#1a1d26] px-3.5 py-2.5 rounded-xl border transition-all ${
              hasSpaceInUsername ? 'border-red-500/80 bg-red-950/10' : 'border-gray-800 focus-within:border-green-500'
            }`}>
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
            {hasSpaceInUsername && (
              <p className="text-red-400 text-[11px] mt-1.5 ml-1 flex items-center gap-1 font-semibold">
                ⚠️ ইউজারনেমে কোনো স্পেস (Space) দেওয়া যাবে না!
              </p>
            )}
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

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-[11px] text-gray-400 ml-1 mb-1 block font-medium">পাসওয়ার্ড নিশ্চিত করুন</label>
            <div className="flex items-center gap-3 bg-[#1a1d26] px-3.5 py-2.5 rounded-xl border border-gray-800 focus-within:border-green-500 transition-all">
              <span className="text-gray-400 text-base">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-600 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-white text-xs"
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="text-[11px] text-gray-400 ml-1 mb-1 block font-medium">মোবাইল নম্বর</label>
            <div className="flex items-center gap-2 bg-[#1a1d26] px-3.5 py-2.5 rounded-xl border border-gray-800 focus-within:border-green-500 transition-all">
              <span className="text-green-500 text-xs font-bold bg-green-950/80 px-2 py-0.5 rounded border border-green-800/40">
                +880
              </span>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="17XXXXXXXX"
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-600 text-sm font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || hasSpaceInUsername}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-500 text-black font-black text-base rounded-xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.3)] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isLoading ? 'প্রসেসিং হচ্ছে...' : 'নিবন্ধন করুন 🚀'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-gray-800/80 text-xs text-gray-400 flex justify-between items-center">
          <div>
            অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="text-green-400 hover:text-green-300 font-bold underline ml-1">
              লগইন
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
