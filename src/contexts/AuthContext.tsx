import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { auth } from '../lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileAPI } from '../lib/profile';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
        
        // Initial route handling
        if (currentUser && location.pathname === '/') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      // Handle auth state changes
      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await auth.signIn(email, password);
      if (error) throw new Error(error.message);
      if (user) {
        // Check if profile exists, if not create one
        const profile = await profileAPI.getProfile(user.id);
        if (!profile) {
          await profileAPI.createProfile({
            id: user.id,
            name: email.split('@')[0],
            email: user.email!,
          });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await auth.signInWithProvider(provider);
      if (error) throw new Error(error.message);
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign in with social provider');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user, error: signUpError } = await auth.signUp(email, password, name);
      if (signUpError) throw new Error(signUpError.message);
      
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('already registered')) {
        setError('This email is already registered. Please try signing in instead.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(null);
      navigate('/', { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signInWithProvider,
      signUp, 
      signOut, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}