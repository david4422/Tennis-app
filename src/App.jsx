  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import { useAuth } from './context/AuthContext'
  import { supabase } from './supabaseClient'
  import { useState, useEffect } from 'react'
  import AppLayout from './components/AppLayout'
  import Register from './pages/Register'
  import Login from './pages/Login'
  import Requests from './pages/Requests'
  import CreateRequest from './pages/CreateRequest'
  import Matches from './pages/Matches'
  import Chats from './pages/Chats'
  import Chat from './pages/Chat'

  function App() {
    const { user } = useAuth()
    const [totalUnread, setTotalUnread] = useState(0)

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

      const channel = supabase
        .channel('unread-counter')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          () => countUnread()
        )
        .subscribe()

      const interval = setInterval(countUnread, 3000)

      return () => {
        supabase.removeChannel(channel)
        clearInterval(interval)
      }
    }, [user])

    // If not logged in, show auth pages without sidebar
    if (!user) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      )
    }

    // Logged in — show sidebar layout
    return (
      <BrowserRouter>
        <AppLayout totalUnread={totalUnread}>
          <Routes>
            <Route path="/" element={<Requests />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/new" element={<CreateRequest />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    )
  }

  export default App