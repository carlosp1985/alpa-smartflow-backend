// src/services/config.service.js
// Servicio para gestión de parámetros de configuración del sistema

const { Configuracion } = require('../models');

/**
 * Obtiene todos los parámetros de configuración como objeto clave-valor.
 */
async function obtenerConfiguracion() {
  const registros = await Configuracion.findAll();

  const config = {};
  registros.forEach((item) => {
    config[item.clave] = item.valor;
  });

  return config;
}

/**
 * Crea o actualiza un parámetro de configuración.
 */
async function actualizarParametro(clave, valor) {
  let registro = await Configuracion.findOne({ where: { clave } });

  if (!registro) {
    registro = await Configuracion.create({ clave, valor });
  } else {
    registro.valor = valor;
    await registro.save();
  }

  return registro;
}

module.exports = {
  obtenerConfiguracion,
  actualizarParametro
};
