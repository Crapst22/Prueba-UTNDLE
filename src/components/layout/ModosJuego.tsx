import { useState } from 'react'
import { motion } from 'framer-motion'

const modos = [
  { id: 'clasico', label: 'Clásico', icon: '/iconos/clasico.png' },
  { id: 'frase', label: 'Frase', icon: '/iconos/frase.png' },
  { id: 'adivina-la-foto', label: 'Adivina la Foto', icon: '/iconos/adivina-la-foto.png' },
  { id: 'ubicacion-utn', label: 'Ubicación UTN', icon: '/iconos/ubicacion-utn.png' },
]

export function ModosJuego() {
  const [activo, setActivo] = useState('clasico')

  return (
    <div className="px-4 max-w-4xl mx-auto w-full mt-5">
      <div className="flex justify-center gap-4 sm:gap-6">
        {modos.map((modo) => {
          const isActive = activo === modo.id
          return (
            <motion.button
              key={modo.id}
              onClick={() => setActivo(modo.id)}
              className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                  : 'bg-white/95 border-2 border-yellow-400'
              }`}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{
                boxShadow: isActive
                  ? '0 4px 20px rgba(250,204,21,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={modo.icon}
                alt={modo.label}
                className={`w-7 h-7 sm:w-9 sm:h-9 object-contain ${
                  isActive ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] brightness-110' : ''
                }`}
              />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
