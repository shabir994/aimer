import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export const auth = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create initial profile
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: name.trim(), // Use provided name instead of email-based default
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An error occurred during sign up',
        },
      };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'Invalid login credentials',
        },
      };
    }
  },

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An error occurred during sign out',
        },
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An error occurred during password reset',
        },
      };
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  },
};