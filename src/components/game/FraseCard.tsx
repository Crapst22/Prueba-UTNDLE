import { motion } from 'framer-motion'
import type { FraseConProfesor } from '@/types'

interface FraseCardProps {
  frase: FraseConProfesor
}

export function FraseCard({ frase }: FraseCardProps) {
  return (
    <motion.div
      className="px-4 max-w-4xl mx-auto w-full mt-6"
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="mx-auto rounded-2xl p-6 sm:p-8 md:p-10"
        style={{
          maxWidth: '650px',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 30px rgba(250,204,21,0.08)',
        }}
      >
        <p className="text-center text-white font-semibold text-sm sm:text-base mb-4 sm:mb-6 tracking-wide">
          ¿Qué profesor dijo?
        </p>

        <div className="relative">
          <span
            className="absolute -top-2 -left-1 sm:-top-4 sm:-left-2 text-4xl sm:text-6xl leading-none select-none"
            style={{ color: 'rgba(250, 204, 21, 0.35)' }}
          >
            ❝
          </span>

          <p
            className="text-center leading-relaxed font-display font-semibold text-white px-4 sm:px-8 py-2"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {frase.texto}
          </p>

          <span
            className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-4xl sm:text-6xl leading-none select-none"
            style={{ color: 'rgba(250, 204, 21, 0.35)' }}
          >
            ❞
          </span>
        </div>
      </div>
    </motion.div>
  )
}
