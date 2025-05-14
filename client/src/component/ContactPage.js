import React from 'react';
import FAQComponent from './Subcomponentes/FAQComponent';
import MailComponent from './Subcomponentes/MailComponent';
import FooterComponent from './Subcomponentes/FooterComponent';
import BannerComponent from './Subcomponentes/BannerComponent';
import '../styles/Contact.scss';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const ContactPage = () => {
      useEffect(() => {
        const observer = new IntersectionObserver((entries, observerInstance) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observerInstance.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
    
        document.querySelectorAll('.contactPart').forEach((card) => observer.observe(card));
    
        return () => observer.disconnect();
      }, []);

    return (
        <>
        <BannerComponent/>
            <div className="contact-page">

                <div className="hero-section contactPart">
                    <div className='hero-cta'>
                        <img src="images/get-help.jpg" alt="Imagen de ayuda" />
                        <div className='bg-info'>
                            <h1>¿En qué podemos ayudar?</h1>
                            <p>Conéctate con nosotros para recibir apoyo y resolver todas tus dudas</p>
                        </div>
                    </div>
                </div>
                <FAQComponent />
                <MailComponent />
            </div>
            <FooterComponent />
        </>
    );
};

export default ContactPage;
