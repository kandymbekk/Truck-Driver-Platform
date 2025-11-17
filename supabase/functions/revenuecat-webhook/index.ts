// lib/supabase.ts — SUPABASE TAMAMEN DEVRE DIŞI (Fake client)
import { createClient } from '@supabase/supabase-js'

// Gerçek Supabase URL ve key’i boş bırakıyoruz → hata vermez, sadece fake döner
const supabaseUrl = ''
const supabaseAnonKey = ''

// Fake bir client döndürüyoruz, hiçbir şey yapmaz ama hata da vermez
export const supabase = {
  auth: {
    signUp: async () => ({ data: { user: { id: 'fake-user-123' }, session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'fake-user-123' }, session: null }, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    insert: async () => ({ error: null }),
    upsert: async () => ({ error: null }),
    select: async () => ({ data: [], error: null }),
    update: async () => ({ error: null }),
  }),
}