import { create } from 'zustand'
import type { Profesor, Intento, PartidaDiaria, Estadisticas, ResultadoComparacion, FraseConProfesor, FrasePartida } from '@/types'
import { obtenerProfesorDelDia, obtenerProfesor, obtenerProfesorAleatorio } from '@/services/profesores'
import { obtenerFraseDelDia, obtenerFraseDelDiaAnterior, obtenerFrase } from '@/services/frases'
import { calcularEdad } from '@/utils/edad'

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

function cargarFrasePartida(): FrasePartida | null {
  try {
    const stored = localStorage.getItem('utndle_frase_partida')
    if (!stored) return null
    const partida = JSON.parse(stored) as FrasePartida
    if (partida.fecha === obtenerFechaKey()) return partida
    return null
  } catch {
    return null
  }
}

function guardarFrasePartida(partida: FrasePartida) {
  localStorage.setItem('utndle_frase_partida', JSON.stringify(partida))
}

function obtenerContadorAciertos(): number {
  const key = `utndle_aciertos_${obtenerFechaKey()}`
  try {
    const stored = localStorage.getItem(key)
    if (stored) return parseInt(stored, 10)
    const base = hashFechaSimple(obtenerFechaKey(), 500) + 50
    return base
  } catch {
    return 0
  }
}

