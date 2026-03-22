 import { Link, useLocation } from 'react-router-dom'
  import { useAuth } from '../context/AuthContext'
  import { supabase } from '../supabaseClient'

  export default function AppLayout({ children, totalUnread }) {
    const { user } = useAuth()
    const location = useLocation()

    const navItems = [
      { path: '/requests', label: 'Requests', icon: '🎾' },
      { path: '/matches', label: 'Matches', icon: '🏆' },
      { path: '/chats', label: 'Chats', icon: '💬', badge: totalUnread },
    ]

    const isActive = (path) => location.pathname === path

    return (
      <div className="flex h-screen bg-slate-950 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold">🎾 Tennis Match</h1>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-2">
            {user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User info + Logout */}
          {user && (
            <div className="p-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 truncate mb-2">{user.email}</p>
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full px-4 py-2 text-sm border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    )
  } 