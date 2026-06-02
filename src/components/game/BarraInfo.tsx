import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export function BarraInfo() {
  const { setMostrarAyuda, setMostrarEstadisticas, estadisticas } = useGameStore()
  const racha = estadisticas.rachaActual

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4">
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
          boxShadow: '0 4px 20px rgba(250, 204, 21, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        <button
          onClick={() => setMostrarEstadisticas(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/10 hover:bg-black/20 transition-all"
          aria-label="Estadísticas"
        >
          <svg className="w-5 h-5 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-semibold text-yellow-900 hidden sm:inline">Estadísticas</span>
        </button>

        <div className="flex items-center gap-3">
          <motion.span
            className="text-lg"
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          >
            🔥
          </motion.span>
          <div className="flex items-baseline gap-1">
            <motion.span
              className="text-3xl font-black text-yellow-900"
              key={racha}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            >
              {racha}
            </motion.span>
            <span className="text-sm font-semibold text-yellow-900/70">racha</span>
          </div>
        </div>

        <button
          onClick={() => setMostrarAyuda(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/10 hover:bg-black/20 transition-all"
          aria-label="Ayuda"
        >
          <svg className="w-5 h-5 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-yellow-900 hidden sm:inline">Ayuda</span>
        </button>
      </div>
    </div>
  )
}
