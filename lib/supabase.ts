import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (Constants.expoConfig?.extra as any)?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = (Constants.expoConfig?.extra as any)?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUpWithEmailPassword = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });

export const signInWithEmailPassword = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const getAuthSession = () => supabase.auth.getSession();