// src/routes/reportes.routes.js
// Rutas para reportes del sistema POS

const express = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = express.Router();

// Todas las rutas de este router se montarán detrás de authMiddleware en routes/index.js

router.get('/ventas-por-fecha', reportesController.ventasPorFecha);
router.get('/ventas-por-producto', reportesController.ventasPorProducto);
router.get('/inventario-bajo', reportesController.inventarioBajo);

module.exports = router;
