import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'

export function ModalEstadisticas() {
  const { mostrarEstadisticas, setMostrarEstadisticas, estadisticas } = useGameStore()

  const total = estadisticas.partidasJugadas || 1
  const porcentaje = Math.round((estadisticas.partidasGanadas / total) * 100)

  return (
    <Modal
      isOpen={mostrarEstadisticas}
      onClose={() => setMostrarEstadisticas(false)}
      title="Estadísticas"
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold">{estadisticas.partidasJugadas}</p>
          <p className="text-xs text-dark-400">Jugadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{porcentaje}</p>
          <p className="text-xs text-dark-400">% Victoria</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{estadisticas.rachaActual}</p>
          <p className="text-xs text-dark-400">Racha</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{estadisticas.mejorRacha}</p>
          <p className="text-xs text-dark-400">Mejor</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-dark-300 mb-3">Distribución de intentos</h3>
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5, 6].map((num) => {
          const count = estadisticas.distribucionIntentos[num] || 0
          const maxCount = Math.max(...Object.values(estadisticas.distribucionIntentos), 1)
          const width = (count / maxCount) * 100

          return (
            <div key={num} className="flex items-center gap-2">
              <span className="text-xs text-dark-400 w-4 text-right">{num}</span>
              <div className="flex-1 bg-dark-700 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-primary-600 h-full rounded-full flex items-center justify-end px-2 transition-all duration-500"
                  style={{ width: `${Math.max(width, count > 0 ? 10 : 0)}%` }}
                >
                  <span className="text-xs font-bold text-white">{count}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
