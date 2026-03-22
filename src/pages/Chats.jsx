// --- Chats Page ---
// Shows list of conversations + option to start new chat with any user
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Chats() {
  // --- State ---
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  // --- Fetch conversations on load ---
  useEffect(() => {
    fetchConversations()
  }, [user])

  // --- Fetch all conversations with unread counts ---
  async function fetchConversations() {
    // Get conversations
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(name),
        user2:profiles!conversations_user2_id_fkey(name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      setLoading(false)
      return
    }

    // Get read timestamps for all conversations
    const { data: reads } = await supabase
      .from('conversation_reads')
      .select('conversation_id, last_read_at')
      .eq('user_id', user.id)

    // Count unread messages per conversation
    const convsWithUnread = await Promise.all(
      data.map(async (conv) => {
        const readInfo = reads?.find(r => r.conversation_id === conv.id)
        const lastRead = readInfo?.last_read_at || '1970-01-01'

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .gt('created_at', lastRead)
          .neq('sender_id', user.id)

        return { ...conv, unreadCount: count || 0 }
      })
    )

    setConversations(convsWithUnread)
    setLoading(false)
  }

  // --- Start a new chat: check if conversation exists, if not create one ---
  async function startNewChat(otherUserId) {
    // Check both directions (user1→user2 or user2→user1)
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
      .single()

    if (existing) {
      navigate(`/chat/${existing.id}`)
      return
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user1_id: user.id, user2_id: otherUserId })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
    } else {
      navigate(`/chat/${data.id}`)
    }
  }

  // --- Fetch all other users for "Start New Chat" list ---
  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase
        .from('profiles')
        .select('id, name')
        .neq('id', user?.id)
      if (data) setProfiles(data)
    }
    if (user) fetchProfiles()
  }, [user])

  if (loading) return <p>Loading...</p>

  // --- Styles ---
  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  }

  const convStyle = {
    padding: '15px',
    margin: '10px 0',
    background: '#1a1a2e',
    borderRadius: '8px',
    cursor: 'pointer',
  }

  const newChatStyle = {
    padding: '10px',
    margin: '5px 0',
    background: '#16213e',
    borderRadius: '8px',
    cursor: 'pointer',
  }

  const unreadBadgeStyle = {
    background: '#f85149',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 8px',
    fontSize: '14px',
    fontWeight: 'bold',
  }

  // --- Render ---
  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#e2e8f0' }}>My Chats</h2>

      {/* --- Existing conversations --- */}
      {conversations.length === 0 && <p style={{ color: '#94a3b8' }}>No conversations yet.</p>}

      {conversations.map(conv => {
        const otherName = conv.user1_id === user.id ? conv.user2?.name : conv.user1?.name
        return (
          <div
            key={conv.id}
            onClick={() => navigate(`/chat/${conv.id}`)}
            style={convStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#58a6ff', fontSize: '18px' }}>
                {otherName || 'Unknown'}
              </strong>
              {conv.unreadCount > 0 && (
                <span style={unreadBadgeStyle}>
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* --- Start new chat with any user --- */}
      <h3 style={{ marginTop: '30px', color: '#e2e8f0' }}>Start New Chat</h3>
      {profiles.map(p => (
        <div
          key={p.id}
          onClick={() => startNewChat(p.id)}
          style={newChatStyle}
        >
          <span style={{ color: '#e2e8f0', fontSize: '16px' }}>
            {p.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Chats
