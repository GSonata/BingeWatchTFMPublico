import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/mainPage.scss';
import { useState, useEffect } from 'react';
import MovieCarouselComponent from './Subcomponentes/MovieCarouselComponent';
import FooterComponent from './Subcomponentes/FooterComponent';


function MainPageComponent() {

    const [isMobile, setIsMobile] = useState(false);

    const introductionData = [
        {
            icon: 'images/iconos/peliculas.png',
            title: '¿Qué es BingeWatch?',
            text:
                '¡Descubre el placer de coleccionar películas como nunca antes! BingeWatch es una plataforma diseñada para catalogar, organizar y disfrutar de una base de datos de todas tus películas.',
        },
        {
            icon: 'images/iconos/database.png',
            title: '¿Cómo funciona BingeWatch?',
            text:
                'Agrega títulos, organízalos por género, año o director, y guarda notas sobre cada uno. También podrás marcar tus películas favoritas y llevar un registro de futuras adquisiciones.',
        },
        {
            icon: 'images/iconos/notice.png',
            title: '¿Por qué BingeWatch?',
            text:
                'Somos una plataforma desarrollada por y para cinéfilos, comprendemos la importancia del orden y la claridad. Valoramos la comunidad por encima de todo.',
        },
    ];

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile(); // inicial
        window.addEventListener('resize', checkIfMobile); // escucha cambios

        return () => window.removeEventListener('resize', checkIfMobile); // limpieza
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll(".introCard").forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);





    return (
        <>
            <section className="callAction">
                <div
                    className="background"
                    style={
                        isMobile
                            ? {
                                backgroundImage: "url('/cta-movil.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }
                            : {}
                    }
                >
                    {!isMobile && (
                        <video autoPlay muted loop playsInline>
                            <source src="/montajePeliculas.mp4" type="video/mp4" />
                            Tu navegador no soporta videos HTML5.
                        </video>
                    )}

                    <div className="overlay"></div>

                    <div className="callContent">
                        <div className="ccImage">
                            <img
                                src="/images/bw-logo-white.png"
                                alt="Logo BingeWatch"
                                className="main-cta-logo"
                            />
                        </div>
                        <div className="ccText">
                            <h2>
                                Binge<span style={{ color: '#6fa8dc' }}>Watch</span>
                            </h2>
                            <h3>Un lugar, todas tus películas</h3>
                            <div className="ccButtons">
                                <Link to="/login" className="ccButton ccButton--primary">
                                    ¡Empieza a coleccionar!
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <figure className="arrowCTA">
                    <a href="#introduction">
                        <img src="/images/iconos/flecha.svg" alt="Flecha hacia abajo" />
                    </a>
                </figure>
            </section>

            <section className="introduction" id="introduction">
                <div className="introGrid">
                    {introductionData.map((item, index) => (
                        <div
                            className={`introCard introCard--${index}`}
                            key={index}
                            style={{ animationDelay: `${index * 0.3}s` }}
                        >
                            <div className="iconWrapper">
                                <img src={item.icon} alt="icon" className="introIcon" />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>
            <MovieCarouselComponent />
            <FooterComponent />
        </>
    );
}

export default MainPageComponent;
