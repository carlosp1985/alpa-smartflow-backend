// src/app.js
// Configuración principal de la aplicación Express

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const apiRoutes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Habilita CORS para permitir solicitudes desde el frontend
app.use(cors());

// Logger de peticiones HTTP
app.use(morgan('dev'));

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Servir archivos estáticos del frontend AngularJS
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src')));

// Ruta raíz que devuelve la aplicación frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src', 'index.html'));
});

// Prefijo para todas las rutas de la API
app.use('/api', apiRoutes);

// Middleware de manejo global de errores (debe ir al final de la cadena de middlewares)
app.use(errorHandler);

module.exports = app;
