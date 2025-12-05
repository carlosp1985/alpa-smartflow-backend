// src/controllers/ventas.controller.js
// Controlador para gestión de ventas

const ventasService = require('../services/ventas.service');

// POST /api/ventas
async function crearVenta(req, res) {
  try {
    const usuario_id = req.user.id;

    const venta = await ventasService.crearVenta(req.body, usuario_id);

    return res.status(201).json({
      ok: true,
      data: venta,
      message: 'Venta registrada correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al registrar la venta'
    });
  }
}

// GET /api/ventas
async function listarVentas(req, res) {
  try {
    const { fecha_inicio, fecha_fin, estado } = req.query;

    const ventas = await ventasService.listarVentas({ fecha_inicio, fecha_fin, estado });

    return res.json({
      ok: true,
      data: ventas,
      message: 'Ventas obtenidas correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al obtener ventas'
    });
  }
}

// GET /api/ventas/:id
async function obtenerVenta(req, res) {
  try {
    const { id } = req.params;

    const venta = await ventasService.obtenerVentaPorId(id);

    return res.json({
      ok: true,
      data: venta,
      message: 'Venta obtenida correctamente'
    });
  } catch (error) {
    const status = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al obtener venta'
    });
  }
}

// POST /api/ventas/:id/anular
async function anularVenta(req, res) {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const venta = await ventasService.anularVenta(id, usuario_id);

    return res.json({
      ok: true,
      data: venta,
      message: 'Venta anulada correctamente'
    });
  } catch (error) {
    const status =
      error.message === 'Venta no encontrada' || error.message === 'La venta ya está anulada'
        ? 400
        : 400;

    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al anular venta'
    });
  }
}

module.exports = {
  crearVenta,
  listarVentas,
  obtenerVenta,
  anularVenta
};
