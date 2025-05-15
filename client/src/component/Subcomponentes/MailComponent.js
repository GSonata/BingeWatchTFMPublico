import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/mail.scss';

const MailComponent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL;

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim().length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Mensaje demasiado corto',
        text: 'Por favor, escribe al menos 10 caracteres.',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setIsSending(true);

    try {
      console.log('📬 Enviando mensaje a:', `${baseUrl}/contact/send`);
      const response = await fetch(`${baseUrl}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '✅ Enviado',
          text: 'Tu mensaje ha sido enviado correctamente.',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setEmail('');
        setMessage('');
      } else {
        Swal.fire({
          icon: 'warning',
          title: '⚠️ Error',
          text: result.error || 'Hubo un problema al enviar tu mensaje.',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      Swal.fire({
        icon: 'error',
        title: '🚫 Error',
        text: 'No se pudo enviar el mensaje.',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mail-component contactPart">
      <h3>✉️ Envíanos un mensaje</h3>
      <h2>
        Considera que nuestro equipo es pequeño, por lo que podríamos tardar un poco en responder. 
        Pero no temas, recibirás un correo de confirmación.
      </h2>
      <form onSubmit={sendMessage}>
        <label htmlFor="email">📧 Tu correo <span className="required-star">*</span></label>
        <input
          id="email"
          type="email"
          placeholder="ejemplo@correo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="message">📝 Tu mensaje <span className="required-star">*</span></label>
        <textarea
          id="message"
          placeholder="Describe tu problema o pregunta..."
          required
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" disabled={isSending}>
          {isSending ? <span className="spinner" /> : 'Enviar'}
        </button>
      </form>
    </section>
  );
};

export default MailComponent;
