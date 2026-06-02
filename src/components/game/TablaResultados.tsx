import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ResultadoCelda } from '@/components/ui/ResultadoCelda'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { calcularEdad } from '@/utils/edad'

const columnas = [
  { id: 'profesor', label: 'Profesor' },
  { id: 'catedras', label: 'Cátedra' },
  { id: 'presencialidad', label: 'Presencialidad' },
  { id: 'legajo', label: 'Legajo' },
  { id: 'jefe', label: 'Jefe de Cátedra' },
  { id: 'edad', label: 'Edad' },
]

export function TablaResultados() {
  const { partida } = useGameStore()
  const intentos = partida?.intentos ? [...partida.intentos].reverse() : []

  if (intentos.length === 0) {
    return (
      <div className="px-4 max-w-4xl mx-auto w-full mt-5">
        <div className="flex justify-center py-8 text-sm text-white/40">
          Seleccioná un profesor para comenzar
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-5 mb-8">
      {/* Header row */}
      <div
        className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-2 px-1"
        style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
      >
        {columnas.map((col) => (
          <div
            key={col.id}
            className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-yellow-400/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Results rows */}
      <div className="space-y-2">
        {intentos.map((intento, rowIndex) => {
          const globalIndex = intentos.length - 1 - rowIndex

          return (
            <motion.div
              key={intento.timestamp}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: globalIndex * 0.06, duration: 0.3 }}
              className="grid grid-cols-6 gap-1.5 sm:gap-2"
              style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
            >
              <ResultadoCelda
                color={intento.resultado.profesor}
                index={0}
                esFoto
              >
                <ImageWithFallback
                  src={intento.profesor.foto_url}
                  alt={intento.profesor.nombre}
                  className="w-full h-full object-cover"
                />
              </ResultadoCelda>

              <ResultadoCelda
                color={intento.resultado.catedras}
                valor={intento.profesor.catedras.map((c) => c.nombre).join(', ')}
                index={1}
              />

              <ResultadoCelda
                color={intento.resultado.presencialidad}
                valor={intento.profesor.presencialidades.map((p) => p.nombre).join(', ')}
                index={2}
              />

              <ResultadoCelda
                color={intento.resultado.legajo}
                index={3}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{intento.profesor.legajo}</span>
                  {intento.resultado.legajo === 'subida' && (
                    <span className="animate-bounce-arrow text-xs" style={{ color: '#4ade80' }}>↑</span>
                  )}
                  {intento.resultado.legajo === 'bajada' && (
                    <span className="animate-bounce-arrow-down text-xs" style={{ color: '#f87171' }}>↓</span>
                  )}
                </div>
              </ResultadoCelda>

              <ResultadoCelda
                color={intento.resultado.jefe_catedra}
                valor={intento.profesor.jefe_catedra ? 'Sí' : 'No'}
                index={4}
              />

              <ResultadoCelda
                color={intento.resultado.edad}
                index={5}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{calcularEdad(intento.profesor.fecha_nacimiento)}</span>
                  {intento.resultado.edad === 'subida' && (
                    <span className="animate-bounce-arrow text-xs" style={{ color: '#4ade80' }}>↑</span>
                  )}
                  {intento.resultado.edad === 'bajada' && (
                    <span className="animate-bounce-arrow-down text-xs" style={{ color: '#f87171' }}>↓</span>
                  )}
                </div>
              </ResultadoCelda>
            </motion.div>
          )
        })}
      </div>

      {partida?.adivinado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
            border: '1px solid rgba(34,197,94,0.3)',
            boxShadow: '0 0 30px rgba(34,197,94,0.15)',
          }}
        >
          <p className="text-[#22c55e] font-black text-xl">¡Felicitaciones!</p>
          <p className="text-[#22c55e]/70 text-sm mt-1">
            Adivinaste el profesor en {partida.intentos.length} {partida.intentos.length === 1 ? 'intento' : 'intentos'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
