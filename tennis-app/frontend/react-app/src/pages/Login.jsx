import { UserService } from '../services/userService';
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!email || !password){
            setMessage('Please fill in email and password.');
            setSuccess(false);
            return;
        }
        setLoading(true);
        setMessage('');
        const result = await UserService.login(email, password);
        setLoading(false);
        setMessage(result.message);
        if(result.success){
            setEmail('');
            setPassword('');
            setSuccess(true);
        }
        else{
            setSuccess(false);
        }
    }
    return (
        <div className="login-page" style={{ padding: '32px' }}>
            <h1>Login</h1>
            <p>Login to your account.</p>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                {message && (
                    <div style={{ color: success ? 'green' : 'red' }}>{message}</div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}
export default Login;