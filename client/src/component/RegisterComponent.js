import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function RegisterComponent() {
    const [formData, setFormData] = useState({
        user: '',
        email: '',
        alias: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { user, email, alias, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/register', {
                user,
                email,
                alias,
                password
            });

            if (response.status === 200) {
                Swal.fire('✅ Usuario registrado exitosamente');
                setFormData({
                    user: '',
                    email: '',
                    alias: '',
                    password: '',
                    confirmPassword: ''
                });
                setError('');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al registrar el usuario.';
            setError(msg);
        }
    };

    return (
        <div>
            <h2>Registro de Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="user"
                    placeholder="Nombre de usuario (login)"
                    value={formData.user}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="alias"
                    placeholder="Alias visible"
                    value={formData.alias}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Mostrar contraseñas
                </label>
                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
}

export default RegisterComponent;
