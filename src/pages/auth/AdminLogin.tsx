import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

interface LoginForm {
  email: string
  password: string
}

export function AdminLogin() {
  const { login, user, cargando, error } = useAuthStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold gradient-text">UTNDLE</h1>
            <p className="text-sm text-dark-400 mt-1">Panel de Administración</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input w-full"
                {...register('email', {
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                placeholder="admin@utndle.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="input w-full"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres',
                  },
                })}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <a
            href="/"
            className="block text-center text-sm text-dark-400 hover:text-primary-400 mt-4 transition-colors"
          >
            ← Volver al juego
          </a>
        </div>
      </motion.div>
    </div>
  )
}
