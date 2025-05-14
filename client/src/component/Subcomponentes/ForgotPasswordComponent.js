import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/forgot-password.scss';

function ForgotPasswordModalComponent({ onClose }) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${baseUrl}/auth/request-password-reset`, { email });
      Swal.fire('📨 Revisa tu correo', 'Hemos enviado instrucciones para restablecer tu contraseña.', 'success');
      setEmail('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="forgot-modal-overlay" onClick={onClose}>
      <div className="forgot-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="forgot-modal-close" onClick={onClose}>×</button>
        <h3>Recuperar contraseña</h3>
        <h4>Introduce tu email para recibir un correo, con el que podrás recuperar tu contraseña</h4>
        <form onSubmit={handleRequest}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isSending}>
            {isSending ? 'Enviando...' : 'Enviar enlace de recuperación'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordModalComponent;
