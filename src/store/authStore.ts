import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  cargando: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  cargando: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ cargando: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, cargando: false })
    } catch (err) {
      set({
        cargando: false,
        error: err instanceof Error ? err.message : 'Error al iniciar sesión',
      })
    }
  },

  logout: async () => {
    set({ cargando: true })
    await supabase.auth.signOut()
    set({ user: null, cargando: false, error: null })
  },

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, cargando: false })
    } catch {
      set({ user: null, cargando: false })
    }
  },
}))
