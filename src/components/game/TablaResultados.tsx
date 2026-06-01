import { motion } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { ResultadoCelda } from '@/components/ui/ResultadoCelda'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'

export function TablaResultados() {
  const { partida } = useGameStore()

  if (!partida || partida.intentos.length === 0) {
    return null
  }

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-4 overflow-x-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-w-[600px]"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="px-3 py-2 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">Profesor</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wider">Cátedra/s</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wider">Presencialidad</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wider">Legajo</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wider">Jefe</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-dark-400 uppercase tracking-wider">Edad</th>
            </tr>
          </thead>
          <tbody>
            {partida.intentos.map((intento, index) => (
              <motion.tr
                key={intento.timestamp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-dark-800 hover:bg-dark-800/30 transition-colors"
              >
                <ResultadoCelda color={intento.resultado.profesor} delay={0.1}>
                  <div className="flex items-center gap-2">
                    <ImageWithFallback
                      src={intento.profesor.foto_url}
                      alt={intento.profesor.nombre}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-xs font-medium truncate max-w-[100px]">
                      {intento.profesor.nombre}
                    </span>
                  </div>
                </ResultadoCelda>

                <ResultadoCelda color={intento.resultado.catedras} delay={0.2}>
                  <span className="text-xs leading-tight line-clamp-2">
                    {intento.profesor.catedras.map((c) => c.nombre).join(', ')}
                  </span>
                </ResultadoCelda>

                <ResultadoCelda color={intento.resultado.presencialidad} delay={0.3}>
                  <span className="text-xs">
                    {intento.profesor.presencialidades.map((p) => p.nombre).join(', ')}
                  </span>
                </ResultadoCelda>

                <ResultadoCelda color={intento.resultado.legajo} delay={0.4}>
                  <span className="font-mono text-xs">{intento.profesor.legajo}</span>
                </ResultadoCelda>

                <ResultadoCelda color={intento.resultado.jefe_catedra} delay={0.5}>
                  <span className="text-xs">{intento.profesor.jefe_catedra ? 'Sí' : 'No'}</span>
                </ResultadoCelda>

                <ResultadoCelda color={intento.resultado.edad} delay={0.6}>
                  <span className="font-mono text-xs">{intento.profesor.edad}</span>
                </ResultadoCelda>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
