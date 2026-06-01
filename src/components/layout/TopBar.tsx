import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'

export function TopBar() {
  const { setMostrarAyuda, setMostrarEstadisticas, estadisticas } = useGameStore()
  const { user } = useAuthStore()

  const racha = estadisticas.rachaActual

  return (
    <header className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {user && (
            <a
              href="/admin"
              className="text-xs text-dark-400 hover:text-primary-400 transition-colors px-2 py-1 rounded bg-dark-800"
            >
              Admin
            </a>
          )}
        </div>

        <h1 className="text-xl font-extrabold tracking-wider gradient-text">
          UTNDLE
        </h1>

        <div className="flex items-center gap-3">
          {racha > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-sm text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-mono font-bold">{racha}</span>
            </div>
          )}

          <button
            onClick={() => setMostrarAyuda(true)}
            className="w-8 h-8 rounded-full border border-dark-500 flex items-center justify-center text-sm font-bold text-dark-300 hover:text-white hover:border-dark-300 transition-colors"
            aria-label="Ayuda"
          >
            ?
          </button>

          <button
            onClick={() => setMostrarEstadisticas(true)}
            className="w-8 h-8 rounded-full border border-dark-500 flex items-center justify-center text-sm font-bold text-dark-300 hover:text-white hover:border-dark-300 transition-colors"
            aria-label="Estadísticas"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
