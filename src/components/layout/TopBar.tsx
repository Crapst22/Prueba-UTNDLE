import { useAuthStore } from '@/store/authStore'

export function TopBar() {
  const { user } = useAuthStore()

  return (
    <header className="relative z-40">
      {user && (
        <a
          href="/admin"
          className="fixed top-3 left-3 z-50 text-xs text-white/80 hover:text-yellow-300 transition-colors px-2 py-1 rounded bg-white/10 backdrop-blur-sm"
        >
          Admin
        </a>
      )}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 pb-2 flex flex-col items-center">
        <div className="flex items-center gap-2 sm:gap-3 mb-1">
          <img
            src="/iconos/logo-utn.png"
            alt="Logo UTN"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg"
          />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider gradient-text drop-shadow-lg">
            UTNDLE
          </h1>
        </div>
        <p className="text-sm text-white/85 font-medium text-shadow">
          Facultad Regional de Villa María
        </p>


      </div>
    </header>
  )
}
