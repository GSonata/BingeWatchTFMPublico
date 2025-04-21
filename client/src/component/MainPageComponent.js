import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/mainPage.css';


function MainPageComponent() {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Bienvenido a BingeWatch</h1>
            <p>Gestiona tus películas y descubre nuevas aventuras cinematográficas.</p>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="/search">Buscar Películas</Link>
                    </li>
                    <li>
                        <Link to="/login">Iniciar Sesión</Link>
                    </li>
                    <li>
                        <Link to="/register">Registrar</Link>
                    </li>
                    <li>
                        <Link to="/collection">Coleccion</Link>
                    </li>
                    <li>
                        <Link to="/friend-activity">Actividad</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contacto</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default MainPageComponent;
