import { useGameStore } from '@/store/gameStore'
import { FotoCard } from '@/components/game/FotoCard'
import { BuscadorProfesores } from '@/components/game/BuscadorProfesores'
import { FotoResultados } from '@/components/game/FotoResultados'
import { ContadorAciertos } from '@/components/game/ContadorAciertos'
import { ProfesorAyer } from '@/components/game/ProfesorAyer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function ModoFoto() {
  const fotoProfesor = useGameStore((s) => s.fotoProfesor)
  const fotoCargando = useGameStore((s) => s.fotoCargando)
  const fotoError = useGameStore((s) => s.fotoError)
  const iniciarFotoPartida = useGameStore((s) => s.iniciarFotoPartida)

  if (fotoCargando) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    )
  }

  if (fotoError) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center glass-panel p-8 max-w-md">
          <p className="text-red-400 mb-4">{fotoError}</p>
          <button onClick={iniciarFotoPartida} className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!fotoProfesor) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    )
  }

  return (
    <>
      <FotoCard />
      <BuscadorProfesores />
      <FotoResultados />
      <ContadorAciertos />
      <ProfesorAyer />
    </>
  )
}
