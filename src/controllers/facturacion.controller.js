// src/controllers/facturacion.controller.js
// Controlador para gestión de facturación electrónica (arquitectura v1)

const facturacionService = require('../services/facturacion.service');

// GET /api/facturacion/:venta_id
async function obtenerPorVenta(req, res) {
  try {
    const { venta_id } = req.params;

    const registro = await facturacionService.obtenerPorVenta(venta_id);

    if (!registro) {
      return res.json({
        ok: true,
        data: null,
        message: 'La venta no tiene información de facturación electrónica registrada.'
      });
    }

    return res.json({
      ok: true,
      data: registro,
      message: 'Información de facturación electrónica obtenida correctamente'
    });
  } catch (error) {
    const status = error.message === 'Venta no encontrada' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al obtener información de facturación electrónica'
    });
  }
}

// POST /api/facturacion/:venta_id
async function crearParaVenta(req, res) {
  try {
    const { venta_id } = req.params;

    const registro = await facturacionService.crearParaVenta(venta_id, req.body);

    return res.status(201).json({
      ok: true,
      data: registro,
      message: 'Registro de facturación electrónica creado correctamente'
    });
  } catch (error) {
    const status =
      error.message && error.message.startsWith('La venta ya tiene')
        ? 400
        : error.message === 'Venta no encontrada'
          ? 404
          : 400;

    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al crear registro de facturación electrónica'
    });
  }
}

// PATCH /api/facturacion/:venta_id
async function actualizarParaVenta(req, res) {
  try {
    const { venta_id } = req.params;

    const registro = await facturacionService.actualizarParaVenta(venta_id, req.body);

    return res.json({
      ok: true,
      data: registro,
      message: 'Registro de facturación electrónica actualizado correctamente'
    });
  } catch (error) {
    const status =
      error.message && error.message.startsWith('La venta no tiene')
        ? 400
        : 400;

    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al actualizar registro de facturación electrónica'
    });
  }
}

module.exports = {
  obtenerPorVenta,
  crearParaVenta,
  actualizarParaVenta
};
