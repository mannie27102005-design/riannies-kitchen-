import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ynwajrbgaharjntfsfse.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2FqcmJnYWhhcmpudGZzZnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDYwNzcsImV4cCI6MjA5NTE4MjA3N30.k44RTUmRx57Vkvprfjkx4SD08Y-FKXo_tERIOKkPiBU'
)

export default supabase
