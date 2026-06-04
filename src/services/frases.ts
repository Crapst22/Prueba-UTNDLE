import { supabase } from './supabase'
import type { Frase, FraseConProfesor, Profesor, Presencialidad, Catedra } from '@/types'

function transformarProfesor(p: Record<string, unknown>): Profesor {
  return {
    ...p,
    presencialidades: (p.presencialidades as Array<{ presencialidad: Presencialidad }>).map((pp) => pp.presencialidad),
    catedras: (p.catedras as Array<{ catedra: Catedra }>).map((pc) => pc.catedra),
  } as Profesor
}

export async function obtenerFrases(): Promise<FraseConProfesor[]> {
  const { data, error } = await supabase
    .from('frases')
    .select(`
      *,
      profesor:profesores(
        *,
        presencialidades:profesor_presencialidad(
          presencialidad:presencialidades(*)
        ),
        catedras:profesor_catedra(
          catedra:catedras(*)
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!data) return []

  return (data as Array<Record<string, unknown>>).map((item) => ({
    id: item.id as string,
    texto: item.texto as string,
    profesor: transformarProfesor(item.profesor as Record<string, unknown>),
  }))
}

export async function obtenerFrase(id: string): Promise<FraseConProfesor | null> {
  const { data, error } = await supabase
    .from('frases')
    .select(`
      *,
      profesor:profesores(
        *,
        presencialidades:profesor_presencialidad(
          presencialidad:presencialidades(*)
        ),
        catedras:profesor_catedra(
          catedra:catedras(*)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  if (!data) return null

  return {
    id: data.id,
    texto: data.texto,
    profesor: transformarProfesor(data.profesor as unknown as Record<string, unknown>),
  }
}

function hashFecha(fecha: string, total: number, salt: string = ''): number {
  let hash = 0
  const input = fecha + salt
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % total
}

async function obtenerIdsFrases(): Promise<string[]> {
  const { data, error } = await supabase
    .from('frases')
    .select('id')

  if (error) throw error
  if (!data) return []

  return data.map((f) => f.id)
}

export async function obtenerFraseDelDia(fecha: string): Promise<FraseConProfesor | null> {
  const ids = await obtenerIdsFrases()
  if (ids.length === 0) return null

  const indice = hashFecha(fecha, ids.length, 'frase')
  return obtenerFrase(ids[indice])
}

export async function obtenerFraseAleatoria(): Promise<FraseConProfesor | null> {
  const ids = await obtenerIdsFrases()
  if (ids.length === 0) return null

  const indice = Math.floor(Math.random() * ids.length)
  return obtenerFrase(ids[indice])
}

export async function obtenerFraseDelDiaAnterior(fecha: string): Promise<FraseConProfesor | null> {
  const fechaAnterior = new Date(fecha)
  fechaAnterior.setDate(fechaAnterior.getDate() - 1)
  const fechaStr = fechaAnterior.toISOString().split('T')[0]

  const ids = await obtenerIdsFrases()
  if (ids.length === 0) return null

  const indice = hashFecha(fechaStr, ids.length, 'frase')
  return obtenerFrase(ids[indice])
}

export async function crearFrase(profesorId: string, texto: string): Promise<Frase> {
  const { data, error } = await supabase
    .from('frases')
    .insert([{ profesor_id: profesorId, texto }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarFrase(id: string, texto: string, profesorId?: string): Promise<void> {
  const payload: Record<string, string> = { texto }
  if (profesorId) payload.profesor_id = profesorId

  const { error } = await supabase
    .from('frases')
    .update(payload)
    .eq('id', id)

  if (error) throw error
}

export async function eliminarFrase(id: string): Promise<void> {
  const { error } = await supabase
    .from('frases')
    .delete()
    .eq('id', id)

  if (error) throw error
}
