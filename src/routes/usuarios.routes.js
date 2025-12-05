// src/routes/usuarios.routes.js
// Rutas para gestión de usuarios (solo ADMINISTRADOR)

const express = require('express');
const usuariosController = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();
const soloAdmin = [authMiddleware, rolMiddleware(['ADMINISTRADOR'])];

router.get('/', soloAdmin, usuariosController.listarUsuarios);
router.post('/', soloAdmin, usuariosController.crearUsuario);
router.put('/:id', soloAdmin, usuariosController.actualizarUsuario);
router.patch('/:id/estado', soloAdmin, usuariosController.cambiarEstadoUsuario);

module.exports = router;
