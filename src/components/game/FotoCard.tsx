import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

export function FotoCard() {
  const fotoPartida = useGameStore((s) => s.fotoPartida)
  const fotoProfesor = useGameStore((s) => s.fotoProfesor)

  if (!fotoPartida || !fotoProfesor) return null

  const intentosCount = fotoPartida.intentos.length
  const clipInset = Math.max(0, 42 - intentosCount * 6)
  const mostrarOjo = intentosCount === 0

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

        {mostrarOjo && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', damping: 12 }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #facc15, #eab308)',
                boxShadow: '0 4px 15px rgba(250,204,21,0.4)',
              }}
            >
              <svg className="w-6 h-6 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </motion.div>
        )}

        <motion.p
          className="text-center text-white/50 text-xs mt-3 font-medium tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Cada intento revela una parte más de la imagen.
        </motion.p>
      </div>
    </motion.div>
  )
}
