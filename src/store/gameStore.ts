import { create } from 'zustand'
import type { Profesor, Intento, PartidaDiaria, Estadisticas, ResultadoComparacion } from '@/types'
import { obtenerProfesorDelDia } from '@/services/profesores'

function obtenerFechaKey(): string {
  return new Date().toISOString().split('T')[0]
}

function cargarPartida(): PartidaDiaria | null {
  try {
    const stored = localStorage.getItem('utndle_partida')
    if (!stored) return null
    const partida = JSON.parse(stored) as PartidaDiaria
    if (partida.fecha === obtenerFechaKey()) return partida
    return null
  } catch {
    return null
  }
}

function guardarPartida(partida: PartidaDiaria) {
  localStorage.setItem('utndle_partida', JSON.stringify(partida))
}

function cargarEstadisticas(): Estadisticas {
  try {
    const stored = localStorage.getItem('utndle_estadisticas')
    if (!stored) {
      return {
        partidasJugadas: 0,
        partidasGanadas: 0,
        rachaActual: 0,
        mejorRacha: 0,
        distribucionIntentos: {},
      }
    }
    return JSON.parse(stored)
  } catch {
    return {
      partidasJugadas: 0,
      partidasGanadas: 0,
      rachaActual: 0,
      mejorRacha: 0,
      distribucionIntentos: {},
    }
  }
}

function guardarEstadisticas(stats: Estadisticas) {
  localStorage.setItem('utndle_estadisticas', JSON.stringify(stats))
}

function compararProfesores(buscado: Profesor, correcto: Profesor): ResultadoComparacion {
  const resultado: ResultadoComparacion = {
    profesor: buscado.id === correcto.id ? 'verde' : 'rojo',
    catedras: 'rojo',
    presencialidad: 'rojo',
    legajo: 'rojo',
    jefe_catedra: 'rojo',
    edad: 'rojo',
  }

  const catedrasBuscado = buscado.catedras.map((c) => c.nombre.toLowerCase())
  const catedrasCorrecto = correcto.catedras.map((c) => c.nombre.toLowerCase())
  const comparteCatedra = catedrasBuscado.some((c) => catedrasCorrecto.includes(c))
  resultado.catedras = comparteCatedra ? 'verde' : 'rojo'

  const presBuscado = buscado.presencialidades.map((p) => p.nombre.toLowerCase())
  const presCorrecto = correcto.presencialidades.map((p) => p.nombre.toLowerCase())
  const presCoincide = presBuscado.some((p) => presCorrecto.includes(p))
  resultado.presencialidad = presCoincide ? 'verde' : 'rojo'

  if (buscado.legajo > correcto.legajo) resultado.legajo = 'bajada'
  else if (buscado.legajo < correcto.legajo) resultado.legajo = 'subida'
  else resultado.legajo = 'verde'

  resultado.jefe_catedra = buscado.jefe_catedra === correcto.jefe_catedra ? 'verde' : 'rojo'

  if (buscado.edad > correcto.edad) resultado.edad = 'bajada'
  else if (buscado.edad < correcto.edad) resultado.edad = 'subida'
  else resultado.edad = 'verde'

  return resultado
}

interface GameState {
  profesorDelDia: Profesor | null
  partida: PartidaDiaria | null
  estadisticas: Estadisticas
  pistaAudioDesbloqueada: boolean
  pistaImagenDesbloqueada: boolean
  cargando: boolean
  error: string | null
  modoJuego: string
  mostrarEstadisticas: boolean
  mostrarAyuda: boolean

  iniciarPartida: () => Promise<void>
  realizarIntento: (profesor: Profesor) => void
  reiniciarEstado: () => void
  setMostrarEstadisticas: (mostrar: boolean) => void
  setMostrarAyuda: (mostrar: boolean) => void
  setModoJuego: (modo: string) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  profesorDelDia: null,
  partida: cargarPartida(),
  estadisticas: cargarEstadisticas(),
  pistaAudioDesbloqueada: false,
  pistaImagenDesbloqueada: false,
  cargando: false,
  error: null,
  modoJuego: 'clasico',
  mostrarEstadisticas: false,
  mostrarAyuda: false,

