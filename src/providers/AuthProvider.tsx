/* eslint-disable react-refresh/only-export-components */
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { hasSupabaseEnv } from '../lib/env';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

interface SignUpResult {
  needsEmailConfirmation: boolean;
}

interface AuthContextValue {
  loading: boolean;
  profile: Profile | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<SignUpResult>;
  user: User | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildFallbackProfile(user: User): Profile {
  const fullName =
    typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : null;
  const now = new Date().toISOString();

  return {
    avatar_url: null,
    created_at: now,
    full_name: fullName,
    id: user.id,
    role: user.user_metadata.role === 'admin' ? 'admin' : 'member',
    updated_at: now,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(hasSupabaseEnv);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const resolveProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser || !hasSupabaseEnv) {
      setProfile(nextUser ? buildFallbackProfile(nextUser) : null);
      return;
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', nextUser.id).single();

    if (error || !data) {
      setProfile(buildFallbackProfile(nextUser));
      return;
    }

    setProfile(data);
  }, []);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      return;
    }

    let mounted = true;

    void (async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await resolveProfile(currentSession?.user ?? null);
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      void resolveProfile(nextSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveProfile]);

  async function signIn(email: string, password: string) {
    if (!hasSupabaseEnv) {
      throw new Error('Supabase environment variables are missing.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }

  async function signUp(fullName: string, email: string, password: string) {
    if (!hasSupabaseEnv) {
      throw new Error('Supabase environment variables are missing.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return {
      needsEmailConfirmation: !data.session,
    };
  }

  async function signOut() {
    if (!hasSupabaseEnv) {
      setSession(null);
      setUser(null);
      setProfile(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  const value = {
    loading,
    profile,
    session,
    signIn,
    signOut,
    signUp,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
