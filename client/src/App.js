import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import ResetPasswordPageComponent from './component/ResetPasswordPageComponent';
import ContactPage from './component/ContactPage';
import "./App.scss";

// Ruta privada: solo accede si está autenticado
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <p></p>;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Ruta pública: solo accede si NO está autenticado
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <p></p>;

    return !isAuthenticated ? children : <Navigate to="/user" />;
};

function App() {
    const { setIsAuthenticated, logout } = useAuth();

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
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<MainPageComponent />} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginComponent />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterComponent />
                        </PublicRoute>
                    }
                />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPageComponent />} />

                {/* Rutas privadas */}
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
                <Route
                    path="/friend/:userId"
                    element={
                        <PrivateRoute>
                            <FriendPageComponent />
                        </PrivateRoute>
                    }
                />
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
