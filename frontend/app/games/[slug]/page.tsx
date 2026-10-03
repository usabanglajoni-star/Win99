'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // 🚀 Game Iframe Modal State
  const [showGameModal, setShowGameModal] = useState(false);
  const [gamePlayMode, setGamePlayMode] = useState<'real' | 'demo'>('real');

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const slug = params.slug as string;
        
        const gameData = await api.games.getBySlug(slug);
        
        if (gameData._id) {
          setGame(gameData);
          
          if (isAuthenticated && token && user) {
            try {
              const profileData = await api.user.getProfile(token);
              setIsFavorite(profileData.favoriteGames?.includes(gameData._id) || false);
            } catch {
              // Ignore profile fetch failure
            }
          }
          
          const allGames = await api.games.getAll({ category: gameData.category });
          const similar = allGames.filter((g: Game) => g._id !== gameData._id).slice(0, 4);
          setSimilarGames(similar);
        } else {
          setError('Game not found');
        }
      } catch {
        setError('Failed to load game details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [params.slug, isAuthenticated, token, user]);

  const handlePlayGame = (mode: 'real' | 'demo') => {
    if (mode === 'real' && !isAuthenticated) {
      router.push('/login');
      return;
    }
    setGamePlayMode(mode);
    setShowGameModal(true);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !token) {
      router.push('/login');
      return;
    }

    if (!game) return;

    setFavoriteLoading(true);
    try {
      await api.user.toggleFavorite(token, game._id);
      setIsFavorite(!isFavorite);
    } catch {
      alert('Failed to update favorites. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-sm font-medium">গেম লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Game not found'}</p>
          <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const volatilityColors = {
    low: 'text-green-400',
    medium: 'text-amber-400',
    high: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white py-8 px-4 font-sans pb-20">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 text-xs flex items-center gap-2 text-gray-400">
          <Link href="/" className="text-amber-400 hover:text-amber-300">
            হোম
          </Link>
          <span>/</span>
          <Link href="/games" className="text-amber-400 hover:text-amber-300">
            গেমসমূহ
          </Link>
          <span>/</span>
          <span className="text-gray-200">{game.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Image and Play Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#141416] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Game Image Banner */}
              <div className="relative aspect-video bg-gray-900">
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
                {game.hasJackpot && game.jackpotAmount && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1.5 rounded-full font-black text-xs shadow-lg">
                    💰 ৳ {game.jackpotAmount.toLocaleString()}
                  </div>
                )}
                {game.isNew && (
                  <div className="absolute top-4 left-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-black">
                    NEW
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-6">
                <h1 className="text-3xl font-black text-white mb-2">{game.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-4 text-xs">
                  <div className="flex items-center space-x-1.5 bg-[#1f1f24] px-3 py-1 rounded-lg border border-gray-800">
                    <span className="text-gray-400">প্রোভাইডার:</span>
                    <span className="text-amber-400 font-bold">{game.provider}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-[#1f1f24] px-3 py-1 rounded-lg border border-gray-800">
                    <span className="text-gray-400">ক্যাটাগরি:</span>
                    <span className="text-white font-bold capitalize">
                      {game.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{game.description}</p>

                {/* Play Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handlePlayGame('real')}
                    className="flex-1 min-w-[180px] py-3.5 px-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-400 hover:to-emerald-500 text-black font-black text-base rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] uppercase tracking-wider"
                  >
                    খেলুন (Real Play) 🎰
                  </button>
                  {game.demoAvailable && (
                    <button
                      onClick={() => handlePlayGame('demo')}
                      className="flex-1 min-w-[180px] py-3.5 px-6 bg-[#222530] text-gray-200 hover:text-white font-bold text-base rounded-xl border border-gray-700 hover:border-gray-500 transition-all"
                    >
                      ডেমো ট্রাই করুন
                    </button>
                  )}
                  <button
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`py-3.5 px-5 font-bold text-lg rounded-xl border transition-all disabled:opacity-50 ${
                      isFavorite
                        ? 'bg-red-950/60 border-red-500 text-red-400'
                        : 'bg-[#222530] border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {favoriteLoading ? '...' : isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>

            {/* Similar Games */}
            {similarGames.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-black text-white mb-4">অনুরূপ গেমসমূহ</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {similarGames.map((similarGame) => (
                    <Link
                      key={similarGame._id}
                      href={`/games/${similarGame.slug}`}
                      className="group bg-[#141416] rounded-xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all"
                    >
                      <div className="relative aspect-square bg-gray-800">
                        <Image
                          src={similarGame.thumbnail}
                          alt={similarGame.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-white font-bold text-xs truncate">
                          {similarGame.title}
                        </h3>
                        <p className="text-gray-500 text-[10px]">{similarGame.provider}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Game Details Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#141416] border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-black text-base mb-4 border-b border-gray-800 pb-2">গেম সম্পর্কিত তথ্য</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">RTP (রিটার্ন)</span>
                  <span className="text-green-400 font-bold">{game.rtp}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ভোল্যাটিলিটি</span>
                  <span className={`font-bold capitalize ${volatilityColors[game.volatility]}`}>
                    {game.volatility}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">সর্বনিম্ন বেট</span>
                  <span className="text-white font-bold">৳ {game.minBet}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">সর্বোচ্চ বেট</span>
                  <span className="text-white font-bold">৳ {game.maxBet}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            {game.features.length > 0 && (
              <div className="bg-[#141416] border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black text-base mb-3 border-b border-gray-800 pb-2">ফিচারসমূহ</h3>
                <div className="flex flex-wrap gap-2">
                  {game.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🎰 GAME LAUNCH POPUP MODAL (iFrame) */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-[#121212] border border-green-500/40 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 py-2.5 bg-[#1a1a1e] border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm">{game.title}</span>
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                  {gamePlayMode === 'real' ? 'Real Mode' : 'Demo Mode'}
                </span>
              </div>
              <button
                onClick={() => setShowGameModal(false)}
                className="text-gray-400 hover:text-white font-bold text-xl px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / iFrame Game Screen */}
            <div className="flex-1 w-full h-full bg-black relative">
              <iframe
                src={game.thumbnail} // 🔗 Provider-এর আসল গেম লিংক থাকলে এখানে সেই লিঙ্ক বসবে (যেমন: game.gameUrl)
                title={game.title}
                className="w-full h-full border-0"
                allow="fullscreen; autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
