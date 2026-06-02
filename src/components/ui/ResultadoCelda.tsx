import type { ColorResultado } from '@/types'

interface ResultadoCeldaProps {
  color: ColorResultado
  valor?: string
  children?: React.ReactNode
  index?: number
  esFoto?: boolean
}

const estilos: Record<ColorResultado, { bg: string; glow: string; texto: string; borde: string }> = {
  verde: {
    bg: 'bg-[#22c55e]',
    glow: 'shadow-[0_0_16px_rgba(34,197,94,0.5)]',
    texto: 'text-white',
    borde: 'border-green-400/60',
  },
  amarillo: {
    bg: 'bg-[#fbbf24]',
    glow: 'shadow-[0_0_16px_rgba(251,191,54,0.5)]',
    texto: 'text-[#1e293b]',
    borde: 'border-yellow-300/60',
  },
  rojo: {
    bg: 'bg-[#ef4444]',
    glow: 'shadow-[0_0_16px_rgba(239,68,68,0.5)]',
    texto: 'text-white',
    borde: 'border-red-400/60',
  },
  subida: {
    bg: 'bg-[#475569]',
    glow: '',
    texto: 'text-white',
    borde: 'border-slate-500/60',
  },
  bajada: {
    bg: 'bg-[#475569]',
    glow: '',
    texto: 'text-white',
    borde: 'border-slate-500/60',
  },
}

export function ResultadoCelda({ color, valor, children, index = 0, esFoto = false }: ResultadoCeldaProps) {
  const s = estilos[color]
  const delay = index * 0.15

  return (
    <div
      className="perspective-[1000px]"
      style={{ animation: `card-reveal 0.6s ease-out ${delay}s forwards`, transformStyle: 'preserve-3d' }}
    >
      <div
        className={`relative rounded-xl border-2 ${s.borde} ${s.bg} ${s.glow} overflow-hidden h-16 sm:h-20`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {esFoto ? (
          <div className="w-full h-full">
            {children}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full px-1.5 py-1">
            <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-bold leading-snug text-center ${s.texto}`}>
              {children || (
                <>
                  <span>{valor}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
