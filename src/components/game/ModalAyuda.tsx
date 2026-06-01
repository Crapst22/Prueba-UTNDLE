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
      <div className="space-y-4 text-sm text-dark-200">
        <p>
          Adiviná el <strong className="text-white">profesor del día</strong> de la UTN.
          Todos los días hay un profesor nuevo para adivinar.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-white">Pistas</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-dark-700 text-xs">🎵 Audio</span>
            <span className="text-dark-400">→ Se desbloquea en intento #3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-dark-700 text-xs">🖼️ Imagen</span>
            <span className="text-dark-400">→ Se desbloquea en intento #5</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-white">Colores</h4>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-600" />
            <span>Coincidencia exacta</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-red-600/80" />
            <span>No coincide</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-dark-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </span>
            <span>El valor correcto es mayor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-dark-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
            <span>El valor correcto es menor</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
