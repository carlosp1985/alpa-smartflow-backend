// src/routes/categorias.routes.js
// Rutas para gestión de categorías

const express = require('express');
const categoriasController = require('../controllers/categorias.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();
const protegido = [authMiddleware, rolMiddleware(['ADMINISTRADOR'])];

router.get('/', authMiddleware, categoriasController.listarCategorias);
router.get('/:id', authMiddleware, categoriasController.obtenerCategoria);
router.post('/', protegido, categoriasController.crearCategoria);
router.put('/:id', protegido, categoriasController.actualizarCategoria);
router.patch('/:id/estado', protegido, categoriasController.cambiarEstadoCategoria);

module.exports = router;
