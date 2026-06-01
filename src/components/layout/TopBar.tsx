import { useGameStore } from '@/store/gameStore'
import { useAuthStore } from '@/store/authStore'

export function TopBar() {
  const { setMostrarAyuda, setMostrarEstadisticas, estadisticas } = useGameStore()
  const { user } = useAuthStore()

  const racha = estadisticas.rachaActual

  return (
    <header className="relative z-40">
      {user && (
        <a
          href="/admin"
          className="fixed top-3 left-3 z-50 text-xs text-white/60 hover:text-yellow-300 transition-colors px-2 py-1 rounded bg-white/5 backdrop-blur-sm"
        >
          Admin
        </a>
      )}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-1">
          <img
            src="/iconos/logo-utn.png"
            alt="Logo UTN"
            className="w-10 h-10 object-contain drop-shadow-lg"
          />
          <h1 className="text-4xl font-extrabold tracking-wider gradient-text drop-shadow-lg">
            UTNDLE
          </h1>
        </div>
        <p className="text-sm text-white/70 font-medium text-shadow">
          Facultad Regional de Villa María
        </p>

        <div className="flex items-center gap-3 mt-4 w-full justify-end">

          <div className="flex items-center gap-3">
            {racha > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30">
                <img
                  src="/iconos/racha.gif"
                  alt="Racha"
                  className="w-4 h-4 object-contain"
                />
                <span className="font-mono font-bold text-sm text-yellow-300">{racha}</span>
              </div>
            )}

            <button
              onClick={() => setMostrarAyuda(true)}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-sm font-bold text-white/60 hover:text-white hover:border-white/40 transition-colors backdrop-blur-sm"
              aria-label="Ayuda"
            >
              ?
            </button>

            <button
              onClick={() => setMostrarEstadisticas(true)}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors backdrop-blur-sm"
              aria-label="Estadísticas"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
