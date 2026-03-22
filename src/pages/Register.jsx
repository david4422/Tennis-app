// --- Register Page ---
// Creates a new user in Supabase Auth, then updates their profile
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Register() {
  // --- State ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [skillLevel, setSkillLevel] = useState('beginner')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // --- Handle registration submit ---
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Step 1: Create auth user (this also triggers the database trigger to create a profile row)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Step 2: Update the auto-created profile with name, phone, skill level
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name, phone, skill_level: skillLevel })
      .eq('id', data.user.id)

    if (profileError) {
      setError(profileError.message)
      return
    }

    setSuccess(true)
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
      <h1>Register</h1>
      {success && <p style={{ color: 'green' }}>Registration successful!</p>}
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
        <div style={fieldStyle}>
          <label>Name</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Phone</label><br />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
