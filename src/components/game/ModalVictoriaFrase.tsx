import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function ModalVictoriaFrase() {
  const { frasePartida, fraseDelDia, mostrarVictoriaFrase, setMostrarVictoriaFrase } = useGameStore()
  const [cerrado, setCerrado] = useState(false)

  if (!frasePartida || !fraseDelDia) return null

  const abierto = mostrarVictoriaFrase && !cerrado
  const profesor = fraseDelDia.profesor
  const tiempo = frasePartida.tiempoFin ? Math.floor((frasePartida.tiempoFin - frasePartida.tiempoInicio) / 1000) : 0
  const minutos = Math.floor(tiempo / 60)
  const segundos = tiempo % 60

  const handleShare = () => {
    const texto = `🎓 UTNDLE - Frase\n${frasePartida.fecha}\n${frasePartida.adivinado ? `${frasePartida.intentos} intento${frasePartida.intentos !== 1 ? 's' : ''}` : 'X'}\n\n"${fraseDelDia.texto}"\n\n¡Jugá en utndle.vercel.app!`

    if (navigator.share) {
      navigator.share({ text: texto })
    } else {
      navigator.clipboard.writeText(texto)
    }
  }

  return (
    <Modal
      isOpen={abierto}
      onClose={() => { setCerrado(true); setMostrarVictoriaFrase(false) }}
      size="sm"
    >
      <div className="text-center relative">
        <button
          onClick={() => { setCerrado(true); setMostrarVictoriaFrase(false) }}
          className="absolute -top-1 -right-1 text-white/40 hover:text-white transition-colors p-1"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          className="text-5xl mb-3"
        >
          {frasePartida.adivinado ? '🎉' : '😔'}
        </motion.div>

        <h2 className="text-xl font-bold text-yellow-400 mb-1">
          {frasePartida.adivinado ? '¡Correcto!' : 'Sin suerte'}
        </h2>

        <p className="text-sm text-white/50 mb-4">
          {frasePartida.adivinado
            ? `Lo adivinaste en ${frasePartida.intentos} intento${frasePartida.intentos !== 1 ? 's' : ''}`
            : `El profesor era `}
          {!frasePartida.adivinado && (
            <span className="text-white font-bold">{profesor.nombre}</span>
          )}
        </p>

        <div className="flex items-center justify-center gap-3 mb-2">
          <ImageWithFallback
            src={profesor.foto_url}
            alt={profesor.nombre}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-yellow-400/50"
          />
          <div className="text-left">
            <p className="font-semibold text-white">{profesor.nombre}</p>
            <p className="text-xs text-white/50">
              {profesor.catedras.map((c) => c.nombre).join(', ')}
            </p>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-4 mx-auto max-w-[160px]" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-lg font-bold text-yellow-400">{minutos}:{segundos.toString().padStart(2, '0')}</p>
          <p className="text-xs text-white/50">Tiempo</p>
        </div>

        <button
          onClick={handleShare}
          className="gold-btn w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-yellow-900"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Compartir
        </button>
      </div>
    </Modal>
  )
}
