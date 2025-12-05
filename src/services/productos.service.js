// src/services/productos.service.js
// Servicio de gestión de productos

const { Op } = require('sequelize');
const { Producto, MovimientoInventario, sequelize } = require('../models');

/**
 * Lista productos con filtros opcionales.
 */
async function listarProductos({ buscar, categoria_id, solo_activos }) {
  const where = {};

  if (solo_activos === true) {
    where.activo = true;
  }

  if (categoria_id) {
    where.categoria_id = categoria_id;
  }

  if (buscar) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${buscar}%` } },
      { codigo: { [Op.like]: `%${buscar}%` } }
    ];
  }

  const productos = await Producto.findAll({
    where,
    order: [['nombre', 'ASC']]
  });

  return productos;
}

/**
 * Obtiene un producto por ID.
 */
async function obtenerProductoPorId(id) {
  const producto = await Producto.findByPk(id);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  return producto;
}

/**
 * Crea un nuevo producto. Si stock_actual > 0 crea un movimiento INICIAL.
 */
async function crearProducto(data, usuarioId) {
  return sequelize.transaction(async (t) => {
    const producto = await Producto.create(data, { transaction: t });

    if (producto.stock_actual > 0) {
      await MovimientoInventario.create(
        {
          producto_id: producto.id,
          tipo_movimiento: 'INICIAL',
          cantidad: producto.stock_actual,
          stock_anterior: 0,
          stock_nuevo: producto.stock_actual,
          referencia_tipo: 'INICIAL',
          referencia_id: null,
          usuario_id: usuarioId || null,
          fecha: new Date(),
          nota: 'Stock inicial de producto'
        },
        { transaction: t }
      );
    }

    return producto;
  });
}

/**
 * Actualiza los datos de un producto (sin afectar inventario histórico).
 */
async function actualizarProducto(id, data) {
  const producto = await Producto.findByPk(id);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  const camposActualizables = [
    'codigo',
    'nombre',
    'descripcion',
    'categoria_id',
    'precio_venta',
    'costo',
    'iva_porcentaje',
    'stock_minimo',
    'activo'
  ];

  camposActualizables.forEach((campo) => {
    if (data[campo] !== undefined) {
      producto[campo] = data[campo];
    }
  });

  // stock_actual no se cambia aquí manualmente; se maneja por movimientos / ventas / ajustes

  await producto.save();

  return producto;
}

/**
 * Cambia el estado activo/inactivo de un producto.
 */
async function cambiarEstadoProducto(id, activo) {
  const producto = await Producto.findByPk(id);

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  producto.activo = !!activo;
  await producto.save();

  return producto;
}

module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto
};
