// --- Requests Page ---
// Shows all open match requests + your own requests, with tabs to switch
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import RequestCard from '../components/RequestCard'

function Requests() {
  // --- State ---
  const { user } = useAuth()
  const [tab, setTab] = useState('all')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // --- Fetch requests when tab changes ---
  useEffect(() => {
    fetchRequests()
  }, [tab])

  // --- Fetch requests from Supabase ---
  async function fetchRequests() {
    setLoading(true)

    let query = supabase
      .from('match_requests')
      .select('*, profiles!match_requests_user_id_fkey(name, skill_level)')

    if (tab === 'all') {
      // All tab: show only open requests with future dates
      const today = new Date().toISOString().split('T')[0]
      query = query
        .eq('status', 'open')
        .gte('game_date', today)
        .order('game_date')
        .order('game_time')
    } else {
      // My tab: show all of the current user's requests
      query = query
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
    } else {
      setRequests(data)
    }

    setLoading(false)
  }

  // --- Accept a request: update status + create a match ---
  async function handleAccept(requestId) {
    const request = requests.find(r => r.id === requestId)

    // Update the request status to accepted
    const { error: updateError } = await supabase
      .from('match_requests')
      .update({ status: 'accepted', accepted_by: user.id })
      .eq('id', requestId)

    if (updateError) {
      console.error(updateError)
      return
    }

    // Create a new match record
    const { error: matchError } = await supabase
      .from('matches')
      .insert({
        request_id: requestId,
        player1_id: request.user_id,
        player2_id: user.id,
        game_date: request.game_date,
        game_time: request.game_time,
        location: request.location,
      })

    if (matchError) {
      console.error(matchError)
    }

    fetchRequests()
  }

  // --- Cancel a request: set status to cancelled ---
  async function handleCancel(requestId) {
    const confirmed = window.confirm('Are you sure you want to cancel this request?')
    if (!confirmed) return

    const { error } = await supabase
      .from('match_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)

    if (error) {
      console.error(error)
    } else {
      fetchRequests()
    }
  }

  // --- Styles ---
  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  }

  const newRequestStyle = {
    padding: '10px 20px',
    background: '#3fb950',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  }

  const tabsStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  }

  function tabButtonStyle(isActive) {
    return {
      padding: '8px 16px',
      background: isActive ? '#3fb950' : '#ddd',
      color: isActive ? 'white' : 'black',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
    }
  }

  // --- Render ---
  return (
    <div style={containerStyle}>
      {/* --- Header with title + new request button --- */}
      <div style={headerStyle}>
        <h1>Match Requests</h1>
        <Link to="/requests/new" style={newRequestStyle}>
          + New Request
        </Link>
      </div>

      {/* --- Tab buttons --- */}
      <div style={tabsStyle}>
        <button onClick={() => setTab('all')} style={tabButtonStyle(tab === 'all')}>
          All Requests
        </button>
        <button onClick={() => setTab('mine')} style={tabButtonStyle(tab === 'mine')}>
          My Requests
        </button>
      </div>

      {/* --- Request cards --- */}
      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && <p>No requests found.</p>}

      {!loading && requests.map((req) => (
        <RequestCard
          key={req.id}
          request={req}
          currentUserId={user.id}
          onAccept={handleAccept}
          onCancel={handleCancel}
        />
      ))}
    </div>
  )
}

export default Requests
