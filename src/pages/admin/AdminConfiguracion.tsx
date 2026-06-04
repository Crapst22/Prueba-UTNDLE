import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useGameStore } from '@/store/gameStore'
import {
  obtenerCatedras,
  obtenerPresencialidades,
  crearCatedra,
  eliminarCatedra,
  crearPresencialidad,
  eliminarPresencialidad,
} from '@/services/profesores'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Catedra, Presencialidad } from '@/types'

export function AdminConfiguracion() {
  const { user, verificando, checkSession } = useAuthStore()
  const navigate = useNavigate()
  const [catedras, setCatedras] = useState<Catedra[]>([])
  const [presencialidades, setPresencialidades] = useState<Presencialidad[]>([])
  const [cargando, setCargando] = useState(true)
  const [nuevaCatedra, setNuevaCatedra] = useState('')
  const [nuevaPresencialidad, setNuevaPresencialidad] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (!verificando && !user) {
      navigate('/admin/login')
    }
  }, [user, verificando, navigate])

  useEffect(() => {
    if (user) {
      cargarDatos()
    }
  }, [user])

  const cargarDatos = async () => {
    setCargando(true)
    try {
      const [cats, pres] = await Promise.all([
        obtenerCatedras(),
        obtenerPresencialidades(),
      ])
      setCatedras(cats)
      setPresencialidades(pres)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    } finally {
      setCargando(false)
    }
  }

  const handleAgregarCatedra = async () => {
    const nombre = nuevaCatedra.trim()
    if (!nombre) return
    setError(null)
    try {
      const catedra = await crearCatedra(nombre)
      setCatedras((prev) => [...prev, catedra].sort((a, b) => a.nombre.localeCompare(b.nombre)))
      setNuevaCatedra('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cátedra')
    }
  }

  const handleEliminarCatedra = async (id: string) => {
    setError(null)
    try {
      await eliminarCatedra(id)
      setCatedras((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cátedra')
    }
  }

  const handleAgregarPresencialidad = async () => {
    const nombre = nuevaPresencialidad.trim()
    if (!nombre) return
    setError(null)
    try {
      const pres = await crearPresencialidad(nombre)
      setPresencialidades((prev) => [...prev, pres].sort((a, b) => a.nombre.localeCompare(b.nombre)))
      setNuevaPresencialidad('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear presencialidad')
    }
  }

  const handleEliminarPresencialidad = async (id: string) => {
    setError(null)
    try {
      await eliminarPresencialidad(id)
      setPresencialidades((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar presencialidad')
    }
  }

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
      <div className="fixed inset-0 bg-black/40 pointer-events-none" />

      <header className="relative z-40 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a href="/admin" className="text-sm text-dark-400 hover:text-yellow-400 transition-colors whitespace-nowrap">
              ← Volver
            </a>
            <h1 className="text-base sm:text-lg font-bold gradient-text truncate">Configuración</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 relative z-10 space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-400/10 border border-red-400/20 rounded-lg p-3"
          >
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="text-xs text-red-400/70 hover:text-red-400 mt-1">
              Cerrar
            </button>
          </motion.div>
        )}

        {cargando ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Cargando..." />
          </div>
        ) : (
          <>
            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Cátedras</h2>
                <span className="text-xs text-dark-400">{catedras.length} registradas</span>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nuevaCatedra}
                  onChange={(e) => setNuevaCatedra(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAgregarCatedra()}
                  placeholder="Nombre de la cátedra"
                  className="input flex-1"
                />
                <button onClick={handleAgregarCatedra} className="btn-primary text-sm whitespace-nowrap">
                  + Agregar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {catedras.map((catedra) => (
                  <div
                    key={catedra.id}
                    className="flex items-center justify-between bg-dark-800/50 rounded-lg px-3 py-2 group"
                  >
                    <span className="text-sm text-dark-200">{catedra.nombre}</span>
                    <button
                      onClick={() => handleEliminarCatedra(catedra.id)}
                      className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Presencialidades</h2>
                <span className="text-xs text-dark-400">{presencialidades.length} registradas</span>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nuevaPresencialidad}
                  onChange={(e) => setNuevaPresencialidad(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAgregarPresencialidad()}
                  placeholder="Nombre de la presencialidad"
                  className="input flex-1"
                />
                <button onClick={handleAgregarPresencialidad} className="btn-primary text-sm whitespace-nowrap">
                  + Agregar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {presencialidades.map((pres) => (
                  <div
                    key={pres.id}
                    className="flex items-center justify-between bg-dark-800/50 rounded-lg px-3 py-2 group"
                  >
                    <span className="text-sm text-dark-200">{pres.nombre}</span>
                    <button
                      onClick={() => handleEliminarPresencialidad(pres.id)}
                      className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Modo Clásico</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const { reiniciarPartida, iniciarPartida } = useGameStore.getState()
                    reiniciarPartida()
                    iniciarPartida()
                  }}
                  className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900"
                >
                  Reiniciar partida
                </button>
                <button
                  onClick={async () => {
                    const { cambiarProfesorDelDia } = useGameStore.getState()
                    await cambiarProfesorDelDia()
                  }}
                  className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900"
                >
                  Cambiar profesor
                </button>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Modo Frase</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const { reiniciarFrasePartida, iniciarFrasePartida } = useGameStore.getState()
                    reiniciarFrasePartida()
                    iniciarFrasePartida()
                  }}
                  className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900"
                >
                  Reiniciar partida
                </button>
                <button
                  onClick={async () => {
                    const { cambiarFraseDelDia } = useGameStore.getState()
                    await cambiarFraseDelDia()
                  }}
                  className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900"
                >
                  Cambiar profesor
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
