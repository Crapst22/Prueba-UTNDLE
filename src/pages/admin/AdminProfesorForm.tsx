import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import {
  obtenerProfesor,
  crearProfesor,
  actualizarProfesor,
  subirArchivo,
  obtenerPresencialidades,
  obtenerCatedras,
  STORAGE_BUCKETS,
} from '@/services/profesores'
import { crearFrase, actualizarFrase, obtenerFrases } from '@/services/frases'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Presencialidad, Catedra, FraseConProfesor } from '@/types'

interface ProfesorFormValues {
  nombre: string
  fecha_nacimiento: string
  legajo: number
  jefe_catedra: boolean
  presencialidad_ids: string[]
  catedra_ids: string[]
}

export function AdminProfesorForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { user, checkSession } = useAuthStore()
  const [cargando, setCargando] = useState(isEditing)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [presencialidades, setPresencialidades] = useState<Presencialidad[]>([])
  const [catedras, setCatedras] = useState<Catedra[]>([])
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imagenPistaFile, setImagenPistaFile] = useState<File | null>(null)
  const [fraseTexto, setFraseTexto] = useState('')
  const [fraseExistente, setFraseExistente] = useState<FraseConProfesor | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [audioPreview, setAudioPreview] = useState<string | null>(null)
  const [imagenPistaPreview, setImagenPistaPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfesorFormValues>({
    defaultValues: {
      nombre: '',
      fecha_nacimiento: '',
      legajo: 0,
      jefe_catedra: false,
      presencialidad_ids: [],
      catedra_ids: [],
    },
  })

  useEffect(() => {
    checkSession()
  }, [checkSession])

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
    }
  }, [user, navigate])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pres, cats] = await Promise.all([
          obtenerPresencialidades(),
          obtenerCatedras(),
        ])
        setPresencialidades(pres)
        setCatedras(cats)

        if (isEditing && id) {
          const profesor = await obtenerProfesor(id)
          if (profesor) {
            reset({
              nombre: profesor.nombre,
              fecha_nacimiento: profesor.fecha_nacimiento,
              legajo: profesor.legajo,
              jefe_catedra: profesor.jefe_catedra,
              presencialidad_ids: profesor.presencialidades.map((p) => p.id),
              catedra_ids: profesor.catedras.map((c) => c.id),
            })
            setFotoPreview(profesor.foto_url)
            setAudioPreview(profesor.audio_pista_url)
            setImagenPistaPreview(profesor.imagen_pista_url)

            const frases = await obtenerFrases()
            const fraseProf = frases.find((f) => f.profesor.id === id)
            if (fraseProf) {
              setFraseExistente(fraseProf)
              setFraseTexto(fraseProf.texto)
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
      } finally {
        setCargando(false)
      }
    }
    loadData()
  }, [id, isEditing, reset])

  const handleFileChange = (
    file: File | null,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (file) {
      setter(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        previewSetter(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfesorFormValues) => {
    setEnviando(true)
    setError(null)
    try {
      let foto_url = fotoPreview || ''
      let audio_pista_url = audioPreview || ''
      let imagen_pista_url = imagenPistaPreview || ''

      if (fotoFile) {
        const ext = fotoFile.name.split('.').pop()
        foto_url = await subirArchivo(
          STORAGE_BUCKETS.FOTOS,
          fotoFile,
          `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        )
      }

      if (audioFile) {
        const ext = audioFile.name.split('.').pop()
        audio_pista_url = await subirArchivo(
          STORAGE_BUCKETS.AUDIOS,
          audioFile,
          `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        )
      }

      if (imagenPistaFile) {
        const ext = imagenPistaFile.name.split('.').pop()
        imagen_pista_url = await subirArchivo(
          STORAGE_BUCKETS.IMAGENES_PISTA,
          imagenPistaFile,
          `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        )
      }

      let profesorId = id || ''

      if (isEditing && id) {
        await actualizarProfesor(id, {
          nombre: data.nombre,
          foto_url,
          audio_pista_url,
          imagen_pista_url,
          fecha_nacimiento: data.fecha_nacimiento,
          legajo: data.legajo,
          jefe_catedra: data.jefe_catedra,
          presencialidad_ids: data.presencialidad_ids,
          catedra_ids: data.catedra_ids,
        })
      } else {
        const nuevo = await crearProfesor({
          nombre: data.nombre,
          foto_url,
          audio_pista_url,
          imagen_pista_url,
          fecha_nacimiento: data.fecha_nacimiento,
          legajo: data.legajo,
          jefe_catedra: data.jefe_catedra,
          presencialidad_ids: data.presencialidad_ids,
          catedra_ids: data.catedra_ids,
        })
        profesorId = nuevo.id
      }

      if (fraseTexto.trim()) {
        if (fraseExistente) {
          await actualizarFrase(fraseExistente.id, fraseTexto.trim())
        } else {
          await crearFrase(profesorId, fraseTexto.trim())
        }
      }

      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar profesor')
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/fondo.jpg)' }} />
        <div className="fixed inset-0 bg-black/40" />
        <div className="relative z-10">
          <LoadingSpinner size="lg" text="Cargando..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/fondo.jpg)' }} />
      <div className="fixed inset-0 bg-black/40 pointer-events-none" />
      <header className="relative z-40 border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <a href="/admin" className="text-sm text-dark-400 hover:text-yellow-400 transition-colors whitespace-nowrap">
              ← Volver
            </a>
            <h1 className="text-base sm:text-lg font-bold gradient-text truncate">
              {isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 sm:py-6 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Información básica</h2>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Nombre completo</label>
              <input
                type="text"
                className="input w-full"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                placeholder="Ej: Juan Pérez"
              />
              {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  className="input w-full"
                  {...register('fecha_nacimiento', {
                    required: 'Obligatorio',
                    validate: (value) => {
                      if (!value) return 'Obligatorio'
                      const fecha = new Date(value)
                      const hoy = new Date()
                      let edad = hoy.getFullYear() - fecha.getFullYear()
                      const mes = hoy.getMonth() - fecha.getMonth()
                      if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
                        edad--
                      }
                      return edad >= 18 || 'Debe tener al menos 18 años'
                    },
                  })}
                />
                {errors.fecha_nacimiento && <p className="text-red-400 text-xs mt-1">{errors.fecha_nacimiento.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Legajo</label>
                <input
                  type="number"
                  className="input w-full"
                  {...register('legajo', {
                    required: 'Obligatorio',
                    valueAsNumber: true,
                  })}
                />
                {errors.legajo && <p className="text-red-400 text-xs mt-1">{errors.legajo.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-dark-300">Jefe de cátedra</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('jefe_catedra')}
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
                <span className="ms-2 text-xs text-dark-400">Sí / No</span>
              </label>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Archivos multimedia</h2>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Foto principal</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, setFotoFile, setFotoPreview)}
                className="input w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-500 file:text-dark-900 file:text-xs file:font-medium file:font-bold"
              />
              {fotoPreview && (
                <img src={fotoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover mt-2" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Audio pista</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, setAudioFile, setAudioPreview)}
                className="input w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-500 file:text-dark-900 file:text-xs file:font-medium file:font-bold"
              />
              {audioPreview && (
                <audio controls src={audioPreview} className="mt-2 w-full max-w-xs h-8" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">Imagen pista (recorte)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, setImagenPistaFile, setImagenPistaPreview)}
                className="input w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-yellow-500 file:text-dark-900 file:text-xs file:font-medium file:font-bold"
              />
              {imagenPistaPreview && (
                <img src={imagenPistaPreview} alt="Preview pista" className="w-20 h-20 object-cover rounded-lg mt-2" />
              )}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Frase</h2>
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">
                Frase destacada <span className="text-dark-500 font-normal">(opcional)</span>
              </label>
              <textarea
                value={fraseTexto}
                onChange={(e) => setFraseTexto(e.target.value)}
                placeholder="Ej: La programación es aprender a resolver problemas."
                rows={3}
                className="input w-full resize-none"
                style={{ borderRadius: '0.75rem' }}
              />
              <p className="text-xs text-dark-500 mt-1">
                Esta frase se mostrará en el modo Frase. Los estudiantes deberán adivinar qué profesor la dijo.
              </p>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Relaciones</h2>

            <Controller
              name="presencialidad_ids"
              control={control}
              rules={{ required: 'Seleccioná al menos una' }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Presencialidad</label>
                  <div className="flex flex-wrap gap-2">
                    {presencialidades.map((pres) => (
                      <button
                        key={pres.id}
                        type="button"
                        onClick={() => {
                          const current = field.value || []
                          const updated = current.includes(pres.id)
                            ? current.filter((v) => v !== pres.id)
                            : [...current, pres.id]
                          field.onChange(updated)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          (field.value || []).includes(pres.id)
                            ? 'bg-yellow-500 text-dark-900 font-bold'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        {pres.nombre}
                      </button>
                    ))}
                  </div>
                  {errors.presencialidad_ids && (
                    <p className="text-red-400 text-xs mt-1">{errors.presencialidad_ids.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="catedra_ids"
              control={control}
              rules={{ required: 'Seleccioná al menos una' }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Cátedras</label>
                  <div className="flex flex-wrap gap-2">
                    {catedras.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const current = field.value || []
                          const updated = current.includes(cat.id)
                            ? current.filter((v) => v !== cat.id)
                            : [...current, cat.id]
                          field.onChange(updated)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          (field.value || []).includes(cat.id)
                            ? 'bg-yellow-500 text-dark-900 font-bold'
                            : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                        }`}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                  {errors.catedra_ids && (
                    <p className="text-red-400 text-xs mt-1">{errors.catedra_ids.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/admin')} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={enviando} className="btn-primary flex items-center gap-2">
              {enviando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                isEditing ? 'Guardar Cambios' : 'Registrar Profesor'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
