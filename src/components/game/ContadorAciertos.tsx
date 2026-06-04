import { useGameStore } from '@/store/gameStore'

export function ContadorAciertos() {
  const contadorAciertos = useGameStore((s) => s.contadorAciertos)

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4">
      <p className="text-center text-sm text-white/70">
        <span className="text-yellow-400 font-bold">{contadorAciertos}</span>{' '}
        {contadorAciertos === 1 ? 'persona ya lo adivinó hoy' : 'personas ya lo adivinaron hoy'}
      </p>
    </div>
  )
}
