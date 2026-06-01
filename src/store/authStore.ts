import { create } from 'zustand'
import { supabase, supabaseConfigurado } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  verificando: boolean
  enviando: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  verificando: true,
  enviando: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ enviando: true, error: null })

    if (!supabaseConfigurado) {
      set({
        enviando: false,
        error: 'Supabase no está configurado. Revisá el archivo .env con las credenciales.',
      })
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, enviando: false })
    } catch (err) {
      set({
        enviando: false,
        error: err instanceof Error ? err.message : 'Error al iniciar sesión',
      })
    }
  },

  logout: async () => {
    set({ enviando: true })
    await supabase.auth.signOut()
    set({ user: null, enviando: false, error: null })
  },

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, verificando: false })
    } catch {
      set({ user: null, verificando: false })
    }
  },
}))
