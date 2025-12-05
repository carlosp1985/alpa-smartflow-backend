// src/routes/productos.routes.js
// Rutas para gestión de productos

const express = require('express');
const productosController = require('../controllers/productos.controller');

const router = express.Router();

// Todas estas rutas se montan detrás de authMiddleware en routes/index.js

router.get('/', productosController.listarProductos);
router.get('/:id', productosController.obtenerProducto);
router.post('/', productosController.crearProducto);
router.put('/:id', productosController.actualizarProducto);
router.patch('/:id/estado', productosController.cambiarEstadoProducto);

module.exports = router;
