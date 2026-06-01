import { motion } from 'framer-motion'
import type { ColorResultado } from '@/types'

interface ResultadoCeldaProps {
  color: ColorResultado
  children?: React.ReactNode
  delay?: number
}

const colorMap: Record<ColorResultado, string> = {
  verde: 'bg-green-600 border-green-500',
  rojo: 'bg-red-600/80 border-red-500',
  subida: 'bg-dark-600 border-dark-500',
  bajada: 'bg-dark-600 border-dark-500',
}

export function ResultadoCelda({ color, children, delay = 0 }: ResultadoCeldaProps) {
  return (
    <motion.td
      className={`px-3 py-2 text-center text-sm font-medium border ${colorMap[color]} min-w-[80px]`}
      initial={{ rotateX: 90 }}
      animate={{ rotateX: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <div className="flex items-center justify-center gap-1">
        {color === 'subida' && (
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
        {color === 'bajada' && (
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )}
        {children}
      </div>
    </motion.td>
  )
}
