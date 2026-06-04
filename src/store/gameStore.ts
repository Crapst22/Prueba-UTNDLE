import { create } from 'zustand'
import type { Profesor, Intento, PartidaDiaria, Estadisticas, ResultadoComparacion, FraseConProfesor, FrasePartida, IntentoFrase, FotoPartida } from '@/types'
import { obtenerProfesorDelDia, obtenerProfesor, obtenerProfesorAleatorio, obtenerProfesorFotoDelDia } from '@/services/profesores'
import { obtenerFraseDelDia, obtenerFrase, obtenerFraseAleatoria } from '@/services/frases'
import { guardarProfesorDiario, obtenerProfesorDiario, obtenerContadorAciertos as obtenerContadorDB, incrementarContadorAciertos as incrementarContadorDB } from '@/services/diario'
import { calcularEdad } from '@/utils/edad'

function obtenerFechaKey(): string {
  return new Date().toISOString().split('T')[0]
}

function obtenerFechaAnteriorKey(): string {
  const ayer = new Date()
  ayer.setDate(ayer.getDate() - 1)
  return ayer.toISOString().split('T')[0]
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

function cargarEstadisticasFrase(): Estadisticas {
  try {
    const stored = localStorage.getItem('utndle_estadisticas_frase')
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

function guardarEstadisticasFrase(stats: Estadisticas) {
  localStorage.setItem('utndle_estadisticas_frase', JSON.stringify(stats))
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

function cargarEstadisticasFoto(): Estadisticas {
  try {
    const stored = localStorage.getItem('utndle_estadisticas_foto')
    if (!stored) {
      return { partidasJugadas: 0, partidasGanadas: 0, rachaActual: 0, mejorRacha: 0, distribucionIntentos: {} }
    }
    return JSON.parse(stored)
  } catch {
    return { partidasJugadas: 0, partidasGanadas: 0, rachaActual: 0, mejorRacha: 0, distribucionIntentos: {} }
  }
}

function guardarEstadisticasFoto(stats: Estadisticas) {
  localStorage.setItem('utndle_estadisticas_foto', JSON.stringify(stats))
}

function cargarFotoPartida(): FotoPartida | null {
  try {
    const stored = localStorage.getItem('utndle_foto_partida')
    if (!stored) return null
    const partida = JSON.parse(stored) as FotoPartida
    if (partida.fecha === obtenerFechaKey()) return partida
    return null
  } catch {
    return null
  }
}

function guardarFotoPartida(partida: FotoPartida) {
  localStorage.setItem('utndle_foto_partida', JSON.stringify(partida))
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
  estadisticasFrase: Estadisticas
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
  contadorAciertosFrase: number
  profesorAyer: Profesor | null
  profesorAyerFrase: Profesor | null
  estadisticasFoto: Estadisticas
  fotoProfesor: Profesor | null
  fotoPartida: FotoPartida | null
  fotoCargando: boolean
  fotoError: string | null
  contadorAciertosFoto: number
  profesorAyerFoto: Profesor | null

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
  reiniciarFrasePartida: () => void
  cambiarFraseDelDia: () => Promise<void>

  // Foto mode actions
  iniciarFotoPartida: () => Promise<void>
  realizarIntentoFoto: (profesor: Profesor) => void
  reiniciarFotoPartida: () => void
  cambiarFotoDelDia: () => Promise<void>
}

export const useGameStore = create<GameState>((set, get) => ({
  profesorDelDia: null,
  partida: cargarPartida(),
  estadisticas: cargarEstadisticas(),
  estadisticasFrase: cargarEstadisticasFrase(),
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
  contadorAciertos: 0,
  contadorAciertosFrase: 0,
  profesorAyer: null,
  profesorAyerFrase: null,
  estadisticasFoto: cargarEstadisticasFoto(),
  fotoProfesor: null,
  fotoPartida: cargarFotoPartida(),
  fotoCargando: false,
  fotoError: null,
  contadorAciertosFoto: 0,
  profesorAyerFoto: null,

  iniciarPartida: async () => {
    set({ cargando: true, error: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().partida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const profesor = await obtenerProfesor(partidaExistente.profesorId)
        const audioDesbloq = partidaExistente.intentos.length >= 3
        const imagenDesbloq = partidaExistente.intentos.length >= 5
        const [contador, profesorAyer] = await Promise.all([
          obtenerContadorDB(fecha, 'clasico'),
          obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'clasico').catch(() => null),
        ])
        set({
          profesorDelDia: profesor,
          pistaAudioDesbloqueada: audioDesbloq,
          pistaImagenDesbloqueada: imagenDesbloq,
          contadorAciertos: contador,
          profesorAyer: partidaExistente.adivinado ? profesor : profesorAyer,
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

      await guardarProfesorDiario(fecha, 'clasico', profesor.id)

      const nuevaPartida: PartidaDiaria = {
        fecha,
        profesorId: profesor.id,
        adivinado: false,
        intentos: [],
        tiempoInicio: Date.now(),
      }

      guardarPartida(nuevaPartida)

      const [contador, profesorAyer] = await Promise.all([
        obtenerContadorDB(fecha, 'clasico'),
        obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'clasico').catch(() => null),
      ])

      set({
        profesorDelDia: profesor,
        partida: nuevaPartida,
        pistaAudioDesbloqueada: false,
        pistaImagenDesbloqueada: false,
        contadorAciertos: contador,
        profesorAyer: profesorAyer,
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

      incrementarContadorDB(obtenerFechaKey(), 'clasico').then((nuevo) => {
        set({ contadorAciertos: nuevo, profesorAyer: profesorDelDia })
      })
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
  setModoJuego: (modo) => {
    set({
      modoJuego: modo,
      fraseCargando: modo === 'frase',
      fraseError: null,
      fotoCargando: modo === 'adivina-la-foto',
      fotoError: null,
    })
  },

  iniciarFrasePartida: async () => {
    set({ fraseCargando: true, fraseError: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().frasePartida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const frase = await obtenerFrase(partidaExistente.fraseId)
        if (frase) {
          const [contador, profesorAyer] = await Promise.all([
            obtenerContadorDB(fecha, 'frase'),
            obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'frase').catch(() => null),
          ])
          set({
            fraseDelDia: frase,
            fraseAdivinado: partidaExistente.adivinado,
            contadorAciertosFrase: contador,
            profesorAyerFrase: partidaExistente.adivinado ? frase.profesor : profesorAyer,
            fraseCargando: false,
          })
          return
        }
      }

      const frase = await obtenerFraseDelDia(fecha)
      if (!frase) {
        set({ fraseError: 'No hay frases disponibles', fraseCargando: false })
        return
      }

      await guardarProfesorDiario(fecha, 'frase', frase.profesor.id)

      const nuevaPartida: FrasePartida = {
        fecha,
        fraseId: frase.id,
        profesorId: frase.profesor.id,
        adivinado: false,
        intentos: 0,
        intentosList: [],
        tiempoInicio: Date.now(),
      }

      guardarFrasePartida(nuevaPartida)

      const [contador, profesorAyer] = await Promise.all([
        obtenerContadorDB(fecha, 'frase'),
        obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'frase').catch(() => null),
      ])

      set({
        fraseDelDia: frase,
        frasePartida: nuevaPartida,
        fraseAdivinado: false,
        contadorAciertosFrase: contador,
        profesorAyerFrase: profesorAyer,
        fraseCargando: false,
      })
    } catch (err) {
      set({ fraseError: err instanceof Error ? err.message : 'Error al cargar la frase', fraseCargando: false })
    }
  },

  realizarIntentoFrase: (profesor: Profesor) => {
    const { fraseDelDia, frasePartida, estadisticasFrase } = get()
    if (!fraseDelDia || !frasePartida || frasePartida.adivinado) return

    const esCorrecto = profesor.id === fraseDelDia.profesor.id
    const nuevoIntentoFrase: IntentoFrase = {
      profesor,
      correcto: esCorrecto,
      timestamp: Date.now(),
    }

    const nuevosIntentosList = [...frasePartida.intentosList, nuevoIntentoFrase]
    const nuevosIntentos = frasePartida.intentos + 1

    const partidaActualizada: FrasePartida = {
      ...frasePartida,
      intentos: nuevosIntentos,
      intentosList: nuevosIntentosList,
      adivinado: esCorrecto,
      tiempoFin: esCorrecto ? Date.now() : undefined,
    }

    guardarFrasePartida(partidaActualizada)

    if (esCorrecto) {
      const nuevasEstadisticas: Estadisticas = {
        ...estadisticasFrase,
        partidasJugadas: estadisticasFrase.partidasJugadas + 1,
        partidasGanadas: estadisticasFrase.partidasGanadas + 1,
        rachaActual: estadisticasFrase.rachaActual + 1,
        mejorRacha: Math.max(estadisticasFrase.mejorRacha, estadisticasFrase.rachaActual + 1),
        distribucionIntentos: {
          ...estadisticasFrase.distribucionIntentos,
          [nuevosIntentos]: (estadisticasFrase.distribucionIntentos[nuevosIntentos] || 0) + 1,
        },
      }
      guardarEstadisticasFrase(nuevasEstadisticas)
      set({ estadisticasFrase: nuevasEstadisticas })

      incrementarContadorDB(obtenerFechaKey(), 'frase').then((nuevo) => {
        set({ contadorAciertosFrase: nuevo, profesorAyerFrase: fraseDelDia.profesor })
      })
    }

    set({
      frasePartida: partidaActualizada,
      fraseAdivinado: esCorrecto,
    })

  },

  reiniciarFrasePartida: () => {
    localStorage.removeItem('utndle_frase_partida')
    set({
      fraseDelDia: null,
      frasePartida: null,
      fraseAdivinado: false,
      fraseCargando: true,
      fraseError: null,
      contadorAciertosFrase: 0,
      profesorAyerFrase: null,
    })
  },

  cambiarFraseDelDia: async () => {
    set({ fraseCargando: true, fraseError: null })
    try {
      const frase = await obtenerFraseAleatoria()
      if (!frase) {
        set({ fraseError: 'No hay frases disponibles', fraseCargando: false })
        return
      }
      const fecha = obtenerFechaKey()
      const nuevaPartida: FrasePartida = {
        fecha,
        fraseId: frase.id,
        profesorId: frase.profesor.id,
        adivinado: false,
        intentos: 0,
        intentosList: [],
        tiempoInicio: Date.now(),
      }
      guardarFrasePartida(nuevaPartida)
      set({
        fraseDelDia: frase,
        frasePartida: nuevaPartida,
        fraseAdivinado: false,
        contadorAciertosFrase: 0,
        profesorAyerFrase: null,
        fraseCargando: false,
      })
    } catch (err) {
      set({ fraseError: err instanceof Error ? err.message : 'Error al cambiar frase', fraseCargando: false })
    }
  },

  iniciarFotoPartida: async () => {
    set({ fotoCargando: true, fotoError: null })
    try {
      const fecha = obtenerFechaKey()
      const partidaExistente = get().fotoPartida

      if (partidaExistente && partidaExistente.fecha === fecha) {
        const profesor = await obtenerProfesor(partidaExistente.profesorId)
        if (profesor) {
          const [contador, profesorAyer] = await Promise.all([
            obtenerContadorDB(fecha, 'foto'),
            obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'foto').catch(() => null),
          ])
          set({
            fotoProfesor: profesor,
            fotoPartida: partidaExistente,
            contadorAciertosFoto: contador,
            profesorAyerFoto: partidaExistente.adivinado ? profesor : profesorAyer,
            fotoCargando: false,
          })
          return
        }
      }

      const profesor = await obtenerProfesorFotoDelDia(fecha)
      if (!profesor) {
        set({ fotoError: 'No hay profesores disponibles', fotoCargando: false })
        return
      }

      await guardarProfesorDiario(fecha, 'foto', profesor.id)

      const nuevaPartida: FotoPartida = {
        fecha,
        profesorId: profesor.id,
        adivinado: false,
        intentos: [],
        tiempoInicio: Date.now(),
        fotoUrl: profesor.foto_url,
        pistaUrl: profesor.imagen_pista_url || profesor.foto_url,
      }

      guardarFotoPartida(nuevaPartida)

      const [contador, profesorAyer] = await Promise.all([
        obtenerContadorDB(fecha, 'foto'),
        obtenerProfesorDiario(obtenerFechaAnteriorKey(), 'foto').catch(() => null),
      ])

      set({
        fotoProfesor: profesor,
        fotoPartida: nuevaPartida,
        contadorAciertosFoto: contador,
        profesorAyerFoto: profesorAyer,
        fotoCargando: false,
      })
    } catch (err) {
      set({ fotoError: err instanceof Error ? err.message : 'Error al cargar la partida', fotoCargando: false })
    }
  },

  realizarIntentoFoto: (profesor: Profesor) => {
    const { fotoProfesor, fotoPartida, estadisticasFoto } = get()
    if (!fotoProfesor || !fotoPartida || fotoPartida.adivinado) return

    const resultado = compararProfesores(profesor, fotoProfesor)
    const nuevoIntento: Intento = { profesor, resultado, timestamp: Date.now() }
    const nuevosIntentos = [...fotoPartida.intentos, nuevoIntento]
    const adivinado = resultado.profesor === 'verde'

    const partidaActualizada: FotoPartida = {
      ...fotoPartida,
      intentos: nuevosIntentos,
      adivinado,
      tiempoFin: adivinado ? Date.now() : undefined,
    }

    guardarFotoPartida(partidaActualizada)

    if (adivinado) {
      const nuevasEstadisticas: Estadisticas = {
        ...estadisticasFoto,
        partidasJugadas: estadisticasFoto.partidasJugadas + 1,
        partidasGanadas: estadisticasFoto.partidasGanadas + 1,
        rachaActual: estadisticasFoto.rachaActual + 1,
        mejorRacha: Math.max(estadisticasFoto.mejorRacha, estadisticasFoto.rachaActual + 1),
        distribucionIntentos: {
          ...estadisticasFoto.distribucionIntentos,
          [nuevosIntentos.length]: (estadisticasFoto.distribucionIntentos[nuevosIntentos.length] || 0) + 1,
        },
      }
      guardarEstadisticasFoto(nuevasEstadisticas)
      set({ estadisticasFoto: nuevasEstadisticas })

      incrementarContadorDB(obtenerFechaKey(), 'foto').then((nuevo) => {
        set({ contadorAciertosFoto: nuevo, profesorAyerFoto: fotoProfesor })
      })
    }

    set({ fotoPartida: partidaActualizada })
  },

  reiniciarFotoPartida: () => {
    localStorage.removeItem('utndle_foto_partida')
    set({
      fotoProfesor: null,
      fotoPartida: null,
      fotoCargando: true,
      fotoError: null,
      contadorAciertosFoto: 0,
      profesorAyerFoto: null,
    })
  },

  cambiarFotoDelDia: async () => {
    set({ fotoCargando: true, fotoError: null })
    try {
      const profesorActual = get().fotoProfesor
      const profesor = await obtenerProfesorAleatorio(profesorActual?.id)
      if (!profesor) {
        set({ fotoError: 'No hay profesores disponibles', fotoCargando: false })
        return
      }
      const fecha = obtenerFechaKey()
      const nuevaPartida: FotoPartida = {
        fecha,
        profesorId: profesor.id,
        adivinado: false,
        intentos: [],
        tiempoInicio: Date.now(),
        fotoUrl: profesor.foto_url,
        pistaUrl: profesor.imagen_pista_url || profesor.foto_url,
      }
      guardarFotoPartida(nuevaPartida)
      set({
        fotoProfesor: profesor,
        fotoPartida: nuevaPartida,
        contadorAciertosFoto: 0,
        profesorAyerFoto: null,
        fotoCargando: false,
      })
    } catch (err) {
      set({ fotoError: err instanceof Error ? err.message : 'Error al cambiar foto', fotoCargando: false })
    }
  },
}))