  iniciarPartida: async () => {
    set({ cargando: true, error: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().partida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const audioDesbloq = partidaExistente.intentos.length >= 3
        const imagenDesbloq = partidaExistente.intentos.length >= 5
        set({
          pistaAudioDesbloqueada: audioDesbloq,
          pistaImagenDesbloqueada: imagenDesbloq,
          cargando: false,
        })
        return
      }

      const profesor = await obtenerProfesorDelDia(fecha)
      if (!profesor) {
        set({ error: 'No hay profesores disponibles', cargando: false })
        return
      }

      const nuevaPartida: PartidaDiaria = {
        fecha,
        profesorId: profesor.id,
        adivinado: false,
        intentos: [],
        tiempoInicio: Date.now(),
      }

      guardarPartida(nuevaPartida)
      set({
        profesorDelDia: profesor,
        partida: nuevaPartida,
        pistaAudioDesbloqueada: false,
        pistaImagenDesbloqueada: false,
        cargando: false,
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cargar la partida', cargando: false })
    }
  },

  realizarIntento: (profesor: Profesor) => {
    const { partida, profesorDelDia, estadisticas } = get()
    if (!partida || !profesorDelDia || partida.adivinado) return

    const resultado = compararProfesores(profesor, profesorDelDia)
    const nuevoIntento: Intento = {
      profesor,
      resultado,
      timestamp: Date.now(),
    }

    const nuevosIntentos = [...partida.intentos, nuevoIntento]
    const adivinado = resultado.profesor === 'verde'
    const audioDesbloq = nuevosIntentos.length >= 3
    const imagenDesbloq = nuevosIntentos.length >= 5

    const partidaActualizada: PartidaDiaria = {
      ...partida,
      intentos: nuevosIntentos,
      adivinado,
      tiempoFin: adivinado ? Date.now() : undefined,
    }

    guardarPartida(partidaActualizada)

    if (adivinado) {
      const nuevasEstadisticas: Estadisticas = {
        ...estadisticas,
        partidasJugadas: estadisticas.partidasJugadas + 1,
        partidasGanadas: estadisticas.partidasGanadas + 1,
        rachaActual: estadisticas.rachaActual + 1,
        mejorRacha: Math.max(estadisticas.mejorRacha, estadisticas.rachaActual + 1),
        distribucionIntentos: {
          ...estadisticas.distribucionIntentos,
          [nuevosIntentos.length]: (estadisticas.distribucionIntentos[nuevosIntentos.length] || 0) + 1,
        },
      }
      guardarEstadisticas(nuevasEstadisticas)
      set({ estadisticas: nuevasEstadisticas })
    }

    if (nuevosIntentos.length >= 6 && !adivinado) {
      const nuevasEstadisticas: Estadisticas = {
        ...estadisticas,
        partidasJugadas: estadisticas.partidasJugadas + 1,
        rachaActual: 0,
        distribucionIntentos: {
          ...estadisticas.distribucionIntentos,
          [0]: (estadisticas.distribucionIntentos[0] || 0) + 1,
        },
      }
      guardarEstadisticas(nuevasEstadisticas)
      set({ estadisticas: nuevasEstadisticas })
    }

    set({
      partida: partidaActualizada,
      pistaAudioDesbloqueada: audioDesbloq,
      pistaImagenDesbloqueada: imagenDesbloq,
    })
  },

  reiniciarEstado: () => {
    const stats = cargarEstadisticas()
    set({
      profesorDelDia: null,
      partida: null,
      estadisticas: stats,
      pistaAudioDesbloqueada: false,
      pistaImagenDesbloqueada: false,
      cargando: false,
      error: null,
    })
  },

  setMostrarEstadisticas: (mostrar) => set({ mostrarEstadisticas: mostrar }),
  setMostrarAyuda: (mostrar) => set({ mostrarAyuda: mostrar }),
  setModoJuego: (modo) => set({ modoJuego: modo }),
}))
