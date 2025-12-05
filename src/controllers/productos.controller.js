// src/controllers/productos.controller.js
// Controlador para gestión de productos

const productosService = require('../services/productos.service');

// GET /api/productos
async function listarProductos(req, res) {
  try {
    const { buscar, categoria_id, solo_activos } = req.query;

    const soloActivosBool = solo_activos === 'true';

    const productos = await productosService.listarProductos({
      buscar,
      categoria_id,
      solo_activos: soloActivosBool
    });

    return res.json({
      ok: true,
      data: productos,
      message: 'Productos obtenidos correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al listar productos'
    });
  }
}

// GET /api/productos/:id
async function obtenerProducto(req, res) {
  try {
    const { id } = req.params;

    const producto = await productosService.obtenerProductoPorId(id);

    return res.json({
      ok: true,
      data: producto,
      message: 'Producto obtenido correctamente'
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al obtener producto'
    });
  }
}

// POST /api/productos
async function crearProducto(req, res) {
  try {
    const usuarioId = req.user ? req.user.id : null;
    const producto = await productosService.crearProducto(req.body, usuarioId);

    return res.status(201).json({
      ok: true,
      data: producto,
      message: 'Producto creado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al crear producto'
    });
  }
}

// PUT /api/productos/:id
async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;

    const producto = await productosService.actualizarProducto(id, req.body);

    return res.json({
      ok: true,
      data: producto,
      message: 'Producto actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al actualizar producto'
    });
  }
}

// PATCH /api/productos/:id/estado
async function cambiarEstadoProducto(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (activo === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'El campo activo es requerido'
      });
    }

    const producto = await productosService.cambiarEstadoProducto(id, activo);

    return res.json({
      ok: true,
      data: producto,
      message: 'Estado de producto actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al cambiar estado de producto'
    });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto
};
