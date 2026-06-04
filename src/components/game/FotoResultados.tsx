import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
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

export function FotoResultados() {
  const fotoPartida = useGameStore((s) => s.fotoPartida)
  const fotoProfesor = useGameStore((s) => s.fotoProfesor)

  if (!fotoPartida) return null

  const intentos = [...fotoPartida.intentos].reverse()

  if (intentos.length === 0) return null

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-5 mb-8">
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

      <div className="space-y-2">
        {intentos.map((intento, rowIndex) => {
          const globalIndex = intentos.length - 1 - rowIndex
          const isCorrecto = intento.resultado.profesor === 'verde'

          return (
            <motion.div
              key={intento.timestamp}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{
                delay: globalIndex * 0.08,
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: 1000,
              }}
              className="grid grid-cols-6 gap-1.5 sm:gap-2"
            >
              {[
                {
                  col: 0,
                  color: intento.resultado.profesor,
                  children: (
                    <ImageWithFallback
                      src={intento.profesor.foto_url}
                      alt={intento.profesor.nombre}
                      className="w-full h-full object-cover"
                    />
                  ),
                },
                {
                  col: 1,
                  color: intento.resultado.catedras,
                  valor: intento.profesor.catedras.map((c) => c.nombre).join(', '),
                },
                {
                  col: 2,
                  color: intento.resultado.presencialidad,
                  valor: intento.profesor.presencialidades.map((p) => p.nombre).join(', '),
                },
                {
                  col: 3,
                  color: intento.resultado.legajo,
                  children: (
                    <div className="flex items-center justify-center gap-1">
                      <span>{intento.profesor.legajo}</span>
                      {intento.resultado.legajo === 'subida' && (
                        <span className="animate-bounce-arrow text-xs" style={{ color: '#4ade80' }}>↑</span>
                      )}
                      {intento.resultado.legajo === 'bajada' && (
                        <span className="animate-bounce-arrow-down text-xs" style={{ color: '#f87171' }}>↓</span>
                      )}
                    </div>
                  ),
                },
                {
                  col: 4,
                  color: intento.resultado.jefe_catedra,
                  valor: intento.profesor.jefe_catedra ? 'Sí' : 'No',
                },
                {
                  col: 5,
                  color: intento.resultado.edad,
                  children: (
                    <div className="flex items-center justify-center gap-1">
                      <span>{calcularEdad(intento.profesor.fecha_nacimiento)}</span>
                      {intento.resultado.edad === 'subida' && (
                        <span className="animate-bounce-arrow text-xs" style={{ color: '#4ade80' }}>↑</span>
                      )}
                      {intento.resultado.edad === 'bajada' && (
                        <span className="animate-bounce-arrow-down text-xs" style={{ color: '#f87171' }}>↓</span>
                      )}
                    </div>
                  ),
                },
              ].map((celda) => (
                <motion.div
                  key={celda.col}
                  className="rounded-lg overflow-hidden"
                  style={{
                    aspectRatio: '1',
                    background: isCorrecto
                      ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))'
                      : celda.color === 'verde'
                        ? 'rgba(34,197,94,0.15)'
                        : celda.color === 'amarillo'
                          ? 'rgba(250,204,21,0.15)'
                          : celda.color === 'subida' || celda.color === 'bajada'
                            ? 'rgba(148,163,184,0.15)'
                            : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${
                      isCorrecto
                        ? 'rgba(34,197,94,0.3)'
                        : celda.color === 'verde'
                          ? 'rgba(34,197,94,0.3)'
                          : celda.color === 'amarillo'
                            ? 'rgba(250,204,21,0.3)'
                            : celda.color === 'subida' || celda.color === 'bajada'
                              ? 'rgba(148,163,184,0.2)'
                              : 'rgba(239,68,68,0.2)'
                    }`,
                  }}
                >
                  {'children' in celda && celda.children}
                  {'valor' in celda && (
                    <div className="w-full h-full flex items-center justify-center px-1">
                      <span className="text-[10px] sm:text-xs leading-tight text-center text-white/80 font-medium line-clamp-2">
                        {celda.valor}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )
        })}
      </div>

      {fotoPartida.adivinado && fotoProfesor && (
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
            Adivinaste el profesor en {fotoPartida.intentos.length} {fotoPartida.intentos.length === 1 ? 'intento' : 'intentos'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
