
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = "https://tlgofrhdhfklmjioearg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ29mcmhkaGZrbG1qaW9lYXJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NjA2ODEsImV4cCI6MjA1MzQzNjY4MX0.KIc6WzuoSPGFUGcyluoJc5ANXXyit4jBEedFZyE_lBk"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
