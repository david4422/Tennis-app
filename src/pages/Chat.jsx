// --- Chat Page ---
// Real-time chat room between two users using Supabase Realtime
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

function Chat() {
  // --- State ---
  const { id } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherName, setOtherName] = useState('')
  const bottomRef = useRef(null)

  // --- Load conversation info + existing messages ---
  useEffect(() => {
    async function load() {
      // Get the conversation with both user names
      const { data: conv } = await supabase
        .from('conversations')
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(name),
          user2:profiles!conversations_user2_id_fkey(name)
        `)
        .eq('id', id)
        .single()

      if (conv) {
        const name = conv.user1_id === user.id ? conv.user2?.name : conv.user1?.name
        setOtherName(name || 'Unknown')
      }

      // Get all existing messages in this conversation
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(name)')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

      if (msgs) setMessages(msgs)

      // --- Mark conversation as read ---
      const { data: existing } = await supabase
        .from('conversation_reads')
        .select('id')
        .eq('conversation_id', id)
        .eq('user_id', user.id)
        .single()

      if (existing) {
        await supabase
          .from('conversation_reads')
          .update({ last_read_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('conversation_reads')
          .insert({ conversation_id: id, user_id: user.id })
      }
    }

    load()
  }, [id, user])

  // --- Subscribe to new messages via Supabase Realtime ---
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`,
        },
        async (payload) => {
          // Fetch the full message with sender name
          const { data } = await supabase
            .from('messages')
            .select('*, sender:profiles!messages_sender_id_fkey(name)')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, data])
          }
        }
      )
      .subscribe()

    // Cleanup: remove channel when leaving the page
    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  // --- Auto-scroll to bottom when new messages arrive ---
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // --- Send a message ---
  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim()) return

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: id,
        sender_id: user.id,
        content: newMessage.trim(),
      })

    if (error) {
      console.error('Error sending message:', error)
    } else {
      // Clear input — Realtime will deliver the message to both users
      setNewMessage('')
    }
  }

  // --- Styles ---
  const pageStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
  }

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  }

  const formStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  }

  const inputStyle = {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#1a1a2e',
    color: 'white',
  }

  const sendButtonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#0d6efd',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }

  function bubbleStyle(isMe) {
    return {
      background: isMe ? '#0d6efd' : '#1a1a2e',
      padding: '10px 15px',
      borderRadius: '12px',
      maxWidth: '70%',
    }
  }

  // --- Render ---
  return (
    <div style={pageStyle}>
      <h2 style={{ color: '#e2e8f0' }}>Chat with {otherName}</h2>

      {/* --- Messages list --- */}
      <div style={messagesContainerStyle}>
        {messages.map(msg => {
          const isMe = msg.sender_id === user.id
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                margin: '5px 0',
              }}
            >
              <div style={bubbleStyle(isMe)}>
                <small style={{ color: '#94a3b8' }}>
                  {msg.sender?.name}
                </small>
                <p style={{ margin: '4px 0 0', color: '#e2e8f0' }}>
                  {msg.content}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* --- Message input form --- */}
      <form onSubmit={sendMessage} style={formStyle}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={inputStyle}
        />
        <button type="submit" style={sendButtonStyle}>
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
