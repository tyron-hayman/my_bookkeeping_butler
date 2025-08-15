import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axltzdluoqiorhluosyz.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

if (!supabaseAnonKey) {
  console.error('Missing env NEXT_PUBLIC_SUPABASE_ANON_KEY for Supabase client')
}

const supabase = createClient(supabaseUrl, (supabaseAnonKey || '') as string)

export { supabase }