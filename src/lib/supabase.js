import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
// from https://supabase.com/dashboard/project/<your-project>/settings/api
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
