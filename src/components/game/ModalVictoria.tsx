import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { Modal } from '@/components/ui/Modal'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function ModalVictoria() {
  const { partida, profesorDelDia } = useGameStore()
  const [cerrado, setCerrado] = useState(false)

  if (!partida || !profesorDelDia) return null

  const abierto = (partida.adivinado || (partida.intentos.length >= 6 && !partida.adivinado)) && !cerrado
  const tiempo = partida.tiempoFin ? Math.floor((partida.tiempoFin - partida.tiempoInicio) / 1000) : 0
  const minutos = Math.floor(tiempo / 60)
  const segundos = tiempo % 60

  const handleShare = () => {
    const resultados = partida.intentos
      .map((i) => {
        const r = i.resultado
        const profesor = r.profesor === 'verde' ? '🟩' : '🟥'
        const catedras = r.catedras === 'verde' ? '🟩' : r.catedras === 'amarillo' ? '🟨' : '🟥'
        const presencialidad = r.presencialidad === 'verde' ? '🟩' : r.presencialidad === 'amarillo' ? '🟨' : '🟥'
        const legajo = r.legajo === 'verde' ? '🟩' : r.legajo === 'amarillo' ? '🟨' : r.legajo === 'subida' ? '⬆️' : '⬇️'
        const jefe = r.jefe_catedra === 'verde' ? '🟩' : r.jefe_catedra === 'amarillo' ? '🟨' : '🟥'
        const edad = r.edad === 'verde' ? '🟩' : r.edad === 'amarillo' ? '🟨' : r.edad === 'subida' ? '⬆️' : '⬇️'
        return `${profesor}${catedras}${presencialidad}${legajo}${jefe}${edad}`
      })
      .join('\n')

    const texto = `🎓 UTNDLE - ${partida.fecha}\n${partida.adivinado ? `${partida.intentos.length}/6` : 'X/6'}\n\n${resultados}\n\n¡Jugá en utndle.vercel.app!`

    if (navigator.share) {
      navigator.share({ text: texto })
    } else {
      navigator.clipboard.writeText(texto)
    }
  }

  return (
    <Modal
      isOpen={abierto}
      onClose={() => setCerrado(true)}
      size="sm"
    >
      <div className="text-center relative">
        <button
          onClick={() => setCerrado(true)}
          className="absolute -top-1 -right-1 text-dark-400 hover:text-white transition-colors p-1"
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
          {partida.adivinado ? '🎉' : '😔'}
        </motion.div>

        <h2 className="text-xl font-bold mb-1">
          {partida.adivinado ? '¡Correcto!' : 'Sin suerte'}
        </h2>

        {!partida.adivinado && (
          <p className="text-sm text-dark-400 mb-4">
            El profesor era{' '}
            <span className="text-white font-bold">{profesorDelDia.nombre}</span>
          </p>
        )}

        <div className="flex items-center justify-center gap-4 mb-4">
          <ImageWithFallback
            src={profesorDelDia.foto_url}
            alt={profesorDelDia.nombre}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="font-semibold">{profesorDelDia.nombre}</p>
            <p className="text-xs text-dark-400">
              {profesorDelDia.catedras.map((c) => c.nombre).join(', ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-dark-700 rounded-lg p-2">
            <p className="text-lg font-bold">{partida.intentos.length}</p>
            <p className="text-xs text-dark-400">Intentos</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-2">
            <p className="text-lg font-bold">{minutos}:{segundos.toString().padStart(2, '0')}</p>
            <p className="text-xs text-dark-400">Tiempo</p>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="btn-primary w-full flex items-center justify-center gap-2"
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
