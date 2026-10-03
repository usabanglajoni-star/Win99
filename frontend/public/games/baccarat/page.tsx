'use client';

import { useRouter } from 'next/navigation';

export default function BaccaratPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative p-4">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="absolute top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all"
      >
        ← ফিরে যান
      </button>

      {/* Game Iframe */}
      <iframe
        src="/games/baccarat.html"
        className="w-full max-w-[960px] h-[660px] border-none rounded-2xl shadow-2xl"
        title="Baccarat Game"
      />
    </div>
  );
}
