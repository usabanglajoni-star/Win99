'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '⭐️️', '💎', '7️⃣'];

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const gameSlug = params?.slug || 'super-ace';

  const [reels, setReels] = useState<string[]>(['💎', '7️⃣', '💎']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [message, setMessage] = useState('স্পিন বাটনে চাপ দিয়ে খেলা শুরু করুন!');

  const spinReels = () => {
    if (balance < 10) {
      setMessage('পর্যাপ্ত ব্যালেন্স নেই! ডেমো ব্যালেন্স শেষ।');
      return;
    }

    setSpinning(true);
    setWinAmount(0);
    setMessage('স্পিন হচ্ছে...');
    setBalance((prev) => prev - 10);

    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
      counter++;

      if (counter > 15) {
        clearInterval(interval);
        
        // Final outcome
        const finalR1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const finalR2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        const finalR3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        
        setReels([finalR1, finalR2, finalR3]);
        setSpinning(false);

        // Check Win Condition
        if (finalR1 === finalR2 && finalR2 === finalR3) {
          const win = 500;
          setWinAmount(win);
          setBalance((prev) => prev + win);
          setMessage('🎉 জেকপট! আপনি ৫০০ টাকা জিতেছেন!');
        } else if (finalR1 === finalR2 || finalR2 === finalR3 || finalR1 === finalR3) {
          const win = 50;
          setWinAmount(win);
          setBalance((prev) => prev + win);
          setMessage('✨ অভিনন্দন! আপনি ৫০ টাকা জিতেছেন!');
        } else {
          setMessage('ধন্যবাদ! আবার চেষ্টা করুন।');
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-between items-center p-4 selection:bg-amber-500">
      {/* Top Header Navigation */}
      <div className="w-full max-w-md flex justify-between items-center bg-[#15151e] p-3 rounded-2xl border border-gray-800 shadow-lg">
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all"
        >
          ← ড্যাশবোর্ড
        </button>
        <span className="text-amber-400 font-black text-sm uppercase tracking-wider">
          {gameSlug.toString().replace('-', ' ')} (Demo)
        </span>
        <div className="bg-green-950/80 border border-green-500/40 text-green-400 text-xs px-2.5 py-1 rounded-xl font-bold">
          ৳ {balance}
        </div>
      </div>

      {/* Main Casino Slot Machine Container */}
      <div className="w-full max-w-md my-auto my-6 bg-gradient-to-b from-[#1a1a26] via-[#12121a] to-[#0d0d12] border-2 border-amber-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase tracking-widest mb-1">
          WIN99 SLOT SIMULATOR
        </h2>
        <p className="text-[11px] text-gray-400 mb-6">প্রতি স্পিনে খরচ ৳ ১০</p>

        {/* Slot Reels Box */}
        <div className="bg-[#08080c] border-2 border-amber-500/30 rounded-2xl p-4 flex justify-around items-center shadow-inner mb-6 relative">
          {reels.map((symbol, i) => (
            <div 
              key={i} 
              className={`w-20 h-24 bg-gradient-to-b from-[#1c1c28] to-[#111118] border border-gray-700/80 rounded-xl flex items-center justify-center text-4xl shadow-md transition-all ${
                spinning ? 'scale-95 blur-[1px]' : 'scale-100'
              }`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Message and Status */}
        <div className="min-h-[40px] flex items-center justify-center mb-6">
          <p className={`text-xs font-extrabold ${winAmount > 0 ? 'text-green-400 animate-bounce' : 'text-amber-300'}`}>
            {message}
          </p>
        </div>

        {/* Spin Button */}
        <button
          onClick={spinReels}
          disabled={spinning}
          className={`w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-lg ${
            spinning 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black hover:opacity-90 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
          }`}
        >
          {spinning ? 'স্পিন হচ্ছে...' : '🎰 SPINS NOW'}
        </button>

        {/* Reset Balance Button */}
        {balance < 10 && (
          <button 
            onClick={() => { setBalance(1000); setMessage('ব্যালেন্স রিলোড করা হয়েছে!'); }} 
            className="mt-3 text-[11px] text-amber-400 hover:underline block mx-auto font-bold"
          >
            🔄 ফ্রি ডেমো ব্যালেন্স রিলোড (৳১০০০)
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center text-gray-500 text-[10px]">
        <p>WIN99 Internal Demo Mode • No Third-Party API Required</p>
      </div>
    </div>
  );
}
