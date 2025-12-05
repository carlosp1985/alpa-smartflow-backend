// src/controllers/auth.controller.js
// Controlador para endpoints de autenticación

const authService = require('../services/auth.service');

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        message: 'username y password son requeridos'
      });
    }

    const resultado = await authService.login(username, password);

    return res.json({
      ok: true,
      data: resultado,
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al iniciar sesión'
    });
  }
}

// GET /api/auth/me
async function obtenerPerfil(req, res) {
  try {
    const { id } = req.user;

    const usuario = await authService.obtenerPerfil(id);

    return res.json({
      ok: true,
      data: usuario,
      message: 'Perfil de usuario obtenido correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al obtener el perfil'
    });
  }
}

module.exports = {
  login,
  obtenerPerfil
};
