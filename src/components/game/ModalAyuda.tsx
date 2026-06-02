import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'

export function ModalAyuda() {
  const { mostrarAyuda, setMostrarAyuda } = useGameStore()

  return (
    <Modal
      isOpen={mostrarAyuda}
      onClose={() => setMostrarAyuda(false)}
      title="¿Cómo jugar?"
    >
      <div className="space-y-4 text-sm text-white/70">
        <p>
          Adiviná el <strong className="text-white">profesor del día</strong> de la UTN.
          Todos los días hay un profesor nuevo para adivinar.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-yellow-400">Pistas</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs font-bold text-yellow-900" style={{ background: 'linear-gradient(135deg, #facc15, #eab308)' }}>
              🎵 Audio
            </span>
            <span className="text-white/50">→ Se desbloquea en intento #3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs font-bold text-yellow-900" style={{ background: 'linear-gradient(135deg, #facc15, #eab308)' }}>
              🖼️ Imagen
            </span>
            <span className="text-white/50">→ Se desbloquea en intento #5</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-yellow-400">Colores</h4>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded" style={{ background: '#22c55e' }} />
            <span>Coincidencia exacta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded" style={{ background: '#fbbf24' }} />
            <span>Coincidencia parcial</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded" style={{ background: '#ef4444' }} />
            <span>No coincide</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold" style={{ background: '#475569', color: '#4ade80' }}>
              ↑
            </span>
            <span>El valor correcto es mayor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold" style={{ background: '#475569', color: '#f87171' }}>
              ↓
            </span>
            <span>El valor correcto es menor</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
