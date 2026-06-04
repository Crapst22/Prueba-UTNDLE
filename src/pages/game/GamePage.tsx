import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { TopBar } from '@/components/layout/TopBar'
import { ModosJuego } from '@/components/layout/ModosJuego'
import { BarraInfo } from '@/components/game/BarraInfo'
import { PanelPistas } from '@/components/game/PanelPistas'
import { BuscadorProfesores } from '@/components/game/BuscadorProfesores'
import { TablaResultados } from '@/components/game/TablaResultados'
import { FraseCard } from '@/components/game/FraseCard'
import { FraseBuscador } from '@/components/game/FraseBuscador'
import { FraseResultados } from '@/components/game/FraseResultados'
import { ContadorAciertos } from '@/components/game/ContadorAciertos'
import { ProfesorAyer } from '@/components/game/ProfesorAyer'
import { ModalEstadisticas } from '@/components/game/ModalEstadisticas'
import { ModalAyuda } from '@/components/game/ModalAyuda'
import { ModalVictoria } from '@/components/game/ModalVictoria'
import { ModalVictoriaFrase } from '@/components/game/ModalVictoriaFrase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

function ModoClasico() {
  return (
    <>
      <PanelPistas />
      <BuscadorProfesores />
      <TablaResultados />
      <ContadorAciertos />
      <ProfesorAyer />
      <ModalVictoria />
    </>
  )
}

function ModoFrase() {
  const fraseDelDia = useGameStore((s) => s.fraseDelDia)
  const fraseCargando = useGameStore((s) => s.fraseCargando)
  const fraseError = useGameStore((s) => s.fraseError)
  const iniciarFrasePartida = useGameStore((s) => s.iniciarFrasePartida)
  const reiniciarFrasePartida = useGameStore((s) => s.reiniciarFrasePartida)

  if (fraseCargando) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando frase..." />
      </div>
    )
  }

  if (fraseError) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center glass-panel p-8 max-w-md">
          <p className="text-red-400 mb-4">{fraseError}</p>
          <div className="flex justify-center gap-3">
            <button onClick={iniciarFrasePartida} className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900">
              Reintentar
            </button>
            <button onClick={reiniciarFrasePartida} className="gold-border-btn px-6 py-2 text-sm font-bold text-yellow-900">
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!fraseDelDia) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando frase..." />
      </div>
    )
  }

  return (
    <>
      <FraseCard frase={fraseDelDia} />
      <FraseBuscador />
      <FraseResultados />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => { reiniciarFrasePartida(); iniciarFrasePartida() }}
          className="gold-border-btn px-5 py-2 text-sm font-bold text-yellow-900"
        >
          Reiniciar modo frase
        </button>
      </div>
      <ContadorAciertos />
      <ProfesorAyer />
      <ModalVictoriaFrase />
    </>
  )
}

export function GamePage() {
  const modoJuego = useGameStore((s) => s.modoJuego)
  const iniciarPartida = useGameStore((s) => s.iniciarPartida)
  const iniciarFrasePartida = useGameStore((s) => s.iniciarFrasePartida)
  const cargando = useGameStore((s) => s.cargando)
  const error = useGameStore((s) => s.error)

  useEffect(() => {
    if (modoJuego === 'clasico') iniciarPartida()
    else if (modoJuego === 'frase') iniciarFrasePartida()
  }, [modoJuego, iniciarPartida, iniciarFrasePartida])

  const fondo = (
    <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/fondo.jpg)' }} />
  )

  if (modoJuego === 'clasico' && cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {fondo}
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-10">
          <LoadingSpinner size="lg" text="Cargando partida..." />
        </div>
      </div>
    )
  }

  if (modoJuego === 'clasico' && error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {fondo}
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-10 text-center glass-panel p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={iniciarPartida} className="gold-btn px-6 py-2 text-sm font-bold text-yellow-900">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {fondo}
      <div className="fixed inset-0 bg-black/50 pointer-events-none" />
      <div className="relative z-10 flex flex-col min-h-screen pb-8">
        <TopBar />
        <ModosJuego />
        <BarraInfo />

        {modoJuego === 'clasico' && <ModoClasico />}
        {modoJuego === 'frase' && <ModoFrase />}

        <ModalEstadisticas />
        <ModalAyuda />
      </div>
    </div>
  )
}
