import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const GamePage = lazy(() =>
  import('@/pages/game/GamePage').then((m) => ({ default: m.GamePage }))
)
const AdminLogin = lazy(() =>
  import('@/pages/auth/AdminLogin').then((m) => ({ default: m.AdminLogin }))
)
const AdminDashboard = lazy(() =>
  import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
)
const AdminProfesorForm = lazy(() =>
  import('@/pages/admin/AdminProfesorForm').then((m) => ({ default: m.AdminProfesorForm }))
)
const AdminConfiguracion = lazy(() =>
  import('@/pages/admin/AdminConfiguracion').then((m) => ({ default: m.AdminConfiguracion }))
)

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Cargando..." />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/nuevo" element={<AdminProfesorForm />} />
        <Route path="/admin/editar/:id" element={<AdminProfesorForm />} />
        <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
      </Routes>
    </Suspense>
  )
}

export default App
