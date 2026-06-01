# Guía de Despliegue - UTNDLE

## 1. Supabase (Base de Datos y Storage)

### Crear proyecto
1. Ir a [supabase.com](https://supabase.com) e iniciar sesión
2. Crear un nuevo proyecto
3. Guardar las credenciales: Project URL y anon key

### Base de datos
1. Ir a **SQL Editor** en Supabase
2. Copiar y pegar el contenido de `database/schema.sql`
3. Ejecutar el script

### Storage - Buckets
Crear 3 buckets públicos:
1. `profesores-fotos`
2. `profesores-audios`
3. `profesores-imagenes-pista`

Para cada bucket:
- Crear bucket con nombre exacto
- Ir a **Storage > Policies**
- Agregar política: `Nueva política > Get started > All operations > Apply`
- En `USING expression`: `true`
- En `CHECK expression`: `true`

O más seguro, crear política de solo lectura pública y escritura para autenticados.

### Autenticación
1. Ir a **Authentication > Settings**
2. Habilitar **Email/Password** (deshabilitar confirmación de email para admin)
3. Ir a **Authentication > Users**
4. Agregar usuario: email + contraseña del administrador

### Obtener credenciales
1. Ir a **Project Settings > API**
2. Copiar: `Project URL` → `VITE_SUPABASE_URL`
3. Copiar: `anon public key` → `VITE_SUPABASE_ANON_KEY`

## 2. Vercel (Frontend)

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión
2. Click en **Add New > Project**
3. Conectar con el repositorio de GitHub (o subir manualmente)
4. Configurar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Agregar variables de entorno:
   - `VITE_SUPABASE_URL`: URL del proyecto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Anon key de Supabase
6. Click en **Deploy**

## 3. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## 4. Post-despliegue

1. Una vez desplegado, ir a la ruta `/admin/login`
2. Iniciar sesión con el email/contraseña creado en Supabase
3. Agregar profesores desde el panel de administración
4. Jugar en la página principal

### Notas
- La selección diaria es determinística basada en la fecha
- Todos los usuarios juegan con el mismo profesor del día
- No requiere servidor propio (backendless)
- Los datos persisten en Supabase y LocalStorage
