'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-300 text-sm font-medium">Loading hochhe...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const username = user.email ? user.email.split('@')[0] : 'User';

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-8 px-4 font-sans selection:bg-green-500 selection:text-black">
      <div className="container mx-auto max-w-7xl">
        {/* Top Header / Nav Bar */}
        <div className="flex justify-between items-center bg-[#12141a] p-4 rounded-2xl border border-gray-800/80 mb-8 shadow-lg">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-500 text-black px-4 py-1.5 rounded-full font-black text-lg tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-black">WIN</span>99
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">Swagotom, <strong className="text-white capitalize">{username}</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold border border-red-800/50 rounded-xl transition-all flex items-center gap-1"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400 mb-2 capitalize">
            Swagotom, {username}! 🎰
          </h1>
          <p className="text-gray-400 text-sm">Apanar account porichalona korun ebong gaming activity dekhun</p>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-emerald-900/60 via-green-950/80 to-[#12141a] border border-green-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Main Balance</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-black text-white">৳ 0.00</div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
          </div>

          {/* Bonus Balance Card */}
          <div className="bg-gradient-to-br from-amber-900/50 via-amber-950/80 to-[#12141a] border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Bonus Balance</span>
              <span className="text-2xl">🎁</span>
            </div>
            <div className="text-3xl font-black text-white">৳ 0.00</div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>
          </div>

          {/* VIP Level Card */}
          <div className="bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-600/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">VIP Level</span>
              <span className="text-2xl">👑</span>
            </div>
            <div className="text-3xl font-black capitalize">Bronze</div>
          </div>

          {/* KYC Status Card */}
          <div className="bg-gradient-to-br from-gray-900 to-[#12141a] border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">KYC Status</span>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="text-2xl font-black capitalize text-white">Unverified</div>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> Dhruto Service
          </h2>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <Link
            href="/deposit"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-green-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💳
            </div>
            <h3 className="text-white font-bold text-xs">Deposit</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">Taka joma din</p>
          </Link>

          <Link
            href="/withdraw"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💸
            </div>
            <h3 className="text-white font-bold text-xs">Withdraw</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">Taka tulun</p>
          </Link>

          <Link
            href="/favorites"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-red-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <h3 className="text-white font-bold text-xs">Favorite Games</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">Pochonder list</p>
          </Link>

          <Link
            href="/promotions"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-yellow-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🎉
            </div>
            <h3 className="text-white font-bold text-xs">Promotions</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">Bonus offer</p>
          </Link>

          <Link
            href="/kyc"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-white font-bold text-xs">Verification</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">KYC tathya din</p>
          </Link>

          <Link
            href="/settings"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <h3 className="text-white font-bold text-xs">Settings</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">Profile & Security</p>
          </Link>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-[#12141a] border border-gray-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📊 Lendhen Itihas (Transactions)
            </h2>
          </div>

          <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-400 text-sm">Ekhono kono lendhen hoyni</p>
            <Link href="/deposit" className="text-green-400 hover:text-green-300 font-bold text-xs mt-3 inline-block underline">
              Prothom Deposit Korun →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
