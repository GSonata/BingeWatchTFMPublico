import React, { useState } from 'react';


const FAQComponent = () => {
    const [openItems, setOpenItems] = useState([]);
    const faqs = [
        {
            question: "¿Cómo puedo registrar una película?",
            answer: "Ve a tu panel de usuario y pulsa en 'Añadir película'."
        },
        {
            question: "¿Dónde puedo ver mis insignias?",
            answer: "En tu perfil, debajo de tu información personal."
        },
        {
            question: "¿Puedo añadir amigos?",
            answer: "Sí, desde cualquier perfil de usuario puedes pulsar 'Añadir a amigos'."
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
        <section className="faq-component">
            <h3>📖 Preguntas frecuentes</h3>
            {faqs.map((item, index) => (
                <div key={index} className="faq-item">
                    <button
                        className="faq-question"
                        onClick={() => toggleItem(index)}
                    >
                        {item.question}
                    </button>
                    {openItems.includes(index) && (
                        <div className="faq-answer">
                            {item.answer}
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default FAQComponent;
