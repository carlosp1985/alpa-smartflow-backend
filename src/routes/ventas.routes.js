// src/routes/ventas.routes.js
// Rutas para gestión de ventas

const express = require('express');
const ventasController = require('../controllers/ventas.controller');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();

// Todas estas rutas se montan detrás de authMiddleware en routes/index.js

router.post('/', ventasController.crearVenta);
router.get('/', ventasController.listarVentas);
router.get('/:id', ventasController.obtenerVenta);
router.post('/:id/anular', rolMiddleware(['ADMINISTRADOR']), ventasController.anularVenta);

module.exports = router;
