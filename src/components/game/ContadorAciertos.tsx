import { useGameStore } from '@/store/gameStore'

export function ContadorAciertos() {
  const modoJuego = useGameStore((s) => s.modoJuego)
  const contadorAciertos = useGameStore((s) => s.contadorAciertos)
  const contadorAciertosFrase = useGameStore((s) => s.contadorAciertosFrase)

  const contador = modoJuego === 'clasico' ? contadorAciertos : contadorAciertosFrase

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4">
      <p className="text-center text-sm text-white/70">
        <span className="text-yellow-400 font-bold">{contador}</span>{' '}
        {contador === 1 ? 'persona ya lo adivinó hoy' : 'personas ya lo adivinaron hoy'}
      </p>
    </div>
  )
}
