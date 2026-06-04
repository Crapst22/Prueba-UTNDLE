-- ============================================
-- UTNDLE - Esquema de Base de Datos Supabase
-- ============================================

-- 1. TABLAS PRINCIPALES

CREATE TABLE IF NOT EXISTS presencialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catedras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profesores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  foto_url TEXT NOT NULL DEFAULT '',
  audio_pista_url TEXT NOT NULL DEFAULT '',
  imagen_pista_url TEXT NOT NULL DEFAULT '',
  fecha_nacimiento DATE NOT NULL,
  legajo INTEGER NOT NULL UNIQUE,
  jefe_catedra BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLAS RELACIONALES

CREATE TABLE IF NOT EXISTS frases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profesor_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  modo TEXT NOT NULL,
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (fecha, modo)
);

CREATE TABLE IF NOT EXISTS aciertos_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  modo TEXT NOT NULL,
  contador INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (fecha, modo)
);

CREATE TABLE IF NOT EXISTS profesor_catedra (
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  catedra_id UUID NOT NULL REFERENCES catedras(id) ON DELETE CASCADE,
  PRIMARY KEY (profesor_id, catedra_id)
);

CREATE TABLE IF NOT EXISTS profesor_presencialidad (
  profesor_id UUID NOT NULL REFERENCES profesores(id) ON DELETE CASCADE,
  presencialidad_id UUID NOT NULL REFERENCES presencialidades(id) ON DELETE CASCADE,
  PRIMARY KEY (profesor_id, presencialidad_id)
);

-- 3. ÍNDICES

CREATE INDEX IF NOT EXISTS idx_profesores_nombre ON profesores(nombre);
CREATE INDEX IF NOT EXISTS idx_profesores_legajo ON profesores(legajo);
CREATE INDEX IF NOT EXISTS idx_profesor_catedra_profesor ON profesor_catedra(profesor_id);
CREATE INDEX IF NOT EXISTS idx_profesor_catedra_catedra ON profesor_catedra(catedra_id);
CREATE INDEX IF NOT EXISTS idx_profesor_presencialidad_profesor ON profesor_presencialidad(profesor_id);
CREATE INDEX IF NOT EXISTS idx_profesor_presencialidad_presencialidad ON profesor_presencialidad(presencialidad_id);

-- 4. DATOS INICIALES

INSERT INTO presencialidades (nombre) VALUES
  ('Villa María'),
  ('Córdoba'),
  ('San Francisco'),
  ('Virtual')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO catedras (nombre) VALUES
  ('Análisis Matemático I'),
  ('Álgebra y Geometría Analítica'),
  ('Física I'),
  ('Inglés I'),
  ('Lógica y Estructuras Discretas'),
  ('Algoritmos y Estructuras de Datos'),
  ('Arquitectura de Computadoras'),
  ('Sistemas y Procesos de Negocios'),
  ('Análisis Matemático II'),
  ('Física II'),
  ('Ingeniería y Sociedad'),
  ('Inglés II'),
  ('Sintaxis y Semántica de los Lenguajes'),
  ('Paradigmas de Programación'),
  ('Sistemas Operativos'),
  ('Análisis de Sistemas de Información'),
  ('Probabilidad y Estadística'),
  ('Economía'),
  ('Bases de Datos'),
  ('Desarrollo de Software'),
  ('Comunicaciones de Datos'),
  ('Análisis Numérico'),
  ('Diseño de Sistemas de Información'),
  ('Legislación'),
  ('Ingeniería y Calidad de Software'),
  ('Redes de Datos'),
  ('Investigación Operativa'),
  ('Simulación'),
  ('Tecnologías para la Automatización'),
  ('Administración de Sistemas de Información'),
  ('Inteligencia Artificial'),
  ('Ciencia de Datos'),
  ('Sistemas de Gestión'),
  ('Gestión Gerencial'),
  ('Seguridad en los Sistemas de Información'),
  ('Proyecto Final'),
  ('Práctica Profesional Supervisada (PPS)')
ON CONFLICT (nombre) DO NOTHING;

-- 5. RLS (Row Level Security)
-- PRIMERO: eliminar políticas existentes para evitar conflictos al re-ejecutar

DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN ('profesores','presencialidades','catedras','profesor_catedra','profesor_presencialidad')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE catedras ENABLE ROW LEVEL SECURITY;
ALTER TABLE frases ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE aciertos_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_catedra ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_presencialidad ENABLE ROW LEVEL SECURITY;

-- Permite lectura a todos (para el juego)
CREATE POLICY "Lectura pública - profesores" ON profesores
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - presencialidades" ON presencialidades
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - catedras" ON catedras
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - frases" ON frases
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - profesor_diario" ON profesor_diario
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - aciertos_diarios" ON aciertos_diarios
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - profesor_catedra" ON profesor_catedra
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - profesor_presencialidad" ON profesor_presencialidad
  FOR SELECT USING (true);

