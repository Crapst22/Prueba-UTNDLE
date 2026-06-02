import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

function hashSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function usePosicionEstable(id: string) {
  const seed = useMemo(() => hashSeed(id), [id])
  const offsetX = useMemo(() => seed % 60, [seed])
  const offsetY = useMemo(() => Math.floor(seed / 60) % 60, [seed])
  return { offsetX, offsetY }
}

export function PanelPistas() {
  const { pistaAudioDesbloqueada, pistaImagenDesbloqueada, profesorDelDia } = useGameStore()
  const { offsetX, offsetY } = usePosicionEstable(profesorDelDia?.id ?? 'default')
  const [imagenExpandida, setImagenExpandida] = useState(false)

  return (
    <>
      <div className="px-4 max-w-4xl mx-auto w-full mt-5">
        <div className="game-card p-6 sm:p-8">
          <h2 className="text-center text-lg sm:text-xl font-extrabold text-yellow-900 drop-shadow-sm mb-6">
            ¡Adivina el profesor de la FRVM de hoy!
          </h2>

          <div className="flex justify-center gap-6 sm:gap-10">
            <motion.button
              className={`flex flex-col items-center gap-2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 bg-white ${
                pistaAudioDesbloqueada ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
              style={{ borderColor: '#facc15' }}
              whileHover={pistaAudioDesbloqueada ? { scale: 1.05, boxShadow: '0 0 25px rgba(250,204,21,0.4)' } : {}}
              onClick={() => {
                if (pistaAudioDesbloqueada && profesorDelDia?.audio_pista_url) {
                  const audio = new Audio(profesorDelDia.audio_pista_url)
                  audio.play()
                }
              }}
            >
              <svg className="w-10 h-10 text-yellow-500 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-xs font-bold text-gray-700">Pista de voz</span>
              {!pistaAudioDesbloqueada && (
                <span className="text-[10px] text-gray-400 -mt-1">#3</span>
              )}
            </motion.button>

            <motion.button
              className={`flex flex-col items-center gap-2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 bg-white ${
                pistaImagenDesbloqueada ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
              }`}
              style={{ borderColor: '#facc15' }}
              whileHover={pistaImagenDesbloqueada ? { scale: 1.05, boxShadow: '0 0 25px rgba(250,204,21,0.4)' } : {}}
              onClick={() => {
                if (pistaImagenDesbloqueada) setImagenExpandida(true)
              }}
            >
              <svg className="w-10 h-10 text-yellow-500 mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-bold text-gray-700">Pista de foto</span>
              {!pistaImagenDesbloqueada && (
                <span className="text-[10px] text-gray-400 -mt-1">#5</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {imagenExpandida && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImagenExpandida(false)}
          >
            <motion.div
              className="relative w-[80vmin] h-[80vmin] overflow-hidden rounded-2xl border-2 border-yellow-400 shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'rgba(0,0,0,0.4)' }}
            >
              <img
                src={profesorDelDia!.imagen_pista_url}
                alt="Pista visual del profesor"
                className="absolute pointer-events-none"
                style={{
                  width: '250%',
                  height: '250%',
                  maxWidth: 'none',
                  top: `-${offsetY * 3}%`,
                  left: `-${offsetX * 3}%`,
                  opacity: 0.9,
                }}
              />
              <button
                onClick={() => setImagenExpandida(false)}
                className="absolute top-3 right-3 z-10 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/70 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
