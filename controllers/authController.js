const bcrypt = require('bcrypt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');


// Registrar un nuevo usuario
const register = async (req, res) => {
    const { user, email, alias, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ user }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario o correo ya está registrado.' });
        }

        const imgPath = path.join(__dirname, '..', 'public', 'images/emptyUserImage.jpg');
        const defaultImage = fs.readFileSync(imgPath, { encoding: 'base64' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            user,
            email,
            alias,
            password: hashedPassword,
            imagenPerfil: defaultImage
        });

        await newUser.save();
        res.status(200).send('Usuario registrado exitosamente.');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar el usuario.');
    }
};


// Iniciar sesión de usuario
const login = async (req, res) => {
    const { user, password } = req.body;

    try {
        const foundUser = await User.findOne({ user });
        if (foundUser && await bcrypt.compare(password, foundUser.password)) {
            req.session.user = { _id: foundUser._id, user: foundUser.user };
            res.status(200).send('Inicio de sesión exitoso.');
        } else {
            res.status(401).send('Credenciales incorrectas.');
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor.');
    }
};

// Cerrar sesión de usuario
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión.');
        }
        res.clearCookie('connect.sid');  // Eliminar la cookie de sesión
        res.status(200).send('Sesión cerrada exitosamente.');
    });
};

// Verificar si el usuario tiene una sesión activa
const checkSession = async (req, res) => {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id).select('alias email imagenPerfil');
        res.json({ isAuthenticated: true, user });
    } else {
        res.json({ isAuthenticated: false });
    }
};

module.exports = { login, logout, register, checkSession };
