import { useGameStore } from '@/store/gameStore'

export function ProfesorAyer() {
  const profesorAyer = useGameStore((s) => s.profesorAyer)

  if (!profesorAyer) return null

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4 pb-8">
      <p className="text-center text-sm text-white/70">
        El profesor de ayer fue:{' '}
        <span className="text-yellow-400 font-bold">{profesorAyer.nombre}</span>
      </p>
    </div>
  )
}
