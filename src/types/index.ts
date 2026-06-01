export interface Profesor {
  id: string
  nombre: string
  foto_url: string
  audio_pista_url: string
  imagen_pista_url: string
  fecha_nacimiento: string
  legajo: number
  jefe_catedra: boolean
  created_at: string
  presencialidades: Presencialidad[]
  catedras: Catedra[]
}

export interface Presencialidad {
  id: string
  nombre: string
}

export interface Catedra {
  id: string
  nombre: string
}

export interface ProfesorCatedra {
  profesor_id: string
  catedra_id: string
}

export interface ProfesorPresencialidad {
  profesor_id: string
  presencialidad_id: string
}

export type ModoComparacion = 'exacto' | 'numerico' | 'catedras'

export type ColorResultado = 'verde' | 'amarillo' | 'rojo' | 'subida' | 'bajada'

export interface ResultadoComparacion {
  profesor: ColorResultado
  catedras: ColorResultado
  presencialidad: ColorResultado
  legajo: ColorResultado
  jefe_catedra: ColorResultado
  edad: ColorResultado
}

export interface Intento {
  profesor: Profesor
  resultado: ResultadoComparacion
  timestamp: number
}

export interface Estadisticas {
  partidasJugadas: number
  partidasGanadas: number
  rachaActual: number
  mejorRacha: number
  distribucionIntentos: Record<number, number>
}

export interface PartidaDiaria {
  fecha: string
  profesorId: string
  adivinado: boolean
  intentos: Intento[]
  tiempoInicio: number
  tiempoFin?: number
}

export interface ProfesorFormData {
  nombre: string
  foto: File | null
  audio_pista: File | null
  imagen_pista: File | null
  fecha_nacimiento: string
  legajo: number
  jefe_catedra: boolean
  presencialidad_ids: string[]
  catedra_ids: string[]
}

export interface ProfesorCreateData {
  nombre: string
  foto_url: string
  audio_pista_url: string
  imagen_pista_url: string
  fecha_nacimiento: string
  legajo: number
  jefe_catedra: boolean
  presencialidad_ids: string[]
  catedra_ids: string[]
}
