import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseConfigurado = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co')

if (!supabaseConfigurado) {
  console.error(
    '%c⚠️ Supabase no configurado\n%cConfigurá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env',
    'color: #f59e0b; font-size: 1.2em; font-weight: bold;',
    'color: #94a3b8; font-size: 0.9em;'
  )
}

export { supabaseConfigurado }

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)
