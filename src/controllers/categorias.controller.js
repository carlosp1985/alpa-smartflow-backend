// src/controllers/categorias.controller.js
// Controlador para gestión de categorías

const categoriasService = require('../services/categorias.service');

// GET /api/categorias
async function listarCategorias(req, res) {
  try {
    const { incluir_inactivas } = req.query;

    const incluirInactivas = incluir_inactivas === 'true';

    const categorias = await categoriasService.listarCategorias({ incluirInactivas });

    return res.json({
      ok: true,
      data: categorias,
      message: 'Categorías obtenidas correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al listar categorías'
    });
  }
}

// GET /api/categorias/:id
async function obtenerCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await categoriasService.obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.json({
      ok: true,
      data: categoria,
      message: 'Categoría obtenida correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al obtener categoría'
    });
  }
}

// POST /api/categorias
async function crearCategoria(req, res) {
  try {
    const categoria = await categoriasService.crearCategoria(req.body);

    return res.status(201).json({
      ok: true,
      data: categoria,
      message: 'Categoría creada correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al crear categoría'
    });
  }
}

// PUT /api/categorias/:id
async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await categoriasService.actualizarCategoria(id, req.body);

    return res.json({
      ok: true,
      data: categoria,
      message: 'Categoría actualizada correctamente'
    });
  } catch (error) {
    const status = error.message === 'Categoría no encontrada' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al actualizar categoría'
    });
  }
}

// PATCH /api/categorias/:id/estado
async function cambiarEstadoCategoria(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (activo === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'El campo activo es requerido'
      });
    }

    const categoria = await categoriasService.cambiarEstadoCategoria(id, activo);

    return res.json({
      ok: true,
      data: categoria,
      message: 'Estado de categoría actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Categoría no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al cambiar estado de categoría'
    });
  }
}

module.exports = {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
  obtenerCategoria
};
