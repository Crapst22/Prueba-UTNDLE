import { supabase } from './supabase'
import type { Profesor, Presencialidad, Catedra } from '@/types'

function transformarProfesor(p: Record<string, unknown>): Profesor {
  return {
    ...p,
    presencialidades: (p.presencialidades as Array<{ presencialidad: Presencialidad }>).map((pp) => pp.presencialidad),
    catedras: (p.catedras as Array<{ catedra: Catedra }>).map((pc) => pc.catedra),
  } as Profesor
}

export async function guardarProfesorDiario(
  fecha: string,
  modo: string,
  profesorId: string
): Promise<void> {
  const { error } = await supabase
    .from('profesor_diario')
    .upsert(
      { fecha, modo, profesor_id: profesorId },
      { onConflict: 'fecha, modo' }
    )

  if (error) throw error
}

export async function obtenerProfesorDiario(
  fecha: string,
  modo: string
): Promise<Profesor | null> {
  const { data, error } = await supabase
    .from('profesor_diario')
    .select(`
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
    .eq('fecha', fecha)
    .eq('modo', modo)
    .maybeSingle()

  if (error) throw error
  if (!data?.profesor) return null

  return transformarProfesor(data.profesor as unknown as Record<string, unknown>)
}

export async function obtenerContadorAciertos(
  fecha: string,
  modo: string
): Promise<number> {
  const { data, error } = await supabase
    .from('aciertos_diarios')
    .select('contador')
    .eq('fecha', fecha)
    .eq('modo', modo)
    .maybeSingle()

  if (error) throw error
  return data?.contador ?? 0
}

export async function incrementarContadorAciertos(
  fecha: string,
  modo: string
): Promise<number> {
  const { data, error } = await supabase
    .rpc('incrementar_aciertos', { p_fecha: fecha, p_modo: modo })

  if (error) throw error
  return data as number
}
