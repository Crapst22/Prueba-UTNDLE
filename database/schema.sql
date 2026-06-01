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
  edad INTEGER NOT NULL,
  legajo INTEGER NOT NULL UNIQUE,
  jefe_catedra BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLAS RELACIONALES

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

ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE catedras ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_catedra ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_presencialidad ENABLE ROW LEVEL SECURITY;

-- Permite lectura a todos (para el juego)
CREATE POLICY "Lectura pública - profesores" ON profesores
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - presencialidades" ON presencialidades
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - catedras" ON catedras
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - profesor_catedra" ON profesor_catedra
  FOR SELECT USING (true);

CREATE POLICY "Lectura pública - profesor_presencialidad" ON profesor_presencialidad
  FOR SELECT USING (true);

-- Solo admin autenticado puede modificar
CREATE POLICY "Escritura admin - profesores" ON profesores
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin - presencialidades" ON presencialidades
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin - catedras" ON catedras
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin - profesor_catedra" ON profesor_catedra
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Escritura admin - profesor_presencialidad" ON profesor_presencialidad
  FOR ALL USING (auth.role() = 'authenticated');

-- 6. FUNCIÓN PARA SELECCIÓN DIARIA DETERMINÍSTICA
-- (Se usa desde la aplicación con hash de fecha)

-- ============================================
-- INSTRUCCIONES POST-CREACIÓN:
-- 1. Ejecutar este script en SQL Editor de Supabase
-- 2. Crear buckets de Storage:
--    - profesores-fotos (público)
--    - profesores-audios (público)
--    - profesores-imagenes-pista (público)
-- 3. En Authentication > Settings, habilitar Email/Password
-- 4. Crear usuario admin manualmente en Authentication > Users
-- ============================================
