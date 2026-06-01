import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { TopBar } from '@/components/layout/TopBar'
import { ModosJuego } from '@/components/layout/ModosJuego'
import { PanelPistas } from '@/components/game/PanelPistas'
import { BuscadorProfesores } from '@/components/game/BuscadorProfesores'
import { TablaResultados } from '@/components/game/TablaResultados'
import { ModalEstadisticas } from '@/components/game/ModalEstadisticas'
import { ModalAyuda } from '@/components/game/ModalAyuda'
import { ModalVictoria } from '@/components/game/ModalVictoria'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function GamePage() {
  const { iniciarPartida, partida, cargando, error } = useGameStore()

  useEffect(() => {
    if (!partida) {
      iniciarPartida()
    }
  }, [partida, iniciarPartida])

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando partida..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={iniciarPartida} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <ModosJuego />
      <PanelPistas />
      <BuscadorProfesores />
      <TablaResultados />
      <ModalEstadisticas />
      <ModalAyuda />
      <ModalVictoria />
    </div>
  )
}
