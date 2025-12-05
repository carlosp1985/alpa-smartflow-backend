// src/controllers/inventario.controller.js
// Controlador para gestión de inventario (movimientos y ajustes)

const inventarioService = require('../services/inventario.service');

// GET /api/inventario/movimientos
async function listarMovimientos(req, res) {
  try {
    const { producto_id, tipo_movimiento, fecha_inicio, fecha_fin } = req.query;

    const data = await inventarioService.listarMovimientos({
      producto_id,
      tipo_movimiento,
      fecha_inicio,
      fecha_fin
    });

    return res.json({
      ok: true,
      data,
      message: 'Movimientos de inventario obtenidos correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al obtener movimientos de inventario'
    });
  }
}

// POST /api/inventario/ajustes
async function registrarAjuste(req, res) {
  try {
    const { producto_id, tipo_movimiento, cantidad, nota } = req.body;

    if (!producto_id || !tipo_movimiento || !cantidad) {
      return res.status(400).json({
        ok: false,
        message: 'producto_id, tipo_movimiento y cantidad son requeridos'
      });
    }

    const usuario_id = req.user.id;

    const resultado = await inventarioService.registrarAjuste({
      producto_id,
      tipo_movimiento,
      cantidad: Number(cantidad),
      nota,
      usuario_id
    });

    return res.status(201).json({
      ok: true,
      data: resultado,
      message: 'Ajuste de inventario registrado correctamente.'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al registrar ajuste de inventario'
    });
  }
}

module.exports = {
  listarMovimientos,
  registrarAjuste
};
