// src/controllers/config.controller.js
// Controlador para gestión de parámetros de configuración

const configService = require('../services/config.service');

// GET /api/config
async function obtenerConfiguracion(req, res) {
  try {
    const data = await configService.obtenerConfiguracion();

    return res.json({
      ok: true,
      data,
      message: 'Parámetros de configuración obtenidos correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al obtener parámetros de configuración'
    });
  }
}

// PUT /api/config/:clave
async function actualizarParametro(req, res) {
  try {
    const { clave } = req.params;
    const { valor } = req.body;

    if (!valor && valor !== '') {
      return res.status(400).json({
        ok: false,
        message: 'El campo valor es requerido'
      });
    }

    const registro = await configService.actualizarParametro(clave, valor);

    return res.json({
      ok: true,
      data: {
        clave: registro.clave,
        valor: registro.valor
      },
      message: 'Parámetro de configuración actualizado correctamente.'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al actualizar parámetro de configuración'
    });
  }
}

module.exports = {
  obtenerConfiguracion,
  actualizarParametro
};
