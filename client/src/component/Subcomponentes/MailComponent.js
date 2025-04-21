import React, { useState } from 'react';
import Swal from 'sweetalert2';

const MailComponent = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/contact/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, message })
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire("✅ Enviado", "Tu mensaje ha sido registrado correctamente.", "success");
                setEmail('');
                setMessage('');
            } else {
                Swal.fire("⚠️ Error", result.error || "Hubo un problema al enviar tu mensaje.", "error");
            }
        } catch (error) {
            Swal.fire("🚫 Error", "No se pudo enviar el mensaje.", "error");
        }
    };

    return (
        <section className="mail-component">
            <h3>✉️ Envíanos un mensaje</h3>
            <form onSubmit={sendMessage}>
                <label>📧 Tu correo</label>
                <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>📝 Tu mensaje</label>
                <textarea
                    placeholder="Describe tu problema o pregunta..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button type="submit">Enviar</button>
            </form>
        </section>
    );
};

export default MailComponent;
