-- ============================================
-- UTNDLE - Reset completo de políticas RLS
-- Ejecutar esto en SQL Editor de Supabase
-- ============================================

-- 1. Eliminar TODAS las políticas existentes (tablas + storage)
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

  FOR pol IN (
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname IN ('Lectura pública - storage', 'Insertar archivos - admin', 'Actualizar archivos - admin', 'Eliminar archivos - admin')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- 2. Asegurar RLS habilitado
ALTER TABLE profesores ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE catedras ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_catedra ENABLE ROW LEVEL SECURITY;
ALTER TABLE profesor_presencialidad ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de LECTURA pública (para el juego)
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

-- 4. Políticas de ESCRITURA solo para admin autenticado
-- Usamos auth.uid() IS NOT NULL que es más confiable que auth.role()

CREATE POLICY "Insert admin - profesores" ON profesores
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Update admin - profesores" ON profesores
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Delete admin - profesores" ON profesores
  FOR DELETE USING (auth.uid() IS NOT NULL);

--

CREATE POLICY "Insert admin - presencialidades" ON presencialidades
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Update admin - presencialidades" ON presencialidades
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Delete admin - presencialidades" ON presencialidades
  FOR DELETE USING (auth.uid() IS NOT NULL);

--

CREATE POLICY "Insert admin - catedras" ON catedras
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Update admin - catedras" ON catedras
  FOR UPDATE USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Delete admin - catedras" ON catedras
  FOR DELETE USING (auth.uid() IS NOT NULL);

--

CREATE POLICY "Insert admin - profesor_catedra" ON profesor_catedra
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Delete admin - profesor_catedra" ON profesor_catedra
  FOR DELETE USING (auth.uid() IS NOT NULL);

--

CREATE POLICY "Insert admin - profesor_presencialidad" ON profesor_presencialidad
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Delete admin - profesor_presencialidad" ON profesor_presencialidad
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. Políticas de STORAGE buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Los buckets deben existir: profesores-fotos, profesores-audios, profesores-imagenes-pista
-- Cualquier usuario puede leer archivos
CREATE POLICY "Lectura pública - storage" ON storage.objects
  FOR SELECT USING (true);

-- Solo admin autenticado puede subir/modificar/eliminar en los buckets del sistema
CREATE POLICY "Insertar archivos - admin" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

CREATE POLICY "Actualizar archivos - admin" ON storage.objects
  FOR UPDATE USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  ) WITH CHECK (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

CREATE POLICY "Eliminar archivos - admin" ON storage.objects
  FOR DELETE USING (
    auth.uid() IS NOT NULL
    AND bucket_id IN ('profesores-fotos', 'profesores-audios', 'profesores-imagenes-pista')
  );

-- 6. Verificación: mostrar TODAS las políticas creadas (tablas + storage)
SELECT schemaname, tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, cmd;
