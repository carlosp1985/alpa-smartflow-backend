// src/controllers/usuarios.controller.js
// Controlador para gestión de usuarios

const usuariosService = require('../services/usuarios.service');

// GET /api/usuarios
async function listarUsuarios(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const resultado = await usuariosService.listarUsuarios(page, limit);

    return res.json({
      ok: true,
      data: resultado,
      message: 'Usuarios obtenidos correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al listar usuarios'
    });
  }
}

// POST /api/usuarios
async function crearUsuario(req, res) {
  try {
    const usuario = await usuariosService.crearUsuario(req.body);

    return res.status(201).json({
      ok: true,
      data: usuario,
      message: 'Usuario creado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al crear usuario'
    });
  }
}

// PUT /api/usuarios/:id
async function actualizarUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await usuariosService.actualizarUsuario(id, req.body);

    return res.json({
      ok: true,
      data: usuario,
      message: 'Usuario actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Usuario no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al actualizar usuario'
    });
  }
}

// PATCH /api/usuarios/:id/estado
async function cambiarEstadoUsuario(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (activo === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'El campo activo es requerido'
      });
    }

    const usuario = await usuariosService.cambiarEstadoUsuario(id, activo);

    return res.json({
      ok: true,
      data: usuario,
      message: 'Estado de usuario actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Usuario no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al cambiar estado de usuario'
    });
  }
}

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario
};
