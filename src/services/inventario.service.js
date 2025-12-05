// src/services/inventario.service.js
// Servicio de gestión de inventario (movimientos y ajustes)

const { Op } = require('sequelize');
const { MovimientoInventario, Producto, Usuario, sequelize } = require('../models');

/**
 * Obtiene movimientos de inventario con filtros opcionales.
 */
async function listarMovimientos({ producto_id, tipo_movimiento, fecha_inicio, fecha_fin }) {
  const where = {};

  if (producto_id) {
    where.producto_id = producto_id;
  }

  if (tipo_movimiento) {
    where.tipo_movimiento = tipo_movimiento;
  }

  if (fecha_inicio && fecha_fin) {
    const inicio = new Date(`${fecha_inicio}T00:00:00`);
    const fin = new Date(`${fecha_fin}T23:59:59`);
    where.fecha = {
      [Op.between]: [inicio, fin]
    };
  }

  const movimientos = await MovimientoInventario.findAll({
    where,
    include: [
      {
        model: Producto,
        as: 'producto',
        attributes: ['id', 'nombre']
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido']
      }
    ],
    order: [['fecha', 'DESC'], ['id', 'DESC']]
  });

  return movimientos.map((m) => ({
    id: m.id,
    producto_id: m.producto_id,
    producto_nombre: m.producto ? m.producto.nombre : null,
    tipo_movimiento: m.tipo_movimiento,
    cantidad: m.cantidad,
    stock_anterior: m.stock_anterior,
    stock_nuevo: m.stock_nuevo,
    referencia_tipo: m.referencia_tipo,
    referencia_id: m.referencia_id,
    usuario_id: m.usuario_id,
    usuario_nombre: m.usuario ? `${m.usuario.nombre} ${m.usuario.apellido}` : null,
    fecha: m.fecha,
    nota: m.nota
  }));
}

/**
 * Registra un ajuste de inventario manual.
 */
async function registrarAjuste({ producto_id, tipo_movimiento, cantidad, nota, usuario_id }) {
  if (!['AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'].includes(tipo_movimiento)) {
    throw new Error('tipo_movimiento inválido para ajuste de inventario');
  }

  return sequelize.transaction(async (t) => {
    const producto = await Producto.findByPk(producto_id, { transaction: t });

    if (!producto || !producto.activo) {
      throw new Error('Producto no encontrado o inactivo');
    }

    const stock_anterior = producto.stock_actual;
    let stock_nuevo;

    if (tipo_movimiento === 'AJUSTE_POSITIVO') {
      stock_nuevo = stock_anterior + cantidad;
    } else {
      stock_nuevo = stock_anterior - cantidad;
      if (stock_nuevo < 0) {
        throw new Error('El ajuste generaría un stock negativo');
      }
    }

    producto.stock_actual = stock_nuevo;
    await producto.save({ transaction: t });

    const movimiento = await MovimientoInventario.create(
      {
        producto_id,
        tipo_movimiento,
        cantidad,
        stock_anterior,
        stock_nuevo,
        referencia_tipo: 'AJUSTE',
        referencia_id: null,
        usuario_id,
        fecha: new Date(),
        nota
      },
      { transaction: t }
    );

    return { producto, movimiento };
  });
}

module.exports = {
  listarMovimientos,
  registrarAjuste
};
