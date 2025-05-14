import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/register.scss';

function RegisterComponent({ onClose }) {
    const [formData, setFormData] = useState({
        user: '',
        email: '',
        alias: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const checkPasswordRequirements = (password, confirmPassword) => {
        return {
            tooShort: password.length < 5,
            noUppercase: !/[A-Z]/.test(password),
            noNumber: !/\d/.test(password),
            noSymbol: !/[^A-Za-z0-9]/.test(password),
            noMatch: password !== confirmPassword
        };
    };

    const isFormValid = () => {
        const { user, email, alias, password, confirmPassword } = formData;
        const issues = checkPasswordRequirements(password, confirmPassword);
        const hasNoIssues = Object.values(issues).every((v) => v === false);
        return (
            user &&
            email &&
            alias &&
            password &&
            confirmPassword &&
            hasNoIssues
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { user, email, alias, password, confirmPassword } = formData;

        const issues = checkPasswordRequirements(password, confirmPassword);
        if (Object.values(issues).some((v) => v)) {
            setError('La contraseña no cumple los requisitos.');
            return;
        } else {
            setError('');
        }

        try {
            const response = await axios.post(`${baseUrl}/register`, {
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
                if (onClose) onClose();
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al registrar el usuario.';
            setError(msg);
        }
    };

    const { password, confirmPassword } = formData;
    const requirements = checkPasswordRequirements(password, confirmPassword);

    return (
        <div className="register-container">
            <button className="register-close" onClick={onClose}>×</button>
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="user">Nombre de usuario (login) *</label>
                    <input type="text" name="user" value={formData.user} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="alias">Alias visible</label>
                    <input type="text" name="alias" value={formData.alias} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <label className="checkbox-label">
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                    Mostrar contraseñas
                </label>
                <p className="note">
                    * El nombre de usuario no se podrá cambiar y se usará para iniciar sesión. Se recomienda usar el correo electrónico como acceso habitual.
                </p>
                {(password || confirmPassword) && Object.values(requirements).some(v => v) && (
                    <div className="warning-box">
                        <ul>
                            {requirements.tooShort && <li>Debe tener al menos 5 caracteres.</li>}
                            {requirements.noUppercase && <li>Debe tener al menos una mayúscula.</li>}
                            {requirements.noNumber && <li>Debe contener un número.</li>}
                            {requirements.noSymbol && <li>Debe incluir un símbolo.</li>}
                            {requirements.noMatch && <li>Las contraseñas deben coincidir.</li>}
                        </ul>
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={!isFormValid()}>Registrarse</button>
            </form>
        </div>
    );
}

export default RegisterComponent;
