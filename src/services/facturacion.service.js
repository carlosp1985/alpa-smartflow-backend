// src/services/facturacion.service.js
// Servicio para gestión de facturación electrónica (arquitectura v1, sin integración externa)

const { FacturacionElectronica, Venta } = require('../models');

/**
 * Obtiene la información de facturación electrónica asociada a una venta.
 */
async function obtenerPorVenta(venta_id) {
  const venta = await Venta.findByPk(venta_id);

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  const registro = await FacturacionElectronica.findOne({ where: { venta_id } });

  return registro;
}

/**
 * Crea un registro de facturación electrónica para una venta.
 */
async function crearParaVenta(venta_id, datos) {
  const venta = await Venta.findByPk(venta_id);

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  const existente = await FacturacionElectronica.findOne({ where: { venta_id } });

  if (existente) {
    throw new Error('La venta ya tiene un registro de facturación electrónica. Use PATCH para actualizar.');
  }

  const registro = await FacturacionElectronica.create({
    venta_id,
    cufe: datos.cufe || null,
    xml_ruta: datos.xml_ruta || null,
    pdf_ruta: datos.pdf_ruta || null,
    estado_dian: datos.estado_dian || 'PENDIENTE',
    mensaje_respuesta: datos.mensaje_respuesta || null
  });

  return registro;
}

/**
 * Actualiza un registro de facturación electrónica asociado a una venta.
 */
async function actualizarParaVenta(venta_id, datos) {
  const registro = await FacturacionElectronica.findOne({ where: { venta_id } });

  if (!registro) {
    throw new Error('La venta no tiene un registro de facturación electrónica. Use POST para crearlo.');
  }

  const camposActualizables = ['estado_dian', 'mensaje_respuesta', 'cufe', 'xml_ruta', 'pdf_ruta'];

  camposActualizables.forEach((campo) => {
    if (datos[campo] !== undefined) {
      registro[campo] = datos[campo];
    }
  });

  await registro.save();

  return registro;
}

module.exports = {
  obtenerPorVenta,
  crearParaVenta,
  actualizarParaVenta
};
