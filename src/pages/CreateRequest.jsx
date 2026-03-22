// --- Create Request Page ---
// Form to create a new match request
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

function CreateRequest() {
  // --- State ---
  const { user } = useAuth()
  const navigate = useNavigate()
  const [gameDate, setGameDate] = useState('')
  const [gameTime, setGameTime] = useState('')
  const [location, setLocation] = useState('')
  const [skillLevel, setSkillLevel] = useState('beginner')
  const [error, setError] = useState(null)

  // --- Handle form submit: insert new request into Supabase ---
   async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // 1. Insert the new request
    const { error: insertError } = await supabase
      .from('match_requests')
      .insert({
        user_id: user.id,
        game_date: gameDate,
        game_time: gameTime,
        location,
        skill_level: skillLevel,
      })

    if (insertError) {
      setError(insertError.message)
      return
    }

    // 2. Find matching open requests (same date + same location + not me)
    const { data: matchingRequests, error: matchError } = await supabase
      .from('match_requests')
      .select('*, profiles!match_requests_user_id_fkey(name)')
      .eq('status', 'open')
      .eq('game_date', gameDate)
      .ilike('location', location)
      .neq('user_id', user.id)

    console.log('Matching requests:', matchingRequests, 'Error:', matchError)

    // 3. For each match — create conversation + send message
    if (matchingRequests && matchingRequests.length > 0) {
      for (const req of matchingRequests) {
        // Check if conversation already exists
        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .or(`and(user1_id.eq.${user.id},user2_id.eq.${req.user_id}),and(user1_id.eq.${req.user_id},user2_id.eq.${user.id})`)

        let conversationId

        if (existing && existing.length > 0) {
          conversationId = existing[0].id
        } else {
          // Create new conversation
          const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert({ user1_id: user.id, user2_id: req.user_id })
            .select('id')
            .single()

          if (convError) {
            console.error('Error creating conversation:', convError)
            continue
          }
          conversationId = newConv.id
        }

        // Send auto message
        const { error: msgError } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: `Hey ${req.profiles?.name || 'there'}! I'm also looking for a match on ${gameDate} at ${location}. Want to play?`,
          })

        if (msgError) {
          console.error('Error sending auto message:', msgError)
        }
      }
    }

    navigate('/requests')
  }


  // --- Styles ---
  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
  }

  const fieldStyle = {
    marginBottom: '10px',
  }

  const inputStyle = {
    width: '100%',
    padding: '8px',
  }

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    background: '#3fb950',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }

  // --- Render ---
  return (
    <div style={containerStyle}>
      <h1>New Match Request</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Date</label><br />
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Time</label><br />
          <input
            type="time"
            value={gameTime}
            onChange={(e) => setGameTime(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Location</label><br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Skill Level</label><br />
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            style={inputStyle}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>
          Create Request
        </button>
      </form>
    </div>
  )
}

export default CreateRequest
