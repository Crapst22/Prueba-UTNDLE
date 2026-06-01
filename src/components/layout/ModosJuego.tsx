import { motion } from 'framer-motion'

const modos = [
  { id: 'clasico', label: 'Clásico', icon: '🎓' },
  { id: 'imagen', label: 'Imagen', icon: '🖼️' },
  { id: 'audio', label: 'Audio', icon: '🎵' },
  { id: 'mixto', label: 'Mixto', icon: '🎲' },
]

export function ModosJuego() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 max-w-4xl mx-auto w-full mt-3">
      {modos.map((modo) => (
        <motion.button
          key={modo.id}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800/60 border border-dark-700 text-dark-300 text-xs font-medium whitespace-nowrap cursor-not-allowed opacity-60"
          whileHover={{ scale: 1.02 }}
          title="Próximamente"
          disabled
        >
          <span>{modo.icon}</span>
          <span>{modo.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
