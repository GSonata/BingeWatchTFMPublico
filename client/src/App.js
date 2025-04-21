import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import MainPageComponent from './component/MainPageComponent';
import SearchPageComponent from './component/SearchPageComponent';
import MovieDetailComponent from './component/MovieDetailComponent';
import LoginComponent from './component/LoginComponent';
import RegisterComponent from './component/RegisterComponent';
import UserCollectionPage from './component/UserCollectionPage';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import UserPageComponent from './component/UserPageComponent';
import FriendPageComponent from './component/FriendPageComponent';
import FriendActivityComponent from './component/FriendActivityComponent';
import ContactPage from './component/ContactPage';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <p></p>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const { isAuthenticated, setIsAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            logout();
            setIsAuthenticated(false);
        } catch (err) {
            console.error('Error al cerrar sesión:', err.message);
        }
    };

    return (
        <Router>
            <nav>
                <Link to="/">Inicio</Link>
                {!isAuthenticated && <Link to="/login">Iniciar Sesión</Link>}
                {!isAuthenticated && <Link to="/register">Registrarse</Link>}
                {isAuthenticated && <Link to="/search">Buscar Películas</Link>}
                {isAuthenticated && <Link to="/user">Perfil de Usuario</Link>}
                {isAuthenticated && (
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Cerrar Sesión</button>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<MainPageComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/register" element={<RegisterComponent />} />
                <Route path="/contact" element={<ContactPage />} />


                {/* LAS RUTAS MARCADAS CON PRIVATE ROUTE SON PRIVADAS*/}
                <Route
                    path="/search"
                    element={
                        <PrivateRoute>
                            <SearchPageComponent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/movies/:imdbID"
                    element={
                        <PrivateRoute>
                            <MovieDetailComponent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user"
                    element={
                        <PrivateRoute>
                            <UserPageComponent />
                        </PrivateRoute>
                    }
                />

                <Route path="/friend/:userId"
                    element={
                        <PrivateRoute>
                            <FriendPageComponent />
                        </PrivateRoute>
                    } />


                <Route
                    path="/collection"
                    element={
                        <PrivateRoute>
                            <UserCollectionPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/friend-activity"
                    element={
                        <PrivateRoute>
                            <FriendActivityComponent />
                        </PrivateRoute>
                    }
                />

            </Routes>
        </Router>
    );
}

export default App;
