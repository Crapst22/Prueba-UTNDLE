import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function FraseResultados() {
  const frasePartida = useGameStore((s) => s.frasePartida)

  if (!frasePartida?.intentosList?.length) return null

  const intentos = [...frasePartida.intentosList].reverse()

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-5">
      <div className="mx-auto" style={{ maxWidth: '650px' }}>
        <div className="space-y-2">
          {intentos.map((intento, i) => (
            <motion.div
              key={`${intento.profesor.id}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${
                intento.correcto
                  ? 'bg-green-500/15 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  intento.correcto ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
              <ImageWithFallback
                src={intento.profesor.foto_url}
                alt={intento.profesor.nombre}
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white/10"
              />
              <span
                className={`text-sm font-semibold ${
                  intento.correcto ? 'text-green-300' : 'text-red-300'
                }`}
              >
                {intento.profesor.nombre}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
