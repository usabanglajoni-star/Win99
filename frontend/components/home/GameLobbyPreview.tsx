'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Game {
  id: string;
  title: string;
  provider: string;
  thumbnail: string;
  category: string;
  launch_url?: string;
  slug?: string;
}

export default function GameLobbyPreview() {
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'jackpots'>('popular');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('games').select('*');
        if (error) {
          console.error('Error fetching games:', error);
        } else if (data && data.length > 0) {
          setGames(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const handleGameLaunch = (launchUrl?: string) => {
    if (launchUrl) {
      window.open(launchUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('গেমের লঞ্চ লিঙ্ক পাওয়া যায়নি!');
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Games</h2>
          <p className="text-lg text-gray-600">Play the hottest games and win big!</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'popular'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔥 Popular
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ✨ New Games
          </button>
          <button
            onClick={() => setActiveTab('jackpots')}
            className={`px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'jackpots'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            💎 Jackpots
          </button>
        </div>

        {/* Game Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-600 font-medium">Loading Games...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameLaunch(game.launch_url)}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl relative overflow-hidden">
                  {game.thumbnail?.startsWith('http') ? (
                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>{game.thumbnail || '🎰'}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{game.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{game.provider}</p>
                  <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/games"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            View All 1000+ Games →
          </Link>
        </div>
      </div>
    </section>
  );
}
