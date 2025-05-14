import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function ResetPasswordPageComponent() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const baseUrl = process.env.REACT_APP_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post(`${baseUrl}/auth/reset-password`, {
        token,
        newPassword: password
      });
      Swal.fire('✅ Contraseña actualizada', 'Ahora puedes iniciar sesión con tu nueva contraseña.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="reset-page">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Restablecer</button>
      </form>
    </div>
  );
}

export default ResetPasswordPageComponent;
