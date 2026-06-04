import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'

export function ModalEstadisticas() {
  const { mostrarEstadisticas, setMostrarEstadisticas, estadisticas, estadisticasFrase, modoJuego } = useGameStore()

  const stats = modoJuego === 'clasico' ? estadisticas : estadisticasFrase
  const total = stats.partidasJugadas || 1
  const porcentaje = Math.round((stats.partidasGanadas / total) * 100)

  return (
    <Modal
      isOpen={mostrarEstadisticas}
      onClose={() => setMostrarEstadisticas(false)}
      title="Estadísticas"
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.partidasJugadas}</p>
          <p className="text-xs text-white/50">Jugadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{porcentaje}</p>
          <p className="text-xs text-white/50">% Victoria</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.rachaActual}</p>
          <p className="text-xs text-white/50">Racha</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.mejorRacha}</p>
          <p className="text-xs text-white/50">Mejor</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white/70 mb-3">Distribución de intentos</h3>
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5, 6].map((num) => {
          const count = stats.distribucionIntentos[num] || 0
          const maxCount = Math.max(...Object.values(stats.distribucionIntentos), 1)
          const width = (count / maxCount) * 100

          return (
            <div key={num} className="flex items-center gap-2">
              <span className="text-xs text-white/50 w-4 text-right">{num}</span>
              <div className="flex-1 rounded-full h-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full flex items-center justify-end px-2 transition-all duration-500"
                  style={{
                    width: `${Math.max(width, count > 0 ? 10 : 0)}%`,
                    background: 'linear-gradient(90deg, #eab308, #facc15)',
                  }}
                >
                  <span className="text-xs font-bold text-yellow-900">{count}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
