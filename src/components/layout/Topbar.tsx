import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

export const Topbar = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuth()

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Welcome back, {user?.name || 'Alex'} 👋</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">May 26, 2024</div>
        <Button variant="secondary" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