function hashFechaSimple(fecha: string, max: number): number {
  let hash = 0
  for (let i = 0; i < fecha.length; i++) {
    const char = fecha.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % max
}

function incrementarContadorAciertos(): number {
  const key = `utndle_aciertos_${obtenerFechaKey()}`
  try {
    const stored = localStorage.getItem(key)
    const actual = stored ? parseInt(stored, 10) : obtenerContadorAciertos()
    const nuevo = actual + 1
    localStorage.setItem(key, nuevo.toString())
    return nuevo
  } catch {
    return 1
  }
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

  const catedrasBuscado = buscado.catedras.map((c) => c.nombre.toLowerCase()).sort()
  const catedrasCorrecto = correcto.catedras.map((c) => c.nombre.toLowerCase()).sort()
  const mismasCatedras = catedrasBuscado.length === catedrasCorrecto.length && catedrasBuscado.every((c, i) => c === catedrasCorrecto[i])
  if (mismasCatedras) {
    resultado.catedras = 'verde'
  } else {
    const comparteCatedra = catedrasBuscado.some((c) => catedrasCorrecto.includes(c))
    if (comparteCatedra) resultado.catedras = 'amarillo'
  }

  const presBuscado = buscado.presencialidades.map((p) => p.nombre.toLowerCase()).sort()
  const presCorrecto = correcto.presencialidades.map((p) => p.nombre.toLowerCase()).sort()
  const mismasPres = presBuscado.length === presCorrecto.length && presBuscado.every((p, i) => p === presCorrecto[i])
  if (mismasPres) {
    resultado.presencialidad = 'verde'
  } else {
    const presCoincide = presBuscado.some((p) => presCorrecto.includes(p))
    if (presCoincide) resultado.presencialidad = 'amarillo'
  }

  const edadBuscado = calcularEdad(buscado.fecha_nacimiento)
  const edadCorrecto = calcularEdad(correcto.fecha_nacimiento)
  if (edadBuscado > edadCorrecto) resultado.edad = 'bajada'
  else if (edadBuscado < edadCorrecto) resultado.edad = 'subida'
  else resultado.edad = 'verde'

  resultado.jefe_catedra = buscado.jefe_catedra === correcto.jefe_catedra ? 'verde' : 'rojo'

  if (buscado.legajo > correcto.legajo) resultado.legajo = 'bajada'
  else if (buscado.legajo < correcto.legajo) resultado.legajo = 'subida'
  else resultado.legajo = 'verde'

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
  mostrarVictoria: boolean

  // Frase mode state
  fraseDelDia: FraseConProfesor | null
  frasePartida: FrasePartida | null
  fraseAdivinado: boolean
  fraseCargando: boolean
  fraseError: string | null
  contadorAciertos: number
  profesorAyer: Profesor | null
  mostrarVictoriaFrase: boolean

  iniciarPartida: () => Promise<void>
  realizarIntento: (profesor: Profesor) => void
  reiniciarEstado: () => void
  reiniciarPartida: () => void
  cambiarProfesorDelDia: () => Promise<void>
  setMostrarEstadisticas: (mostrar: boolean) => void
  setMostrarAyuda: (mostrar: boolean) => void
  setModoJuego: (modo: string) => void

  // Frase mode actions
  iniciarFrasePartida: () => Promise<void>
  realizarIntentoFrase: (profesor: Profesor) => void
  setMostrarVictoriaFrase: (mostrar: boolean) => void
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
  mostrarVictoria: false,

  fraseDelDia: null,
  frasePartida: cargarFrasePartida(),
  fraseAdivinado: false,
  fraseCargando: false,
  fraseError: null,
  contadorAciertos: obtenerContadorAciertos(),
  profesorAyer: null,
  mostrarVictoriaFrase: false,

  iniciarPartida: async () => {
    set({ cargando: true, error: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().partida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const profesor = await obtenerProfesor(partidaExistente.profesorId)
        const audioDesbloq = partidaExistente.intentos.length >= 3
        const imagenDesbloq = partidaExistente.intentos.length >= 5
        set({
          profesorDelDia: profesor,
          pistaAudioDesbloqueada: audioDesbloq,
          pistaImagenDesbloqueada: imagenDesbloq,
          cargando: false,
          mostrarVictoria: false,
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
        mostrarVictoria: false,
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

    if (adivinado) {
      const delay = (nuevosIntentos.length - 1) * 80 + 1500
      setTimeout(() => {
        set({ mostrarVictoria: true })
      }, delay)
    }
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
      mostrarVictoria: false,
    })
  },

  reiniciarPartida: () => {
    localStorage.removeItem('utndle_partida')
    set({
      profesorDelDia: null,
      partida: null,
      pistaAudioDesbloqueada: false,
      pistaImagenDesbloqueada: false,
      cargando: false,
      error: null,
      mostrarVictoria: false,
    })
  },

  cambiarProfesorDelDia: async () => {
    set({ cargando: true, error: null })
    try {
      const profesorActual = get().profesorDelDia
      const profesor = await obtenerProfesorAleatorio(profesorActual?.id)
      if (!profesor) {
        set({ error: 'No hay profesores disponibles', cargando: false })
        return
      }
      const fecha = obtenerFechaKey()
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
        mostrarVictoria: false,
      })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cambiar profesor', cargando: false })
    }
  },

  setMostrarEstadisticas: (mostrar) => set({ mostrarEstadisticas: mostrar }),
  setMostrarAyuda: (mostrar) => set({ mostrarAyuda: mostrar }),
  setModoJuego: (modo) => set({ modoJuego: modo }),

  iniciarFrasePartida: async () => {
    set({ fraseCargando: true, fraseError: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().frasePartida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const frase = await obtenerFrase(partidaExistente.fraseId)
        if (frase) {
          set({
            fraseDelDia: frase,
            fraseAdivinado: partidaExistente.adivinado,
            contadorAciertos: obtenerContadorAciertos(),
            fraseCargando: false,
            mostrarVictoriaFrase: false,
          })
          return
        }
      }

      const frase = await obtenerFraseDelDia(fecha)
      if (!frase) {
        set({ fraseError: 'No hay frases disponibles', fraseCargando: false })
        return
      }

      const nuevaPartida: FrasePartida = {
        fecha,
        fraseId: frase.id,
        profesorId: frase.profesor.id,
        adivinado: false,
        intentos: 0,
        tiempoInicio: Date.now(),
      }

      guardarFrasePartida(nuevaPartida)

      const fraseAyer = await obtenerFraseDelDiaAnterior(fecha)

      set({
        fraseDelDia: frase,
        frasePartida: nuevaPartida,
        fraseAdivinado: false,
        contadorAciertos: obtenerContadorAciertos(),
        profesorAyer: fraseAyer?.profesor || null,
        fraseCargando: false,
        mostrarVictoriaFrase: false,
      })
    } catch (err) {
      set({ fraseError: err instanceof Error ? err.message : 'Error al cargar la frase', fraseCargando: false })
    }
  },

  realizarIntentoFrase: (profesor: Profesor) => {
    const { fraseDelDia, frasePartida, estadisticas } = get()
    if (!fraseDelDia || !frasePartida || frasePartida.adivinado) return

    const esCorrecto = profesor.id === fraseDelDia.profesor.id
    const nuevosIntentos = frasePartida.intentos + 1

    const partidaActualizada: FrasePartida = {
      ...frasePartida,
      intentos: nuevosIntentos,
      adivinado: esCorrecto,
      tiempoFin: esCorrecto ? Date.now() : undefined,
    }

    guardarFrasePartida(partidaActualizada)

    if (esCorrecto) {
      const nuevasEstadisticas: Estadisticas = {
        ...estadisticas,
        partidasJugadas: estadisticas.partidasJugadas + 1,
        partidasGanadas: estadisticas.partidasGanadas + 1,
        rachaActual: estadisticas.rachaActual + 1,
        mejorRacha: Math.max(estadisticas.mejorRacha, estadisticas.rachaActual + 1),
        distribucionIntentos: {
          ...estadisticas.distribucionIntentos,
          [nuevosIntentos]: (estadisticas.distribucionIntentos[nuevosIntentos] || 0) + 1,
        },
      }
      guardarEstadisticas(nuevasEstadisticas)
      set({ estadisticas: nuevasEstadisticas })

      const nuevoContador = incrementarContadorAciertos()
      set({ contadorAciertos: nuevoContador })
    }

    set({
      frasePartida: partidaActualizada,
      fraseAdivinado: esCorrecto,
    })

    if (esCorrecto) {
      setTimeout(() => {
        set({ mostrarVictoriaFrase: true })
      }, 800)
    }
  },

  setMostrarVictoriaFrase: (mostrar) => set({ mostrarVictoriaFrase: mostrar }),
}))
