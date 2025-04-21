import React from 'react';
import FAQComponent from './Subcomponentes/FAQComponent';
import MailComponent from './Subcomponentes/MailComponent';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <h2>📬 Página de contacto</h2>
            <FAQComponent />
            <MailComponent />
        </div>
    );
};

export default ContactPage;
