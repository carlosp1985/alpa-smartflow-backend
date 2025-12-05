// src/routes/config.routes.js
// Rutas para gestión de parámetros de configuración

const express = require('express');
const configController = require('../controllers/config.controller');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();

// Las rutas se montarán con authMiddleware (y rol ADMINISTRADOR para PUT) en routes/index.js

router.get('/', configController.obtenerConfiguracion);
router.put('/:clave', rolMiddleware(['ADMINISTRADOR']), configController.actualizarParametro);

module.exports = router;
