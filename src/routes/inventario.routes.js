// src/routes/inventario.routes.js
// Rutas para gestión de inventario (movimientos y ajustes)

const express = require('express');
const inventarioController = require('../controllers/inventario.controller');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();

// Las rutas de este router se montarán con authMiddleware en routes/index.js
// Para ajustes se requiere además rol ADMINISTRADOR.

router.get('/movimientos', inventarioController.listarMovimientos);
router.post('/ajustes', rolMiddleware(['ADMINISTRADOR']), inventarioController.registrarAjuste);

module.exports = router;
