import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterComponent from './RegisterComponent';
import FooterComponent from './Subcomponentes/FooterComponent';
import ForgotPasswordModalComponent from './Subcomponentes/ForgotPasswordComponent';
import '../styles/login.scss';
import '../styles/forgot-password.scss';
import '../styles/register.scss';

function LoginComponent() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${baseUrl}/login`, {
        user,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser('');
        setPassword('');

        Swal.fire({
          toast: true,
          position: 'bottom',
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          showConfirmButton: false,
          timer: 4000,
        });

        navigate('/user');
      } else {
        throw new Error('Error al iniciar sesión.');
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.response?.data?.message || 'Error al iniciar sesión.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
    }
  };

  return (
    <>
      <div className="login-page">

        {/* Botón de volver */}
        <div className="back-to-home">
          <Link to="/">
            <img src="/images/iconos/flecha.svg" alt="Flecha volver" />
            <span>Volver a la página principal</span>
          </Link>
        </div>

        {/* Branding */}
        <div className="login-branding">
          <img src="/images/bw-logo-white.png" alt="BingeWatch Logo" />
          <h1>BingeWatch</h1>
        </div>

        <h1 className="login-title">Is this thing on?...</h1>

        <div className="login-container">
          <h2>Iniciar Sesión</h2>

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

            <div className="register-link" onClick={() => setShowForgotPasswordModal(true)}>
              ¿Olvidaste tu contraseña?
            </div>

            <button type="submit">Iniciar Sesión</button>
          </form>

          <div className="divider"></div>

          <div className="register-link" onClick={() => setShowRegisterModal(true)}>
            ¿No tienes cuenta? Regístrate aquí
          </div>
        </div>

        {showRegisterModal && (
          <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <RegisterComponent onClose={() => setShowRegisterModal(false)} />
            </div>
          </div>
        )}

        {showForgotPasswordModal && (
          <ForgotPasswordModalComponent onClose={() => setShowForgotPasswordModal(false)} />
        )}
      </div>

      <FooterComponent />
    </>
  );
}

export default LoginComponent;
