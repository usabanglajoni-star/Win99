'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Transaction } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchTransactions = async () => {
      if (token) {
        try {
          const data = await api.transactions.getAll(token);
          setTransactions(data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [isAuthenticated, token, router]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-300 text-sm font-medium">Loding hochhe...</div>
        </div>
      </div>
    );
  }

  // Filter and search transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType !== 'all' && transaction.type !== filterType) {
      return false;
    }

    if (filterStatus !== 'all' && transaction.status !== filterStatus) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchDescription = transaction.description?.toLowerCase().includes(query);
      const matchAmount = transaction.amount.toString().includes(query);
      const matchType = transaction.type.toLowerCase().includes(query);
      return matchDescription || matchAmount || matchType;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const vipLevelColors: Record<string, string> = {
    bronze: 'from-amber-700 to-amber-900 border-amber-600/40',
    silver: 'from-slate-600 to-slate-800 border-slate-500/40',
    gold: 'from-amber-400 to-yellow-600 border-yellow-300/40 text-black',
    platinum: 'from-purple-600 to-indigo-900 border-purple-500/40',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-8 px-4 font-sans selection:bg-green-500 selection:text-black">
      <div className="container mx-auto max-w-7xl">
        {/* Top Header / Nav Bar */}
        <div className="flex justify-between items-center bg-[#12141a] p-4 rounded-2xl border border-gray-800/80 mb-8 shadow-lg">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-500 text-black px-4 py-1.5 rounded-full font-black text-lg tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <span className="text-black">WIN</span>99
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:inline">স্বাগতম, <strong className="text-white">{user.firstName || user.username}</strong></span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold border border-red-800/50 rounded-xl transition-all flex items-center gap-1"
            >
              🚪 লগআউট
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400 mb-2">
            স্বাগতম, {user.firstName || user.username}! 🎰
          </h1>
          <p className="text-gray-400 text-sm">আপনার অ্যাকাউন্ট পরিচালনা করুন এবং গেইমিং অ্যাক্টিভিটি দেখুন</p>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-emerald-900/60 via-green-950/80 to-[#12141a] border border-green-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">মেন ব্যালেন্স</span>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-3xl font-black text-white">৳ {user.balance.toFixed(2)}</div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
          </div>

          {/* Bonus Balance Card */}
          <div className="bg-gradient-to-br from-amber-900/50 via-amber-950/80 to-[#12141a] border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">বোনাস ব্যালেন্স</span>
              <span className="text-2xl">🎁</span>
            </div>
            <div className="text-3xl font-black text-white">৳ {user.bonusBalance.toFixed(2)}</div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl"></div>
          </div>

          {/* VIP Level Card */}
          <div className={`bg-gradient-to-br ${vipLevelColors[user.vipLevel] || 'from-gray-800 to-gray-900 border-gray-700'} border rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">ভিআইপি লেভেল</span>
              <span className="text-2xl">👑</span>
            </div>
            <div className="text-3xl font-black capitalize">{user.vipLevel}</div>
          </div>

          {/* KYC Status Card */}
          <div className={`bg-gradient-to-br ${user.kycStatus === 'verified' ? 'from-blue-950/80 to-[#12141a] border-blue-500/40' : 'from-gray-900 to-[#12141a] border-gray-800'} border rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">KYC অবস্থা</span>
              <span className="text-2xl">
                {user.kycStatus === 'verified' ? '✅' : user.kycStatus === 'pending' ? '⏳' : '❌'}
              </span>
            </div>
            <div className="text-2xl font-black capitalize text-white">{user.kycStatus === 'verified' ? 'ভেরিফায়েড' : user.kycStatus === 'pending' ? 'পেন্ডিং' : 'আনভেরিফায়েড'}</div>
          </div>
        </div>

        {/* Quick Actions Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚡</span> দ্রুত সার্ভিস
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
            <h3 className="text-white font-bold text-xs">ডিপোজিট</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">টাকা জমা দিন</p>
          </Link>

          <Link
            href="/withdraw"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              💸
            </div>
            <h3 className="text-white font-bold text-xs">উইথড্র</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">টাকা তুলুন</p>
          </Link>

          <Link
            href="/favorites"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-red-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ❤️
            </div>
            <h3 className="text-white font-bold text-xs">পছন্দের গেম</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">প্রিয় লিস্ট</p>
          </Link>

          <Link
            href="/promotions"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-yellow-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🎉
            </div>
            <h3 className="text-white font-bold text-xs">প্রমোশন</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">বোনাস অফার</p>
          </Link>

          <Link
            href="/kyc"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              📄
            </div>
            <h3 className="text-white font-bold text-xs">ভেরিফিকেশন</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">KYC তথ্য জমা দিন</p>
          </Link>

          <Link
            href="/settings"
            className="bg-[#12141a] border border-gray-800/80 hover:border-green-500/50 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-purple-500/10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <h3 className="text-white font-bold text-xs">সেটিংস</h3>
            <p className="text-gray-500 text-[10px] mt-0.5">সিকিউরিটি ও প্রোফাইল</p>
          </Link>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-[#12141a] border border-gray-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              📊 লেনদেন ইতিহাস (Transactions)
            </h2>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">টাইপ অনুযায়ী ফিল্টার</label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-[#1a1d26] border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-green-500 transition-all"
              >
                <option value="all">সব টাইপ (All Types)</option>
                <option value="deposit">ডিপোজিট (Deposit)</option>
                <option value="withdrawal">উইথড্র (Withdrawal)</option>
                <option value="bet">বেট (Bet)</option>
                <option value="win">জয়ী (Win)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">অবস্থা অনুযায়ী ফিল্টার</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-[#1a1d26] border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-green-500 transition-all"
              >
                <option value="all">সব স্ট্যাটাস (All Statuses)</option>
                <option value="completed">সফল (Completed)</option>
                <option value="pending">পেন্ডিং (Pending)</option>
                <option value="failed">ব্যর্থ (Failed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">সার্চ করুন</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="খুঁজুন..."
                className="w-full px-3.5 py-2.5 bg-[#1a1d26] border border-gray-800 rounded-xl text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-xs text-gray-400 mb-4 font-medium">
            মোট {filteredTransactions.length}-টির মধ্যে {paginatedTransactions.length}-টি দেখাচ্ছে
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-400 text-sm">
                {transactions.length === 0 
                  ? 'এখনও কোনো লেনদেন হয়নি'
                  : 'ফিল্টারের সাথে কোনো লেনদেন মিলেনি'}
              </p>
              {transactions.length === 0 && (
                <Link href="/deposit" className="text-green-400 hover:text-green-300 font-bold text-xs mt-3 inline-block underline">
                  প্রথম ডিপোজিট করুন →
                </Link>
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-4 font-semibold">টাইপ</th>
                      <th className="py-3 px-4 font-semibold">পরিমাণ</th>
                      <th className="py-3 px-4 font-semibold">স্ট্যাটাস</th>
                      <th className="py-3 px-4 font-semibold">তারিখ</th>
                      <th className="py-3 px-4 font-semibold">বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 text-xs">
                    {paginatedTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-[#1a1d26]/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold capitalize">
                          <span className={`${
                            transaction.type === 'deposit' ? 'text-green-400' :
                            transaction.type === 'withdrawal' ? 'text-blue-400' :
                            transaction.type === 'win' ? 'text-amber-400' :
                            'text-red-400'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-white">
                          ৳ {transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            transaction.status === 'completed' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                            transaction.status === 'pending' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                            transaction.status === 'failed' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                            'bg-gray-500/10 border border-gray-500/30 text-gray-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400">
                          {transaction.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-800/80">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-[#1a1d26] border border-gray-800 text-gray-300 rounded-xl text-xs hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← আগেরটি
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          currentPage === page
                            ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                            : 'bg-[#1a1d26] border border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-[#1a1d26] border border-gray-800 text-gray-300 rounded-xl text-xs hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    পরেরটি →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
