var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const conectarBBDD = require('./config/db');
const dotenv = require('dotenv');
const isProduction = process.env.NODE_ENV === 'production';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

var indexRouter = require('./routes/index');
var app = express();

// Conectar a la base de datos
conectarBBDD();

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001', // fallback útil para desarrollo local
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "78789689689790789689689798789",
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: isProduction, // true en producción, false en desarrollo
    sameSite: isProduction ? 'none' : 'lax' // 'none' permite cookies entre dominios
  }
}));

// Rutas
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Configuración para producción (React frontend)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

module.exports = app;
