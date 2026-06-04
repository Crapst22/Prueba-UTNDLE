import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export function FotoCard() {
  const fotoPartida = useGameStore((s) => s.fotoPartida)
  const fotoProfesor = useGameStore((s) => s.fotoProfesor)
  const fotoRevelarAutomatico = useGameStore((s) => s.fotoRevelarAutomatico)
  const setFotoRevelarAutomatico = useGameStore((s) => s.setFotoRevelarAutomatico)

  if (!fotoPartida || !fotoProfesor) return null

  const intentosCount = fotoPartida.intentos.length

  const clipInset = fotoPartida.adivinado
    ? 0
    : fotoRevelarAutomatico
      ? Math.max(0, 40 - intentosCount * 1.5)
      : Math.max(0, 40)

  return (
    <motion.div
      className="px-4 max-w-4xl mx-auto w-full mt-6"
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="mx-auto rounded-2xl p-6 sm:p-8"
        style={{
          maxWidth: '480px',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(250,204,21,0.08)',
        }}
      >
        <p className="text-center text-white font-semibold text-sm sm:text-base mb-5 tracking-wide">
          ¿Qué profesor tiene esta foto completa?
        </p>

        <div className="flex justify-center mb-4">
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              width: '200px',
              height: '200px',
              boxShadow: '0 0 20px rgba(250,204,21,0.15), inset 0 0 30px rgba(0,0,0,0.3)',
            }}
          >
            <motion.img
              src={fotoPartida.fotoUrl}
              alt="Foto del profesor"
              className="w-full h-full object-cover"
              style={{
                clipPath: `inset(${clipInset}%)`,
                transition: 'clip-path 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <motion.button
            onClick={() => setFotoRevelarAutomatico(!fotoRevelarAutomatico)}
            className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: fotoRevelarAutomatico
                ? 'linear-gradient(135deg, #facc15, #eab308)'
                : 'rgba(255,255,255,0.1)',
              boxShadow: fotoRevelarAutomatico
                ? '0 4px 15px rgba(250,204,21,0.4)'
                : 'none',
              border: fotoRevelarAutomatico ? 'none' : '1px solid rgba(255,255,255,0.2)',
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label={fotoRevelarAutomatico ? 'Desactivar revelado automático' : 'Activar revelado automático'}
          >
            {fotoRevelarAutomatico ? (
              <svg className="w-6 h-6 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </motion.button>
        </div>

        <motion.p
          className="text-center text-white/50 text-xs mt-1 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {fotoRevelarAutomatico
            ? 'Cada intento revela una parte más de la imagen.'
            : 'Revelado automático desactivado.'}
        </motion.p>
      </div>
    </motion.div>
  )
}
