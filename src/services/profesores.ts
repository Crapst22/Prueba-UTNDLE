import { supabase } from './supabase'
import type { Profesor, Presencialidad, Catedra, ProfesorCreateData } from '@/types'

const STORAGE_BUCKETS = {
  FOTOS: 'profesores-fotos',
  AUDIOS: 'profesores-audios',
  IMAGENES_PISTA: 'profesores-imagenes-pista',
} as const

export async function obtenerProfesores(): Promise<Profesor[]> {
  const { data, error } = await supabase
    .from('profesores')
    .select(`
      *,
      presencialidades:profesor_presencialidad(
        presencialidad:presencialidades(*)
      ),
      catedras:profesor_catedra(
        catedra:catedras(*)
      )
    `)
    .order('nombre')

  if (error) throw error

  return (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    presencialidades: (p.presencialidades as Array<{ presencialidad: Presencialidad }>).map((pp) => pp.presencialidad),
    catedras: (p.catedras as Array<{ catedra: Catedra }>).map((pc) => pc.catedra),
  })) as Profesor[]
}

export async function obtenerProfesor(id: string): Promise<Profesor | null> {
  const { data, error } = await supabase
    .from('profesores')
    .select(`
      *,
      presencialidades:profesor_presencialidad(
        presencialidad:presencialidades(*)
      ),
      catedras:profesor_catedra(
        catedra:catedras(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    presencialidades: (data.presencialidades as Array<{ presencialidad: Presencialidad }>).map((pp) => pp.presencialidad),
    catedras: (data.catedras as Array<{ catedra: Catedra }>).map((pc) => pc.catedra),
  } as Profesor
}

export async function buscarProfesores(termino: string): Promise<Profesor[]> {
  const { data, error } = await supabase
    .from('profesores')
    .select(`
      *,
      presencialidades:profesor_presencialidad(
        presencialidad:presencialidades(*)
      ),
      catedras:profesor_catedra(
        catedra:catedras(*)
      )
    `)
    .ilike('nombre', `%${termino}%`)
    .order('nombre')
    .limit(10)

  if (error) throw error

  return (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    presencialidades: (p.presencialidades as Array<{ presencialidad: Presencialidad }>).map((pp) => pp.presencialidad),
    catedras: (p.catedras as Array<{ catedra: Catedra }>).map((pc) => pc.catedra),
  })) as Profesor[]
}

export async function obtenerProfesorDelDia(fecha: string): Promise<Profesor | null> {
  const { data: profesores, error } = await supabase
    .from('profesores')
    .select('id')

  if (error) throw error
  if (!profesores || profesores.length === 0) return null

  const indice = hashFecha(fecha, profesores.length)
  const profesorId = profesores[indice].id

  return obtenerProfesor(profesorId)
}

export async function crearProfesor(data: ProfesorCreateData): Promise<Profesor> {
  const { presencialidad_ids, catedra_ids, ...profesorData } = data

  const { data: profesor, error } = await supabase
    .from('profesores')
    .insert([profesorData])
    .select()
    .single()

  if (error) throw error

  if (presencialidad_ids.length > 0) {
    const { error: errorPres } = await supabase
      .from('profesor_presencialidad')
      .insert(
        presencialidad_ids.map((pid) => ({
          profesor_id: profesor.id,
          presencialidad_id: pid,
        }))
      )
    if (errorPres) throw errorPres
  }

  if (catedra_ids.length > 0) {
    const { error: errorCat } = await supabase
      .from('profesor_catedra')
      .insert(
        catedra_ids.map((cid) => ({
          profesor_id: profesor.id,
          catedra_id: cid,
        }))
      )
    if (errorCat) throw errorCat
  }

  return obtenerProfesor(profesor.id) as Promise<Profesor>
}

export async function actualizarProfesor(
  id: string,
  data: Partial<ProfesorCreateData>
): Promise<Profesor> {
  const { presencialidad_ids, catedra_ids, ...profesorData } = data

  if (Object.keys(profesorData).length > 0) {
    const { error } = await supabase
      .from('profesores')
      .update(profesorData)
      .eq('id', id)

    if (error) throw error
  }

  if (presencialidad_ids) {
    await supabase.from('profesor_presencialidad').delete().eq('profesor_id', id)

    if (presencialidad_ids.length > 0) {
      const { error: errorPres } = await supabase
        .from('profesor_presencialidad')
        .insert(
          presencialidad_ids.map((pid) => ({
            profesor_id: id,
            presencialidad_id: pid,
          }))
        )
      if (errorPres) throw errorPres
    }
  }

  if (catedra_ids) {
    await supabase.from('profesor_catedra').delete().eq('profesor_id', id)

    if (catedra_ids.length > 0) {
      const { error: errorCat } = await supabase
        .from('profesor_catedra')
        .insert(
          catedra_ids.map((cid) => ({
            profesor_id: id,
            catedra_id: cid,
          }))
        )
      if (errorCat) throw errorCat
    }
  }

  return obtenerProfesor(id) as Promise<Profesor>
}

export async function eliminarProfesor(id: string): Promise<void> {
  const profesor = await obtenerProfesor(id)

  if (profesor?.foto_url) {
    await eliminarArchivo(profesor.foto_url)
  }
  if (profesor?.audio_pista_url) {
    await eliminarArchivo(profesor.audio_pista_url)
  }
  if (profesor?.imagen_pista_url) {
    await eliminarArchivo(profesor.imagen_pista_url)
  }

  await supabase.from('profesor_catedra').delete().eq('profesor_id', id)
  await supabase.from('profesor_presencialidad').delete().eq('profesor_id', id)

  const { error } = await supabase.from('profesores').delete().eq('id', id)
  if (error) throw error
}

export async function subirArchivo(
  bucket: string,
  archivo: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, archivo, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function eliminarArchivo(url: string): Promise<void> {
  const path = url.split('/').slice(-2).join('/')
  const bucket = url.split('/').slice(-3, -2)[0]

  await supabase.storage.from(bucket).remove([path])
}

export async function obtenerPresencialidades(): Promise<Presencialidad[]> {
  const { data, error } = await supabase
    .from('presencialidades')
    .select('*')
    .order('nombre')

  if (error) throw error
  return data || []
}

export async function obtenerCatedras(): Promise<Catedra[]> {
  const { data, error } = await supabase
    .from('catedras')
    .select('*')
    .order('nombre')

  if (error) throw error
  return data || []
}

export async function crearCatedra(nombre: string): Promise<Catedra> {
  const { data, error } = await supabase
    .from('catedras')
    .insert([{ nombre }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarCatedra(id: string): Promise<void> {
  const { error } = await supabase.from('catedras').delete().eq('id', id)
  if (error) throw error
}

export async function crearPresencialidad(nombre: string): Promise<Presencialidad> {
  const { data, error } = await supabase
    .from('presencialidades')
    .insert([{ nombre }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarPresencialidad(id: string): Promise<void> {
  const { error } = await supabase.from('presencialidades').delete().eq('id', id)
  if (error) throw error
}

function hashFecha(fecha: string, total: number): number {
  let hash = 0
  for (let i = 0; i < fecha.length; i++) {
    const char = fecha.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % total
}

export { STORAGE_BUCKETS }
