import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuth } from '../../context/AuthContext'

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex min-h-[calc(100vh-48px)] flex-1 flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-sm">
          <Topbar onLogout={handleLogout} />
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
