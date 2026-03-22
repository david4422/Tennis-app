// --- Login Page ---
// Email + password login form using Supabase Auth
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function Login() {
  // --- State ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // --- Handle login submit ---
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      return
    }

    navigate('/')
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
    background: '#58a6ff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  }

  // --- Render ---
  return (
    <div style={containerStyle}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Password</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
