// src/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Intentará usar las variables de entorno (Producción/Vercel) 
// y si no existen, usará tus credenciales locales por defecto.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)