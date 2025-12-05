// src/controllers/reportes.controller.js
// Controlador para endpoints de reportes

const reportesService = require('../services/reportes.service');

// GET /api/reportes/ventas-por-fecha
async function ventasPorFecha(req, res) {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        ok: false,
        message: 'fecha_inicio y fecha_fin son obligatorias en formato YYYY-MM-DD'
      });
    }

    const data = await reportesService.obtenerVentasPorFecha(fecha_inicio, fecha_fin);

    return res.json({
      ok: true,
      data,
      message: 'Reporte de ventas por fecha generado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al generar reporte de ventas por fecha'
    });
  }
}

// GET /api/reportes/ventas-por-producto
async function ventasPorProducto(req, res) {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        ok: false,
        message: 'fecha_inicio y fecha_fin son obligatorias en formato YYYY-MM-DD'
      });
    }

    const data = await reportesService.obtenerVentasPorProducto(fecha_inicio, fecha_fin);

    return res.json({
      ok: true,
      data,
      message: 'Reporte de ventas por producto generado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al generar reporte de ventas por producto'
    });
  }
}

// GET /api/reportes/inventario-bajo
async function inventarioBajo(req, res) {
  try {
    const data = await reportesService.obtenerInventarioBajo();

    return res.json({
      ok: true,
      data,
      message: 'Reporte de inventario bajo generado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al generar reporte de inventario bajo'
    });
  }
}

module.exports = {
  ventasPorFecha,
  ventasPorProducto,
  inventarioBajo
};
