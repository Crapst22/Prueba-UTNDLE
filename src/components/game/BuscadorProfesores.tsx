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
  const { realizarIntento, partida } = useGameStore()

  const deshabilitado = partida?.adivinado || (partida?.intentos.length || 0) >= 6

  const buscar = useCallback(async (termino: string) => {
    if (termino.length < 1) {
      setResultados([])
      setMostrarDropdown(false)
      return
    }

    setCargando(true)
    try {
      const idsSeleccionados = new Set(
        (partida?.intentos || []).map((i) => i.profesor.id)
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
  }, [partida])

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
    setSeleccionado(true)
    setMostrarDropdown(false)
    realizarIntento(profesor)
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
    <div className="relative px-4 max-w-4xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400"
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
            onFocus={() => resultados.length > 0 && setMostrarDropdown(true)}
            placeholder="Escribí el nombre del profesor..."
            disabled={deshabilitado}
            className={`input w-full pl-10 pr-4 py-3 text-sm ${deshabilitado ? 'opacity-50 cursor-not-allowed' : ''}`}
            autoComplete="off"
            aria-label="Buscar profesor"
            role="combobox"
            aria-expanded={mostrarDropdown}
            aria-controls="resultados-busqueda"
          />
          {cargando && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-dark-500 border-t-primary-500 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {mostrarDropdown && resultados.length > 0 && (
          <motion.div
            ref={dropdownRef}
            id="resultados-busqueda"
            className="absolute left-4 right-4 top-full mt-1 bg-dark-800 border border-dark-600 rounded-xl shadow-xl overflow-hidden z-30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {resultados.map((profesor) => (
              <button
                key={profesor.id}
                onClick={() => handleSelect(profesor)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left border-b border-dark-700 last:border-0"
              >
                <ImageWithFallback
                  src={profesor.foto_url}
                  alt={profesor.nombre}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {profesor.nombre}
                  </p>
                  <p className="text-xs text-dark-400 truncate">
                    {profesor.catedras.map((c) => c.nombre).join(', ')}
                  </p>
                </div>
                <svg className="w-4 h-4 text-dark-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
