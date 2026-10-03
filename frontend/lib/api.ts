import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const api = {
  // Auth endpoints (Supabase Auth)
  auth: {
    register: async (userData: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
            date_of_birth: userData.dateOfBirth,
          },
        },
      });
      if (error) return { error: error.message };
      return { user: data.user, session: data.session };
    },

    login: async (credentials: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) return { error: error.message };
      return { user: data.user, token: data.session?.access_token };
    },

    resendVerification: async (email: string) => {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) return { error: error.message };
      return { message: 'Verification email resent' };
    },

    forgotPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { message: 'Password reset link sent' };
    },

    resetPassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { message: 'Password updated successfully' };
    },
  },

  // Games endpoints (Supabase Games Table)
  games: {
    getAll: async (params?: { category?: string; search?: string; provider?: string }) => {
      let query = supabase.from('games').select('*');

      if (params?.category) {
        query = query.eq('category', params.category);
      }
      if (params?.provider) {
        query = query.eq('provider', params.provider);
      }
      if (params?.search) {
        query = query.ilike('title', `%${params.search}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching games:', error);
        return [];
      }

      // MongoDB format compatibility mapping
      return (data || []).map((game) => ({
        ...game,
        _id: game.id,
        minBet: game.min_bet,
        maxBet: game.max_bet,
        hasJackpot: game.has_jackpot,
        jackpotAmount: game.jackpot_amount,
        demoAvailable: game.demo_available,
        launchUrl: game.launch_url,
        isPopular: game.is_popular,
        isNew: game.is_new,
        isFeatured: game.is_featured,
      }));
    },

    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) return null;

      return {
        ...data,
        _id: data.id,
        minBet: data.min_bet,
        maxBet: data.max_bet,
        hasJackpot: data.has_jackpot,
        jackpotAmount: data.jackpot_amount,
        demoAvailable: data.demo_available,
        launchUrl: data.launch_url,
        isPopular: data.is_popular,
        isNew: data.is_new,
        isFeatured: data.is_featured,
      };
    },

    getJackpots: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('has_jackpot', true);

      if (error) return [];
      return data || [];
    },

    launchGame: async (gameId: string, mode: 'real' | 'demo') => {
      const { data, error } = await supabase
        .from('games')
        .select('launch_url, thumbnail')
        .eq('id', gameId)
        .single();

      if (error || !data) return { url: '' };
      return { url: data.launch_url || data.thumbnail };
    },
  },

  // Promotions endpoints
  promotions: {
    getAll: async (params?: { type?: string; isActive?: boolean }) => {
      let query = supabase.from('promotions').select('*');

      if (params?.type) {
        query = query.eq('type', params.type);
      }
      if (params?.isActive !== undefined) {
        query = query.eq('is_active', params.isActive);
      }

      const { data, error } = await query;
      if (error) return [];
      return data || [];
    },

    getBySlug: async (slug: string) => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) return null;
      return data;
    },
  },

  // Transactions endpoints
  transactions: {
    getAll: async (userId: string) => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    },

    deposit: async (userId: string, data: { amount: number; paymentMethod: string }) => {
      const { data: res, error } = await supabase.from('transactions').insert([
        {
          user_id: userId,
          type: 'deposit',
          amount: data.amount,
          payment_method: data.paymentMethod,
          status: 'pending',
        },
      ]);
      if (error) return { error: error.message };
      return res;
    },

    withdraw: async (userId: string, data: { amount: number; paymentMethod: string }) => {
      const { data: res, error } = await supabase.from('transactions').insert([
        {
          user_id: userId,
          type: 'withdrawal',
          amount: data.amount,
          payment_method: data.paymentMethod,
          status: 'pending',
        },
      ]);
      if (error) return { error: error.message };
      return res;
    },
  },

  // User profile & Favorites
  user: {
    getProfile: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) return null;
      return {
        ...data,
        favoriteGames: data.favorite_games || [],
      };
    },

    toggleFavorite: async (userId: string, gameId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('favorite_games')
        .eq('id', userId)
        .single();

      const currentFavorites: string[] = profile?.favorite_games || [];
      const updatedFavorites = currentFavorites.includes(gameId)
        ? currentFavorites.filter((id) => id !== gameId)
        : [...currentFavorites, gameId];

      const { data, error } = await supabase
        .from('profiles')
        .update({ favorite_games: updatedFavorites })
        .eq('id', userId);

      if (error) return { error: error.message };
      return { favoriteGames: updatedFavorites };
    },

    uploadKYCDocument: async (userId: string, documentType: string, documentUrl: string) => {
      const { data, error } = await supabase.from('kyc_documents').insert([
        {
          user_id: userId,
          document_type: documentType,
          document_url: documentUrl,
          status: 'pending',
        },
      ]);
      if (error) return { error: error.message };
      return data;
    },

    getKYCDocuments: async (userId: string) => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId);

      if (error) return [];
      return data || [];
    },
  },
};
