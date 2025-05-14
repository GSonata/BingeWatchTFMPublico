import React, { useState } from 'react';
import ModalComponent from './ModalComponent';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../../styles/Footer.scss';

function FooterComponent() {
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', content: '' });

  const openModal = (title, content) => {
    setModalInfo({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalInfo({ isOpen: false, title: '', content: '' });
  };

  return (
    <footer className="mainFooter">
      <div className="footerGrid">

        <div className="footerColumn">
          <h4>Repositorio</h4>
          <ul>
            <li><a href="https://github.com/GSonata/BingeWatchTFM" target="_blank" rel="noreferrer">GitHub</a></li>
            <li className='repo-undertext'>El acceso al repositorio es publico y se encomienda y se agradece las mejoras</li>
          </ul>
        </div>

        <div className="footerColumn">
          <h4>Acerca de</h4>
          <ul>
            <li><p onClick={() => openModal('Información de esta aplicación', 'BingeWatch es una plataforma diseñada para ayudarte a gestionar tu colección de películas, organizar y clasificar tus títulos según diversos criterios como género, año de lanzamiento, director, entre otros. Además, podrás agregar notas personalizadas sobre cada película, marcar tus favoritas y llevar un registro de las películas que han marcado tu vida. Es una herramienta intuitiva, pensada para cinéfilos que buscan tener el control completo de sus colecciones y compartir recomendaciones con amigos. La aplicación es de codigo abierto pero requiere de mención para su uso. Cualquier aportación al repositorio, que se puede encontrar en este mismo footer es bienvenida.')}>Información de esta aplicación</p></li>
            <li><p onClick={() => openModal('Agradecimientos', 'Quiero agradecer a mi familia, mis amigos y a mi pareja. Por todas las tardecitas de cafe y cerveza que me perdi y por todos mis monologos sobre esta aplicacion ¡Muchas gracias!')}>Agradecimientos</p></li>
            <li><a href="/contact">Contacta con nosotros</a></li>
          </ul>
        </div>

        <div className="footerColumn">
          <h4>Conecta</h4>
          <div className="socialLinks">
            <a href="https://github.com" target="_blank" rel="noreferrer"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://www.linkedin.com/in/jose-manuel-prados-morente-61951219a/" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>



      {modalInfo.isOpen && (
        <ModalComponent
          title={modalInfo.title}
          content={modalInfo.content}
          onClose={closeModal}
        />
      )}

      <div className="footerCopy">
        © 2025 BingeWatch. Todos los derechos reservados.
      </div>

    </footer>
  );
}

export default FooterComponent;
