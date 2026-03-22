// --- Request Card Component ---
// Displays a single match request with accept/cancel buttons
function RequestCard({ request, currentUserId, onAccept, onCancel }) {
  // --- Check ownership and status ---
  const isOwner = request.user_id === currentUserId
  const isOpen = request.status === 'open'

  // --- Status badge colors ---
  const statusColors = {
    open: '#3fb950',
    accepted: '#58a6ff',
    cancelled: '#f85149',
    expired: '#8b949e',
  }

  // --- Styles ---
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

  const badgeStyle = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    background: statusColors[request.status],
  }

  const infoStyle = {
    margin: '8px 0',
    color: '#555',
  }

  const acceptStyle = {
    padding: '8px 16px',
    background: '#58a6ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  const cancelStyle = {
    padding: '8px 16px',
    background: '#f85149',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }

  // --- Render ---
  return (
    <div style={cardStyle}>
      {/* --- Player name + status badge --- */}
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>{request.profiles.name}</h3>
        <span style={badgeStyle}>
          {request.status}
        </span>
      </div>

      {/* --- Match details --- */}
      <p style={infoStyle}>
        {request.profiles.skill_level} | {request.location}
      </p>
      <p style={infoStyle}>
        {request.game_date} | {request.game_time}
      </p>

      {/* --- Action buttons --- */}
      {isOpen && !isOwner && (
        <button onClick={() => onAccept(request.id)} style={acceptStyle}>
          Accept
        </button>
      )}

      {isOpen && isOwner && (
        <button onClick={() => onCancel(request.id)} style={cancelStyle}>
          Cancel
        </button>
      )}
    </div>
  )
}

export default RequestCard
