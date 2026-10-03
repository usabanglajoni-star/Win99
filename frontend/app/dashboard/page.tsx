'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Game {
  id: string;
  title: string;
  provider: string;
  slug?: string;
  launch_url?: string;
  thumbnail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('hot');
  const [jackpot, setJackpot] = useState(111560365.60);
  const [dbGames, setDbGames] = useState<Game[]>([]);

  // Live Jackpot Ticker Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot((prev) => prev + Math.random() * 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

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

    // Fetch live games from Supabase
    const fetchGames = async () => {
      const { data, error } = await supabase.from('games').select('*');
      if (!error && data) {
        setDbGames(data);
      }
    };
    fetchGames();

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

  // Safe game click launcher (Handles external vs internal routes)
  const handleGameClick = (launchUrl?: string, slug?: string) => {
    const targetUrl = launchUrl || `/games/${slug || 'mega-fortune'}`;
    
    if (targetUrl.startsWith('http')) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(targetUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-300 text-xs font-medium">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const username = user.email ? user.email.split('@')[0] : 'Jone ali';

  // Fallback games if database is empty
  const defaultGames = [
    { id: '1', title: 'সুপার এস', provider: 'JILI', slug: 'super-ace', image: '🎰', color: 'from-amber-500 to-red-600', launch_url: '/games/super-ace' },
    { id: '2', title: 'এভিয়েটর', provider: 'SPRIBE', slug: 'aviator', image: '✈️️', color: 'from-red-600 to-black', launch_url: '/games/aviator' },
    { id: '3', title: 'বন্য বাউন্ডারি', provider: 'PG', slug: 'showdown', image: '🤠', color: 'from-yellow-600 to-amber-800', launch_url: '/games/mega-fortune' },
    { id: '4', title: 'বক্সিং কিং', provider: 'JILI', slug: 'boxing-king', image: '🥊', color: 'from-red-700 to-blue-900', launch_url: '/games/mega-fortune' },
    { id: '5', title: 'সুপার এলিমেন্টস', provider: 'FC', slug: 'super-elements', image: '🐲', color: 'from-yellow-400 to-orange-600', launch_url: '/games/mega-fortune' },
    { id: '6', title: 'ফরচুন জেমস', provider: 'JILI', slug: 'fortune-gems', image: '💎', color: 'from-amber-400 to-yellow-600', launch_url: '/games/mega-fortune' },
  ];

  const categories = [
    { id: 'hot', name: 'গরম', icon: '🔥' },
    { id: 'slots', name: 'স্লট', icon: '🍒' },
    { id: 'live', name: 'লাইভ', icon: '👩‍💼' },
    { id: 'fishing', name: 'ফিশিং', icon: '🐟' },
    { id: 'poker', name: 'পোকার', icon: '🎴' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans pb-24 selection:bg-green-500 selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#121212] border-b border-gray-800/80 px-4 py-2.5 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-black px-3 py-1 rounded-full font-black text-lg tracking-wider flex items-center shadow-[0_0_12px_rgba(34,197,94,0.4)]">
            WIN<span className="text-white ml-0.5">99</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1c1c1c] border border-gray-800 px-3 py-1 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">👤</div>
            <div className="text-left">
              <p className="text-[10px] text-gray-400 font-medium leading-none capitalize">{username}</p>
              <p className="text-xs text-green-400 font-bold leading-tight mt-0.5">৳ 2.45</p>
            </div>
            <span className="text-gray-500 text-[10px] ml-1">👁️</span>
          </div>

          <button onClick={handleLogout} className="text-xs bg-red-950/40 border border-red-800/60 text-red-400 px-2.5 py-1.5 rounded-lg font-bold">
            🚪
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="px-3 pt-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-950 via-emerald-900 to-black p-4 border border-green-500/30 shadow-lg">
          <div className="relative z-10 max-w-[65%]">
            <span className="bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">মোবাইল অ্যাপ</span>
            <h2 className="text-base font-extrabold text-white mt-1 leading-tight">
              ডাউনলোড করুন <br /><span className="text-amber-300">বোনাস পান</span>
            </h2>
            <p className="text-2xl font-black text-amber-400 mt-1">৳ ৫৮</p>
          </div>
          <div className="absolute right-2 bottom-0 text-6xl opacity-80">📱</div>
        </div>

        <div className="mt-2 bg-[#161616] px-3 py-1.5 rounded-xl border border-gray-800 flex items-center gap-2 text-xs text-gray-300">
          <span className="text-amber-400 text-sm">📢</span>
          <p className="truncate text-[11px] text-gray-300 font-medium">স্বাগতম WIN99.COM - সেরা অনলাইন ক্যাসিনো ও স্পোর্টস বেটিং প্লাটফর্ম!</p>
        </div>
      </div>

      {/* Jackpot Section */}
      <div className="px-3 mt-3">
        <div className="bg-gradient-to-b from-[#1f1900] to-[#0f0e00] border border-amber-500/40 rounded-2xl p-3 text-center shadow-[0_0_15px_rgba(234,179,8,0.15)] relative overflow-hidden">
          <div className="flex justify-center items-center gap-1.5 mb-1">
            <span className="text-xl">👑</span>
            <span className="text-amber-400 font-black text-sm tracking-widest uppercase">JACKPOT</span>
          </div>
          <div className="bg-black/80 border border-amber-500/30 rounded-xl py-2 px-3 inline-block shadow-inner">
            <span className="text-2xl font-black text-green-400 tracking-wider font-mono">
              ৳ {jackpot.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-3 mt-4">
        <div className="grid grid-cols-5 gap-2 bg-[#161616] p-2 rounded-2xl border border-gray-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-b from-green-500 to-emerald-600 text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-[11px] font-bold">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="px-3 mt-3">
        <div className="grid grid-cols-4 gap-2 bg-[#121212] p-2 rounded-xl border border-gray-800 text-center">
          <Link href="/promotions" className="flex flex-col items-center py-1">
            <span className="text-lg">🎁</span>
            <span className="text-[10px] text-gray-300 font-medium mt-0.5">পুরস্কার</span>
          </Link>
          <Link href="/deposit" className="flex flex-col items-center py-1">
            <span className="text-lg">💳</span>
            <span className="text-[10px] text-gray-300 font-medium mt-0.5">ডিপোজিট</span>
          </Link>
          <Link href="/withdraw" className="flex flex-col items-center py-1">
            <span className="text-lg">💸</span>
            <span className="text-[10px] text-gray-300 font-medium mt-0.5">উত্তোলন</span>
          </Link>
          <a href="#" className="flex flex-col items-center py-1">
            <span className="text-lg">🎧</span>
            <span className="text-[10px] text-gray-300 font-medium mt-0.5">লাইভ চ্যাট</span>
          </a>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="px-3 mt-4">
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-black text-white flex items-center gap-1.5">
            <span className="text-green-400">🔥</span> জনপ্রিয় গেমসমূহ
          </h3>
          <span className="text-[10px] text-gray-400">সবগুলো দেখুন →</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {(dbGames.length > 0 ? dbGames : defaultGames).map((game: any) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.launch_url, game.slug)}
              className="bg-[#18181c] rounded-xl border border-gray-800/80 overflow-hidden shadow-md flex flex-col justify-between group hover:border-green-500/50 transition-all cursor-pointer active:scale-95"
            >
              <div className={`h-24 bg-gradient-to-br ${game.color || 'from-amber-500 to-red-600'} flex flex-col items-center justify-center p-2 relative`}>
                {game.thumbnail && game.thumbnail.startsWith('http') ? (
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl group-hover:scale-110 transition-transform">{game.image || '🎰'}</span>
                )}
                <span className="absolute top-1 right-1 bg-black/60 text-amber-400 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                  {game.provider}
                </span>
              </div>
              <div className="p-2 bg-[#121214]">
                <p className="text-[11px] font-extrabold text-white truncate">{game.title}</p>
                <p className="text-[9px] text-gray-500 truncate">{game.slug || game.provider}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Winners Feed */}
      <div className="px-3 mt-5">
        <div className="bg-[#141416] border border-gray-800 rounded-2xl p-3">
          <h4 className="text-xs font-extrabold text-amber-400 mb-2 flex items-center gap-1">
            🏆 সাম্প্রতিক বিজয়ীবৃন্দ
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-[#1a1a1e] p-2 rounded-xl border border-gray-800/50">
              <p className="text-gray-400">***ial <span className="text-green-400 font-bold ml-1">৳ 106,400.00</span></p>
              <p className="text-gray-500 text-[9px] mt-0.5">একমাত্র জিতেছেন • Shark Dance</p>
            </div>
            <div className="bg-[#1a1a1e] p-2 rounded-xl border border-gray-800/50">
              <p className="text-gray-400">***389 <span className="text-green-400 font-bold ml-1">৳ 73,040.00</span></p>
              <p className="text-gray-500 text-[9px] mt-0.5">একমাত্র জিতেছেন • এভিয়েটর</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Partners Logos */}
      <div className="px-3 mt-5">
        <div className="bg-[#141416] border border-gray-800 rounded-2xl p-3 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">পেমেন্ট পার্টনারস</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <span className="bg-pink-950/60 border border-pink-500/30 text-pink-400 text-xs font-black px-2.5 py-1 rounded-lg">bKash</span>
            <span className="bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-black px-2.5 py-1 rounded-lg">Nagad</span>
            <span className="bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-black px-2.5 py-1 rounded-lg">Rocket</span>
            <span className="bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-black px-2.5 py-1 rounded-lg">Upay</span>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-3 bottom-20 flex flex-col gap-2 z-40">
        <a href="#" className="w-10 h-10 bg-green-500 text-black rounded-full flex items-center justify-center shadow-lg font-bold text-lg">💬</a>
        <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg font-bold text-lg">✈️</a>
      </div>

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 px-4 py-2 z-50 flex justify-around items-center">
        <Link href="/dashboard" className="flex flex-col items-center text-green-400">
          <span className="text-lg">💎</span>
          <span className="text-[10px] font-bold mt-0.5">হোম</span>
        </Link>
        <Link href="/promotions" className="flex flex-col items-center text-gray-400 hover:text-white">
          <span className="text-lg">🎉</span>
          <span className="text-[10px] font-bold mt-0.5">প্রমোশন</span>
        </Link>
        <Link href="/invite" className="flex flex-col items-center text-gray-400 hover:text-white">
          <span className="text-lg">👥</span>
          <span className="text-[10px] font-bold mt-0.5">আমন্ত্রণ</span>
        </Link>
        <Link href="/deposit" className="flex flex-col items-center text-gray-400 hover:text-white">
          <span className="text-lg">💳</span>
          <span className="text-[10px] font-bold mt-0.5">ডিপোজিট</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-gray-400 hover:text-white">
          <span className="text-lg">👤</span>
          <span className="text-[10px] font-bold mt-0.5">সদস্য</span>
        </Link>
      </nav>
    </div>
  );
}
