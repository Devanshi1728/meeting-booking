import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: '📊' },
  { label: 'My Bookings', to: '/bookings', icon: '🗓️' },
  // { label: 'Calendar View', to: '/calendar', icon: '📅' },
]

export const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="flex h-full w-full max-w-[280px] flex-col gap-8 border-r border-slate-200 bg-white px-6 py-8">
      <div>
        <div className="mb-8 inline-flex items-center gap-3 text-2xl font-semibold text-slate-900">
          <span className="rounded-2xl bg-sky-600 px-3 py-2 text-white shadow-sm">RB</span>
          <span>RoomBook</span>
        </div>
        <div className="text-sm text-slate-500">Smart meeting room booking for teams</div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-slate-100 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">{user?.name || 'Guest'}</p>
        <p className="mt-1 text-slate-500">{user?.email}</p>
        <p className="mt-1 text-slate-500">{user?.department || 'No department'}</p>
      </div>
    </aside>
  )
}
