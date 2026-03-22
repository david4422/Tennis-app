// --- Matches Page ---
// Shows all matches the current user is part of
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

function Matches() {
  // --- State ---
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // --- Fetch matches on page load ---
  useEffect(() => {
    fetchMatches()
  }, [])

  // --- Fetch matches from Supabase with player profiles ---
  async function fetchMatches() {
    setLoading(true)

    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        player1:profiles!matches_player1_id_fkey(name, skill_level),
        player2:profiles!matches_player2_id_fkey(name, skill_level)
      `)
      .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
      .order('game_date')
      .order('game_time')

    if (error) {
      console.error(error)
    } else {
      setMatches(data)
    }
    setLoading(false)
  }

  // --- Styles ---
  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
  }

  const cardStyle = {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  function statusBadgeStyle(status) {
    const colors = {
      upcoming: '#58a6ff',
      completed: '#3fb950',
    }
    return {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      color: 'white',
      background: colors[status] || '#f85149',
    }
  }

  const infoStyle = {
    margin: '8px 0',
    color: '#555',
  }

  // --- Render ---
  return (
    <div style={containerStyle}>
      <h1>My Matches</h1>

      {loading && <p>Loading...</p>}
      {!loading && matches.length === 0 && <p>No matches yet. Accept a request to create one!</p>}

      {!loading && matches.map((match) => {
        // Figure out who the opponent is
        const opponent = match.player1_id === user.id ? match.player2 : match.player1

        return (
          <div key={match.id} style={cardStyle}>
            {/* --- Opponent name + status --- */}
            <div style={headerStyle}>
              <h3 style={{ margin: 0 }}>vs {opponent.name}</h3>
              <span style={statusBadgeStyle(match.status)}>
                {match.status}
              </span>
            </div>
            {/* --- Match details --- */}
            <p style={infoStyle}>
              {opponent.skill_level} | {match.location}
            </p>
            <p style={infoStyle}>
              {match.game_date} | {match.game_time}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default Matches
