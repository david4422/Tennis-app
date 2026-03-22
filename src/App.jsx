// --- Imports ---
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Register from './pages/Register'
import Login from './pages/Login'
import { supabase } from './supabaseClient'
import Requests from './pages/Requests'
import CreateRequest from './pages/CreateRequest'
import Matches from './pages/Matches'
import Chats from './pages/Chats'
import Chat from './pages/Chat'
import { useState, useEffect } from 'react'

function App() {
  // --- Auth ---
  const { user } = useAuth()

  // --- Unread messages state ---
  const [totalUnread, setTotalUnread] = useState(0)

  // --- Count total unread messages ---
  useEffect(() => {
    if (!user) return

    async function countUnread() {
      const { data: reads } = await supabase
        .from('conversation_reads')
        .select('conversation_id, last_read_at')
        .eq('user_id', user.id)

      const { data: convs } = await supabase
        .from('conversations')
        .select('id')

      if (!convs) return

      let total = 0
      for (const conv of convs) {
        const readInfo = reads?.find(r => r.conversation_id === conv.id)
        const lastRead = readInfo?.last_read_at || '1970-01-01'

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .gt('created_at', lastRead)
          .neq('sender_id', user.id)

        total += count || 0
      }
      setTotalUnread(total)
    }

    countUnread()

    // Recount when new messages arrive
    const channel = supabase
      .channel('unread-counter')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => countUnread()
      )
      .subscribe()

    // Recount every 3 seconds (catches when user reads a chat)
    const interval = setInterval(countUnread, 3000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [user])

  // --- Styles ---
  const navStyle = {
    padding: '10px',
    background: '#333',
    color: 'white',
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  }

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  }

  const logoutStyle = {
    color: 'white',
    background: 'none',
    border: '1px solid white',
    cursor: 'pointer',
    padding: '5px 10px',
  }

  const unreadBadgeStyle = {
    background: '#f85149',
    color: 'white',
    borderRadius: '50%',
    padding: '1px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '5px',
  }

  return (
   
    <BrowserRouter>
      {/* --- Navigation Bar --- */}
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        {!user && <Link to="/register" style={linkStyle}>Register</Link>}
        {!user && <Link to="/login" style={linkStyle}>Login</Link>}
        {user && <span>Hello {user.email}</span>}
        {user && <Link to="/requests" style={linkStyle}>Requests</Link>}
        {user && <Link to="/matches" style={linkStyle}>Matches</Link>}
        {user && (
          <Link to="/chats" style={linkStyle}>
            Chats
            {totalUnread > 0 && (
              <span style={unreadBadgeStyle}>
                {totalUnread}
              </span>
            )}
          </Link>
        )}
        {user && (
          <button onClick={() => supabase.auth.signOut()} style={logoutStyle}>
            Logout
          </button>
        )}
      </nav>

      {/* --- Routes --- */}
      <Routes>
        <Route
          path="/"
          element={
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}>
              Welcome to Tennis Matchmaking!
            </h1>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/requests" element={user ? <Requests /> : <Login />} />
        <Route path="/requests/new" element={user ? <CreateRequest /> : <Login />} />
        <Route path="/matches" element={user ? <Matches /> : <Login />} />
        <Route path="/chats" element={user ? <Chats /> : <Login />} />
        <Route path="/chat/:id" element={user ? <Chat /> : <Login />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
