// src/routes/facturacion.routes.js
// Rutas para gestión de facturación electrónica (arquitectura v1)

const express = require('express');
const facturacionController = require('../controllers/facturacion.controller');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();

// Las rutas se montarán con authMiddleware (y rol ADMINISTRADOR para POST/PATCH) en routes/index.js

router.get('/:venta_id', facturacionController.obtenerPorVenta);
router.post('/:venta_id', rolMiddleware(['ADMINISTRADOR']), facturacionController.crearParaVenta);
router.patch('/:venta_id', rolMiddleware(['ADMINISTRADOR']), facturacionController.actualizarParaVenta);

module.exports = router;
