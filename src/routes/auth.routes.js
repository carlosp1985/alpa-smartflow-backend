// src/routes/auth.routes.js
// Rutas para autenticación de usuarios

const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Inicio de sesión
router.post('/login', authController.login);

// Información del usuario autenticado
router.get('/me', authMiddleware, authController.obtenerPerfil);

module.exports = router;
