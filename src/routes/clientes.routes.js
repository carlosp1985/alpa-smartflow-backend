// src/routes/clientes.routes.js
// Rutas para gestión de clientes

const express = require('express');
const clientesController = require('../controllers/clientes.controller');

const router = express.Router();

// Todas estas rutas se montan detrás de authMiddleware en routes/index.js

router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.obtenerCliente);
router.post('/', clientesController.crearCliente);
router.put('/:id', clientesController.actualizarCliente);

module.exports = router;
