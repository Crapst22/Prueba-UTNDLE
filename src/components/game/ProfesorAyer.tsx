import { useGameStore } from '@/store/gameStore'

export function ProfesorAyer() {
  const modoJuego = useGameStore((s) => s.modoJuego)
  const profesorAyer = useGameStore((s) => s.profesorAyer)
  const profesorAyerFrase = useGameStore((s) => s.profesorAyerFrase)
  const profesorAyerFoto = useGameStore((s) => s.profesorAyerFoto)

  const profesor = modoJuego === 'clasico' ? profesorAyer : modoJuego === 'frase' ? profesorAyerFrase : profesorAyerFoto

  if (!profesor) return null

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4 pb-8">
      <p className="text-center text-sm text-white/70">
        El profesor de ayer fue:{' '}
        <span className="text-yellow-400 font-bold">{profesor.nombre}</span>
      </p>
    </div>
  )
}