-- Solo admin autenticado puede modificar (usando auth.uid() que es más robusto)
CREATE POLICY "Insert admin - profesores" ON profesores
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update admin - profesores" ON profesores
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - profesores" ON profesores
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Insert admin - presencialidades" ON presencialidades
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update admin - presencialidades" ON presencialidades
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - presencialidades" ON presencialidades
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Insert admin - catedras" ON catedras
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update admin - catedras" ON catedras
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - catedras" ON catedras
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Insert admin - frases" ON frases
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update admin - frases" ON frases
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - frases" ON frases
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Insert admin - profesor_diario" ON profesor_diario
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Update admin - profesor_diario" ON profesor_diario
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Insert público - aciertos_diarios" ON aciertos_diarios
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Update público - aciertos_diarios" ON aciertos_diarios
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Insert admin - profesor_catedra" ON profesor_catedra
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - profesor_catedra" ON profesor_catedra
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Insert admin - profesor_presencialidad" ON profesor_presencialidad
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Delete admin - profesor_presencialidad" ON profesor_presencialidad
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 6. RLS PARA STORAGE (buckets de archivos)
-- NOTA: storage.objects ya tiene RLS habilitado por defecto en Supabase
-- Si las políticas de storage no se pueden crear por SQL (error de permisos),
-- usar Storage Dashboard en su lugar (ver instrucciones al final del archivo)
-- Los buckets deben crearse manualmente desde Supabase Dashboard:
-- Storage -> Create bucket -> nombre: profesores-fotos (público)
-- Storage -> Create bucket -> nombre: profesores-audios (público)
-- Storage -> Create bucket -> nombre: profesores-imagenes-pista (público)
-- Luego ejecutar las siguientes políticas:

-- Eliminar políticas existentes de storage.objects si las hay
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Permitir lectura pública de todos los archivos
CREATE POLICY "Lectura pública - storage" ON storage.objects
  FOR SELECT USING (true);

-- Permitir subida de archivos solo a admin autenticado
CREATE POLICY "Insertar archivos - admin" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

-- Permitir actualizar archivos solo a admin autenticado
CREATE POLICY "Actualizar archivos - admin" ON storage.objects
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  ) WITH CHECK (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

-- Permitir eliminar archivos solo a admin autenticado
CREATE POLICY "Eliminar archivos - admin" ON storage.objects
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

-- 7. FUNCIÓN PARA SELECCIÓN DIARIA DETERMINÍSTICA
-- (Se usa desde la aplicación con hash de fecha)

-- 8. FUNCIÓN PARA INCREMENTAR ACIERTOS DIARIOS

CREATE OR REPLACE FUNCTION incrementar_aciertos(p_fecha DATE, p_modo TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_contador INTEGER;
BEGIN
  INSERT INTO aciertos_diarios (fecha, modo, contador)
  VALUES (p_fecha, p_modo, 1)
  ON CONFLICT (fecha, modo)
  DO UPDATE SET contador = aciertos_diarios.contador + 1, updated_at = now()
  RETURNING contador INTO v_contador;

  RETURN v_contador;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INSTRUCCIONES POST-CREACIÓN:
-- 1. Ejecutar este script en SQL Editor de Supabase
-- 2. Crear buckets de Storage desde el Dashboard:
--    Storage → Create bucket → nombre: profesores-fotos (marcar público)
--    Storage → Create bucket → nombre: profesores-audios (marcar público)
--    Storage → Create bucket → nombre: profesores-imagenes-pista (marcar público)
-- 3. Configurar políticas de Storage (SI las políticas SQL de arriba dieron error de permisos):
--    En Storage Dashboard, entrar a cada bucket → pestaña "Policies" →
--    agregar las siguientes reglas:
--
--    PARA CADA BUCKET (hacerlo en profesores-fotos, profesores-audios, profesores-imagenes-pista):
--
--    a) Name: "Lectura pública"
--       Allowed operations: SELECT
--       Policy definition: true
--       Policy definition (target): true
--
--    b) Name: "Subida admin"
--       Allowed operations: INSERT
--       Policy definition: (auth.uid() IS NOT NULL)
--       Policy definition (target): (auth.uid() IS NOT NULL)
--
--    c) Name: "Eliminar admin"
--       Allowed operations: DELETE
--       Policy definition: (auth.uid() IS NOT NULL)
--
--    Alternativa más rápida: en cada bucket, editar y marcar "Public bucket" (aunque
--    cualquiera podría subir archivos, con la anon key ya expuesta es aceptable).
--
-- 4. En Authentication > Settings, habilitar Email/Password
-- 5. Crear usuario admin manualmente en Authentication > Users
-- ============================================
