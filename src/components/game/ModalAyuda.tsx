import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'

function AyudaClasico() {
  return (
    <>
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
    </>
  )
}

function AyudaFrase() {
  return (
    <>
      <p>
        Te mostramos una <strong className="text-white">frase</strong> que dijo un profesor
        de la UTN. Adiviná <strong className="text-white">quién la dijo</strong>.
      </p>

      <p>
        No hay límite de intentos. Escribí el nombre del profesor que creés que dijo esa frase.
        Cada intento te muestra si acertaste o no.
      </p>

      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-400">Colores</h4>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shrink-0 bg-green-400" />
          <span>¡Respuesta correcta!</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full shrink-0 bg-red-400" />
          <span>No es el profesor correcto</span>
        </div>
      </div>
    </>
  )
}

function AyudaFoto() {
  return (
    <>
      <p>
        Te mostramos una <strong className="text-white">porción muy pequeña</strong> de la foto de un profesor.
        Adiviná <strong className="text-white">quién es</strong>.
      </p>

      <p>
        Cada intento incorrecto revela una parte más de la imagen.
        No hay límite de intentos.
      </p>

      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-400">Sistema de pistas visuales</h4>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded text-xs font-bold text-yellow-900" style={{ background: 'linear-gradient(135deg, #facc15, #eab308)' }}>
            👁️ Foto
          </span>
          <span className="text-white/50">→ Cada fallo revela más imagen</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-yellow-400">Colores de resultado</h4>
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
    </>
  )
}

export function ModalAyuda() {
  const { mostrarAyuda, setMostrarAyuda, modoJuego } = useGameStore()

  const titulo = modoJuego === 'frase' ? '¿Cómo jugar? — Frase' : modoJuego === 'adivina-la-foto' ? '¿Cómo jugar? — Foto' : '¿Cómo jugar?'

  return (
    <Modal
      isOpen={mostrarAyuda}
      onClose={() => setMostrarAyuda(false)}
      title={titulo}
    >
      <div className="space-y-4 text-sm text-white/70">
        {modoJuego === 'frase' ? <AyudaFrase /> : modoJuego === 'adivina-la-foto' ? <AyudaFoto /> : <AyudaClasico />}
      </div>
    </Modal>
  )
}
