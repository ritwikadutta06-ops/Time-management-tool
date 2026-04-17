export const env = {
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
};

export const hasSupabaseEnv = Boolean(env.supabaseUrl && env.supabaseAnonKey);
