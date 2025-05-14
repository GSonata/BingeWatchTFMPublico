import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

// SCSS personalizado
import '../../styles/movieCarousel.scss';

const imdbIDs = [
  "tt9376612", // Shang-Chi
  "tt0029047", // Chicago
  "tt13622970", // Moana 2
  "tt0103285",  // China
  "tt7975244"   // Jumanji
];

function MovieCarouselComponent() {
  const [movies, setMovies] = useState([]);

  // Refs para título y carrusel
  const titleRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviePromises = imdbIDs.map(id =>
          axios.get(`http://localhost:3000/movies/${id}`, { withCredentials: true }).then(res => res.data)
        );
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.error("❌ Error al cargar películas del carrusel:", error);
      }
    };

    fetchMovies();
  }, []);

  // Efecto de aparición al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    if (titleRef.current) observer.observe(titleRef.current);
    if (carouselRef.current) observer.observe(carouselRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="carouselSection">
      <h1 ref={titleRef} className="carouselTitle fadeUp">
        Las recomendaciones de la semana
        <p>Algunas recomendaciones de nuestro equipo, directamente para ti</p>
      </h1>

      <div ref={carouselRef} className="carouselWrapper fadeUp">
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          navigation
          effect="coverflow"
          grabCursor={false}
          centeredSlides={true}
          slidesPerView={3}
          watchSlidesProgress={true}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          className="movieCarousel"
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index} style={{ width: '300px' }}>
              <div className="slide">
                <img src={movie.poster} alt={movie.title} />
                <div className="bg-info">
                  <p>{movie.title}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default MovieCarouselComponent;
