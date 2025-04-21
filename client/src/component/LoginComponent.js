import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

function LoginComponent() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setIsAuthenticated } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:3000/login',
                { user, password },
                { withCredentials: true } 
            );

            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser('');
                setPassword('');
                setError('');
            } else {
                setError('Error al iniciar sesión.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión.');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginComponent;
