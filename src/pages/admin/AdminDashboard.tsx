import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useGameStore } from '@/store/gameStore'
import { obtenerProfesores, eliminarProfesor } from '@/services/profesores'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { Profesor } from '@/types'
import { calcularEdad } from '@/utils/edad'

export function AdminDashboard() {
  const { user, verificando, logout, checkSession } = useAuthStore()
  const { reiniciarPartida, cambiarProfesorDelDia } = useGameStore()
  const navigate = useNavigate()
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eliminarId, setEliminarId] = useState<string | null>(null)

  useEffect(() => {
    checkSession()
    cargarProfesores()
  }, [])

  const handleReiniciar = () => {
    reiniciarPartida()
    navigate('/')
  }

  const handleCambiarProfesor = async () => {
    await cambiarProfesorDelDia()
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const cargarProfesores = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerProfesores()
      setProfesores(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar profesores')
    } finally {
      setCargando(false)
    }
  }, [])

  const handleEliminar = useCallback(async (id: string) => {
    try {
      await eliminarProfesor(id)
      setProfesores((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar profesor')
    }
    setEliminarId(null)
  }, [])

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/fondo.jpg)' }} />
        <div className="fixed inset-0 bg-black/40" />
        <div className="relative z-10">
          <LoadingSpinner size="lg" text="Verificando sesión..." />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/fondo.jpg)' }} />
      <div className="fixed inset-0 bg-black/40" />
      <header className="relative z-40 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 h-auto min-h-14 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/" className="text-sm text-dark-400 hover:text-yellow-400 transition-colors whitespace-nowrap">
              ← Juego
            </a>
            <h1 className="text-lg font-bold gradient-text">Admin</h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
            <span className="text-xs text-dark-400 hidden sm:inline">{user.email}</span>
            <button
              onClick={() => navigate('/admin/configuracion')}
              className="btn-secondary text-xs py-1 px-2 sm:py-1.5 sm:px-3"
            >
              Configuración
            </button>
            <button
              onClick={() => navigate('/admin/nuevo')}
              className="btn-primary text-xs py-1 px-2 sm:py-1.5 sm:px-3"
            >
              + Nuevo
            </button>
            <button
              onClick={handleReiniciar}
              className="btn-secondary text-xs py-1 px-2 sm:py-1.5 sm:px-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Reiniciar
            </button>
            <button
              onClick={handleCambiarProfesor}
              className="btn-secondary text-xs py-1 px-2 sm:py-1.5 sm:px-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              Cambiar
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary text-xs py-1 px-2 sm:py-1.5 sm:px-3"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-xs text-red-400/70 hover:text-red-400 mt-1">
              Cerrar
            </button>
          </motion.div>
        )}

        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Cargando profesores..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase">Foto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400 uppercase">Legajo</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400 uppercase">Edad</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-dark-400 uppercase">Cátedras</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-dark-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-dark-400">
                      No hay profesores registrados
                    </td>
                  </tr>
                ) : (
                  profesores.map((profesor) => (
                    <motion.tr
                      key={profesor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <ImageWithFallback
                          src={profesor.foto_url}
                          alt={profesor.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-sm">{profesor.nombre}</td>
                      <td className="px-4 py-3 text-center font-mono text-sm">{profesor.legajo}</td>
                      <td className="px-4 py-3 text-center text-sm">{calcularEdad(profesor.fecha_nacimiento)}</td>
                      <td className="px-4 py-3 text-center text-sm">{profesor.catedras.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/editar/${profesor.id}`)}
                            className="text-xs px-3 py-1.5 rounded bg-dark-700 hover:bg-dark-600 text-dark-200 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setEliminarId(profesor.id)}
                            className="text-xs px-3 py-1.5 rounded bg-red-900/50 hover:bg-red-800/50 text-red-300 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={eliminarId !== null}
        onClose={() => setEliminarId(null)}
        onConfirm={() => eliminarId && handleEliminar(eliminarId)}
        title="Eliminar profesor"
        message="¿Está seguro que desea eliminar este profesor?"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  )
}
