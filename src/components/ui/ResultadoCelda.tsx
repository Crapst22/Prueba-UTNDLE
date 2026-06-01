import { motion } from 'framer-motion'
import type { ColorResultado } from '@/types'

interface ResultadoCeldaProps {
  color: ColorResultado
  valor?: string
  children?: React.ReactNode
  delay?: number
  esFoto?: boolean
}

const estilos: Record<ColorResultado, { bg: string; glow: string; texto: string; borde: string }> = {
  verde: {
    bg: 'bg-[#22c55e]',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    texto: 'text-white',
    borde: 'border-green-400/50',
  },
  amarillo: {
    bg: 'bg-[#fbbf24]',
    glow: 'shadow-[0_0_20px_rgba(251,191,54,0.4)]',
    texto: 'text-[#1e293b]',
    borde: 'border-yellow-300/50',
  },
  rojo: {
    bg: 'bg-[#ef4444]',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    texto: 'text-white',
    borde: 'border-red-400/50',
  },
  subida: {
    bg: 'bg-[#475569]',
    glow: '',
    texto: 'text-white',
    borde: 'border-dark-500',
  },
  bajada: {
    bg: 'bg-[#475569]',
    glow: '',
    texto: 'text-white',
    borde: 'border-dark-500',
  },
}

export function ResultadoCelda({ color, valor, children, delay = 0, esFoto = false }: ResultadoCeldaProps) {
  const s = estilos[color]

  return (
    <div className="perspective-[1000px]">
      <motion.div
        className={`relative rounded-xl border ${s.borde} ${s.bg} ${s.glow} overflow-hidden group min-h-[72px]`}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        whileHover={{ translateY: -4 }}
      >
        {esFoto ? (
          <div className="w-full h-full">
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full min-h-[72px] px-2 py-1">
            <div className={`flex items-center gap-1 text-xs font-bold leading-snug text-center ${s.texto}`}>
              {children || (
                <>
                  <span className="line-clamp-3">{valor}</span>
                  {color === 'subida' && (
                    <motion.svg className="w-4 h-4 shrink-0 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      initial={{ y: 4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </motion.svg>
                  )}
                  {color === 'bajada' && (
                    <motion.svg className="w-4 h-4 shrink-0 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </motion.svg>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
