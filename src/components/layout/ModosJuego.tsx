import { motion } from 'framer-motion'

const modos = [
  { id: 'clasico', label: 'Clásico', icon: '/iconos/clasico.png' },
  { id: 'frase', label: 'Frase', icon: '/iconos/frase.png' },
  { id: 'adivina-la-foto', label: 'Adivina la Foto', icon: '/iconos/adivina-la-foto.png' },
  { id: 'ubicacion-utn', label: 'Ubicación UTN', icon: '/iconos/ubicacion-utn.png' },
]

export function ModosJuego() {
  return (
    <div className="grid grid-cols-4 gap-3 px-4 max-w-4xl mx-auto w-full mt-5">
      {modos.map((modo) => (
        <motion.button
          key={modo.id}
          className="flex flex-col items-center gap-2 px-2 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm cursor-not-allowed opacity-70 hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.03 }}
          title="Próximamente"
          disabled
        >
          <img src={modo.icon} alt={modo.label} className="w-10 h-10 object-contain" />
          <span className="text-xs font-medium text-white/85 text-center leading-tight">{modo.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
