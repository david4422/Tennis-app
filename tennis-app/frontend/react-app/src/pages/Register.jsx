import { useState } from 'react';
import { UserService } from '../services/userService';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skillLevel, setSkillLevel] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage('Please fill in name, email and password.');
      setSuccess(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await UserService.register(
      name,
      email,
      password,
      phone || null,
      skillLevel || null
    );

    setLoading(false);
    setSuccess(result.success);
    setMessage(result.message);

    if (result.success) {
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSkillLevel('');
    }
  };

  return (
    <div className="register-page" style={{ padding: '32px' }}>
      <h1>Register</h1>
      <p>Create an account for the tennis app.</p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label>Full name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label>Phone (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+972-50-0000000"
          />
        </div>

        <div>
          <label>Skill level (optional)</label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {message && (
          <div style={{ color: success ? 'green' : 'red' }}>{message}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

export default Register;
