import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buscarProfesores } from '@/services/profesores'
import { useGameStore } from '@/store/gameStore'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import type { Profesor } from '@/types'

export function BuscadorProfesores() {
  const [termino, setTermino] = useState('')
  const [resultados, setResultados] = useState<Profesor[]>([])
  const [cargando, setCargando] = useState(false)
  const [seleccionado, setSeleccionado] = useState(false)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number | undefined>(undefined)
  const { realizarIntento, realizarIntentoFoto, partida, fotoPartida, modoJuego } = useGameStore()

  const partidaActiva = modoJuego === 'adivina-la-foto' ? fotoPartida : partida
  const handleIntento = modoJuego === 'adivina-la-foto' ? realizarIntentoFoto : realizarIntento

  const deshabilitado = partidaActiva?.adivinado

  const buscar = useCallback(async (termino: string) => {
    if (termino.length < 1) {
      setResultados([])
      setMostrarDropdown(false)
      return
    }

    setCargando(true)
    try {
      const idsSeleccionados = new Set(
        (partidaActiva?.intentos || []).map((i) => i.profesor.id)
      )
      const profesores = await buscarProfesores(termino)
      const filtrados = profesores.filter((p) => !idsSeleccionados.has(p.id))
      setResultados(filtrados)
      setMostrarDropdown(filtrados.length > 0)
    } catch {
      setResultados([])
    } finally {
      setCargando(false)
    }
  }, [partidaActiva])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (seleccionado) return

    timeoutRef.current = setTimeout(() => {
      buscar(termino)
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [termino, buscar, seleccionado])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setMostrarDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (profesor: Profesor) => {
    setTermino('')
    setResultados([])
    setSeleccionado(true)
    setMostrarDropdown(false)
    handleIntento(profesor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTermino(value)
    setSeleccionado(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (resultados.length === 1 && !seleccionado) {
      handleSelect(resultados[0])
    }
  }

  return (
    <div className="relative px-4 max-w-4xl mx-auto w-full mt-5">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={termino}
            onChange={handleInputChange}
            onFocus={() => termino.length > 0 && resultados.length > 0 && setMostrarDropdown(true)}
            placeholder="Escribe el nombre del profesor..."
            disabled={deshabilitado}
            className={`game-input w-full pl-12 pr-4 ${deshabilitado ? 'opacity-50 cursor-not-allowed' : ''}`}
            autoComplete="off"
            aria-label="Buscar profesor"
            role="combobox"
            aria-expanded={mostrarDropdown}
            aria-controls="resultados-busqueda"
          />
          {cargando && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={deshabilitado || termino.length === 0}
          className="gold-btn w-14 h-14 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Enviar"
        >
          <svg className="w-6 h-6 text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </form>

      <AnimatePresence>
        {mostrarDropdown && resultados.length > 0 && (
          <motion.div
            ref={dropdownRef}
            id="resultados-busqueda"
            className="absolute left-4 right-20 top-full mt-2 rounded-2xl overflow-hidden z-30"
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {resultados.map((profesor) => (
              <button
                key={profesor.id}
                onClick={() => handleSelect(profesor)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                <ImageWithFallback
                  src={profesor.foto_url}
                  alt={profesor.nombre}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-yellow-400/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {profesor.nombre}
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {profesor.catedras.map((c) => c.nombre).join(', ')}
                  </p>
                </div>
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
