import React, { useState } from 'react';
import '../../styles/FaqComponent.scss';

const FAQComponent = () => {
  const [openItems, setOpenItems] = useState([]);

  const faqs = [
    {
      question: "He olvidado mi contraseña",
      answer: "En caso de que hayas olvidado tu contraseña, dirígete a la página de <a href='/login'>Login</a> y pulsa el botón <strong>He olvidado mi contraseña</strong>. Nuestro equipo te mandará un correo a la dirección indicada para restaurar tu contraseña."
    },
    {
      question: "He perdido mis insignias",
      answer: "Si las insignias que habías conseguido dejan de mostrarse en tu perfil, por favor, ten paciencia. Probablemente la página esté recibiendo mantenimiento o nuestro equipo esté actualizando la base de datos de insignias. Si el error persiste, ponte en contacto con nosotros a través del <a href='#contact-form'>formulario</a> situado en esta misma página."
    },
    {
      question: "Una película que tengo no aparece",
      answer: "Nuestra página está en constante crecimiento. Cuantos más usuarios la usen, más películas aparecerán. Sin embargo, puede darse el caso de que la película no esté registrada en nuestro sistema. En ese caso, por favor <a href='#contact-form'>ponte en contacto con nosotros</a>. Si confirmamos la ausencia de esa película en nuestra base de datos, te pediremos los datos necesarios para su correcta inserción."
    },
    {
      question: "¿Puedo cambiar mi alias visible?",
      answer: "Sí, puedes cambiar tu alias desde tu <a href='/profile'>perfil</a>. Pulsa en el botón <strong>[...]</strong> y modifica tu alias visible. Esto no afectará tu correo de acceso ni tu historial."
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="faq-component contactPart">
      <h3>Preguntas frecuentes de otros usuarios</h3>
      {faqs.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${openItems.includes(index) ? 'open' : ''}`}
        >
          <button
            className="faq-question"
            onClick={() => toggleItem(index)}
          >
            {item.question}
          </button>
          {openItems.includes(index) && (
            <div
              className="faq-answer"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          )}
        </div>
      ))}
    </section>
  );
};

export default FAQComponent;
