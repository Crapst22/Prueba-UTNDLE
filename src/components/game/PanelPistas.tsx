import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

function PosicionAleatoria() {
  const offsetX = useMemo(() => Math.floor(Math.random() * 60), [])
  const offsetY = useMemo(() => Math.floor(Math.random() * 60), [])
  return { offsetX, offsetY }
}

export function PanelPistas() {
  const { pistaAudioDesbloqueada, pistaImagenDesbloqueada, profesorDelDia } = useGameStore()
  const { offsetX, offsetY } = PosicionAleatoria()
  const [imagenExpandida, setImagenExpandida] = useState(false)

  return (
    <>
    <div className="flex gap-3 px-4 py-3 max-w-4xl mx-auto w-full">
      <div className="flex-1">
        <motion.div
          className={`card h-28 flex flex-col items-center justify-center gap-2 ${!pistaAudioDesbloqueada ? 'opacity-50' : ''}`}
          whileHover={pistaAudioDesbloqueada ? { scale: 1.02 } : {}}
        >
          {pistaAudioDesbloqueada && profesorDelDia?.audio_pista_url ? (
            <>
              <p className="text-xs text-dark-400 font-medium">Pista de Voz</p>
              <audio
                controls
                src={profesorDelDia.audio_pista_url}
                className="w-full max-w-[200px] h-8"
                preload="none"
              >
                Tu navegador no soporta audio.
              </audio>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-dark-500 font-medium">
                Se desbloquea en el intento #3
              </p>
            </>
          )}
        </motion.div>
      </div>

      <div className="flex-1">
        <motion.div
          className={`card h-28 flex flex-col items-center justify-center gap-2 ${!pistaImagenDesbloqueada ? 'opacity-50' : ''}`}
          whileHover={pistaImagenDesbloqueada ? { scale: 1.02 } : {}}
        >
          {pistaImagenDesbloqueada && profesorDelDia?.imagen_pista_url ? (
            <>
              <p className="text-xs text-dark-400 font-medium">Pista Visual</p>
              <div
                className="relative w-24 h-24 overflow-hidden rounded-lg border border-dark-600 cursor-pointer"
                onClick={() => setImagenExpandida(true)}
              >
                <img
                  src={profesorDelDia.imagen_pista_url}
                  alt="Pista visual del profesor"
                  className="absolute pointer-events-none"
                  style={{
                    width: '250%',
                    height: '250%',
                    maxWidth: 'none',
                    top: `-${offsetY * 3}%`,
                    left: `-${offsetX * 3}%`,
                    opacity: 0.85,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-dark-500 font-medium">
                Se desbloquea en el intento #5
              </p>
            </>
          )}
        </motion.div>
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
              className="relative w-[80vmin] h-[80vmin] overflow-hidden rounded-2xl border border-dark-600 shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={profesorDelDia!.imagen_pista_url}
                alt="Pista visual del profesor"
                className="absolute pointer-events-none"
                style={{
                  width: '400%',
                  height: '400%',
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
