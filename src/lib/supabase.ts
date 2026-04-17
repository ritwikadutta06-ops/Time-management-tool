import { createClient } from '@supabase/supabase-js';
import { env, hasSupabaseEnv } from './env';
import type { Database } from '../types/database';

const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey =
  'sb_publishable_placeholder_key_for_local_preview_only_do_not_use_in_production';

export const supabase = createClient<Database>(
  hasSupabaseEnv ? env.supabaseUrl : fallbackUrl,
  hasSupabaseEnv ? env.supabaseAnonKey : fallbackKey,
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  },
);
