import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function FotoResultados() {
  const fotoPartida = useGameStore((s) => s.fotoPartida)
  const fotoProfesor = useGameStore((s) => s.fotoProfesor)

  if (!fotoPartida) return null

  const intentos = [...fotoPartida.intentos].reverse()

  if (intentos.length === 0) return null

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-5">
      <div className="mx-auto" style={{ maxWidth: '650px' }}>
        <div className="space-y-2">
          {intentos.map((intento, i) => {
            const esCorrecto = intento.resultado.profesor === 'verde'
            return (
              <motion.div
                key={intento.timestamp}
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${
                  esCorrecto
                    ? 'bg-green-500/15 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    esCorrecto ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
                <ImageWithFallback
                  src={intento.profesor.foto_url}
                  alt={intento.profesor.nombre}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white/10"
                />
                <span
                  className={`text-sm font-semibold ${
                    esCorrecto ? 'text-green-300' : 'text-red-300'
                  }`}
                >
                  {intento.profesor.nombre}
                </span>
              </motion.div>
            )
          })}
        </div>

        {fotoPartida.adivinado && fotoProfesor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
              border: '1px solid rgba(34,197,94,0.3)',
              boxShadow: '0 0 30px rgba(34,197,94,0.15)',
            }}
          >
            <p className="text-[#22c55e] font-black text-xl">¡Felicitaciones!</p>
            <p className="text-[#22c55e]/70 text-sm mt-1">
              Adivinaste el profesor en {fotoPartida.intentos.length} {fotoPartida.intentos.length === 1 ? 'intento' : 'intentos'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
