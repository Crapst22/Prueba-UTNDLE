import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ResultadoCelda } from '@/components/ui/ResultadoCelda'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

function IconoProfesor() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function IconoCatedra() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function IconoPresencialidad() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconoLegajo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function IconoJefe() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function IconoEdad() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

const columnas = [
  { id: 'profesor', label: 'Profesor', icono: <IconoProfesor /> },
  { id: 'catedras', label: 'Cátedra/s', icono: <IconoCatedra /> },
  { id: 'presencialidad', label: 'Presencialidad', icono: <IconoPresencialidad /> },
  { id: 'legajo', label: 'Legajo', icono: <IconoLegajo /> },
  { id: 'jefe', label: 'Jefe', icono: <IconoJefe /> },
  { id: 'edad', label: 'Edad', icono: <IconoEdad /> },
]

export function TablaResultados() {
  const { partida } = useGameStore()
  const intentos = partida?.intentos ? [...partida.intentos].reverse() : []

  if (intentos.length === 0) {
    return (
      <div className="px-4 max-w-4xl mx-auto w-full mt-4">
        <div className="flex justify-center py-10 text-sm text-dark-400/70">
          Seleccioná un profesor para comenzar
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4">
      <div className="grid grid-cols-6 gap-2 mb-2">
        {columnas.map((col) => (
          <div key={col.id} className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-dark-400/70">
            {col.icono}
            {col.label}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {intentos.map((intento, index) => {
          const rowDelay = (intentos.length - 1 - index) * 0.08

          return (
            <motion.div
              key={intento.timestamp}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowDelay }}
              className="grid grid-cols-6 gap-2"
            >
              <ResultadoCelda
                color={intento.resultado.profesor}
                delay={rowDelay}
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
                delay={rowDelay + 0.15}
              />

              <ResultadoCelda
                color={intento.resultado.presencialidad}
                valor={intento.profesor.presencialidades.map((p) => p.nombre).join(', ')}
                delay={rowDelay + 0.3}
              />

              <ResultadoCelda
                color={intento.resultado.legajo}
                valor={String(intento.profesor.legajo)}
                delay={rowDelay + 0.45}
              />

              <ResultadoCelda
                color={intento.resultado.jefe_catedra}
                valor={intento.profesor.jefe_catedra ? 'Sí' : 'No'}
                delay={rowDelay + 0.6}
              />

              <ResultadoCelda
                color={intento.resultado.edad}
                valor={String(intento.profesor.edad)}
                delay={rowDelay + 0.75}
              />
            </motion.div>
          )
        })}
      </div>

      {partida?.adivinado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl text-center shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        >
          <p className="text-[#22c55e] font-bold text-lg">¡Felicitaciones!</p>
          <p className="text-[#22c55e]/80 text-sm">Adivinaste el profesor en {partida.intentos.length} {partida.intentos.length === 1 ? 'intento' : 'intentos'}</p>
        </motion.div>
      )}
    </div>
  )
}
