import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase keys missing from environment variables')
}

export const supabase = createClient(
  SUPABASE_URL || 'https://ynwajrbgaharjntfsfse.supabase.co',
  SUPABASE_ANON_KEY || ''
)

export default supabase
