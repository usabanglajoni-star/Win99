'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between font-sans selection:bg-green-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="w-full bg-[#12141a]/90 backdrop-blur-md border-b border-gray-800/80 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-500 text-black px-4 py-1.5 rounded-full font-black text-lg tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <span className="text-black">WIN</span>99
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-green-400 font-bold text-xs rounded-xl transition-all"
          >
            লগইন
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-green-600/30"
          >
            নিবন্ধন
          </Link>
        </div>
      </nav>

      {/* Main Banner / Welcome Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-md mx-auto w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-green-500/10 to-emerald-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6 animate-pulse">
          🎉 ওয়েলকাম বোনাস অফার
        </div>

        {/* Big Offer Banner Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400 leading-tight mb-3">
          ৫০০ টাকা জমার ওপর <br />
          <span className="text-green-400">১০০% বোনাস!</span>
        </h1>

        <p className="text-amber-300 font-extrabold text-lg mb-2">
          🎁 ৫০০৳ জমার সাথে ৫০০৳ ফ্রি বোনাস!
        </p>

        <p className="text-gray-400 text-xs font-medium mb-8">
          + প্রথম ডিপোজিটে ১০০টি ফ্রি স্পিন সম্পূর্ণ ফ্রিতে পান! 🎰
        </p>

        {/* Call to Action Buttons */}
        <div className="w-full space-y-3 mb-8">
          <Link
            href="/register"
            className="w-full block py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-500 text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] uppercase tracking-wider"
          >
            এখনই বোনাস দাবি করুন 🎁
          </Link>

          <Link
            href="/login"
            className="w-full block py-3.5 bg-[#12141a] hover:bg-[#1a1d26] border border-gray-800 text-white font-bold text-sm rounded-2xl transition-all"
          >
            আমার অ্যাকাউন্ট আছে (লগইন) 🔑
          </Link>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-[#12141a] border border-gray-800/80 p-3 rounded-2xl flex items-center gap-2 text-left">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-xs font-bold text-white">ইনস্ট্যান্ট ডিপোজিট</p>
              <p className="text-[10px] text-gray-500">বিকাশ / নগদ / রকেট</p>
            </div>
          </div>

          <div className="bg-[#12141a] border border-gray-800/80 p-3 rounded-2xl flex items-center gap-2 text-left">
            <span className="text-xl">🎰</span>
            <div>
              <p className="text-xs font-bold text-white">১০০০+ গেম</p>
              <p className="text-[10px] text-gray-500">স্লট ও লাইভ ক্যাসিনো</p>
            </div>
          </div>

          <div className="bg-[#12141a] border border-gray-800/80 p-3 rounded-2xl flex items-center gap-2 text-left">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-xs font-bold text-white">১০০% নিরাপদ</p>
              <p className="text-[10px] text-gray-500">দ্রুত ও সুরক্ষিত লেনদেন</p>
            </div>
          </div>

          <div className="bg-[#12141a] border border-gray-800/80 p-3 rounded-2xl flex items-center gap-2 text-left">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs font-bold text-white">ভিআইপি রিওয়ার্ড</p>
              <p className="text-[10px] text-gray-500">প্রতিদিনের বিশেষ ক্যাশব্যাক</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="w-full py-4 border-t border-gray-800/60 bg-[#0a0a0c] text-center text-[11px] text-gray-500">
        <p>🔞 খেলার জন্য অবশ্যই ১৮+ হতে হবে। দায়িত্বশীলভাবে খেলুন।</p>
      </footer>
    </div>
  );
}
