import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            onLoginSuccess();
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="w-80">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form inputs for username and password */}
                <input type="text" placeholder="admin" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;