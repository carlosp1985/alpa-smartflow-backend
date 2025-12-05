// src/services/ventas.service.js
// Servicio de gestión de ventas

const { Op } = require('sequelize');
const {
  Venta,
  VentaDetalle,
  Producto,
  Cliente,
  Usuario,
  MovimientoInventario,
  sequelize
} = require('../models');

/**
 * Crea una venta completa con sus detalles, actualizando inventario y movimientos.
 */
async function crearVenta({ cliente_id, medio_pago, items, nota }, usuario_id) {
  if (!medio_pago || !Array.isArray(items) || items.length === 0) {
    throw new Error('medio_pago e items son requeridos');
  }

  return sequelize.transaction(async (t) => {
    // Cargar productos y validar
    const productoIds = items.map((i) => i.producto_id);
    const productos = await Producto.findAll({
      where: { id: { [Op.in]: productoIds }, activo: true },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    const productosMap = new Map();
    productos.forEach((p) => productosMap.set(p.id, p));

    // Validar existencia y stock suficiente
    for (const item of items) {
      const producto = productosMap.get(item.producto_id);
      if (!producto) {
        throw new Error(`Producto no encontrado o inactivo (ID: ${item.producto_id})`);
      }

      const cantidad = Number(item.cantidad || 0);
      if (cantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      if (producto.stock_actual < cantidad) {
        throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
      }
    }

    // Calcular totales
    let total_bruto = 0;
    let total_descuentos = 0;
    let total_impuestos = 0;

    const detallesCalculados = items.map((item) => {
      const producto = productosMap.get(item.producto_id);
      const cantidad = Number(item.cantidad || 0);
      const porcentaje_descuento = Number(item.porcentaje_descuento || 0);

      const precio_unitario = Number(producto.precio_venta || 0);
      const subtotal = precio_unitario * cantidad;
      const montoDescuento = (subtotal * porcentaje_descuento) / 100;
      const baseImponible = subtotal - montoDescuento;
      const iva_porcentaje = Number(producto.iva_porcentaje || 0);
      const iva_monto = (baseImponible * iva_porcentaje) / 100;
      const total_linea = baseImponible + iva_monto;

      total_bruto += subtotal;
      total_descuentos += montoDescuento;
      total_impuestos += iva_monto;

      return {
        producto,
        cantidad,
        precio_unitario,
        porcentaje_descuento,
        subtotal,
        iva_porcentaje,
        iva_monto,
        total_linea
      };
    });

    const total_neto = total_bruto - total_descuentos + total_impuestos;

    // Crear cabecera de venta
    const venta = await Venta.create(
      {
        fecha: new Date(),
        cliente_id: cliente_id || null,
        usuario_id,
        total_bruto,
        total_descuentos,
        total_impuestos,
        total_neto,
        medio_pago,
        estado: 'COMPLETADA',
        nota: nota || null
      },
      { transaction: t }
    );

    // Crear detalles y movimientos de inventario
    for (const det of detallesCalculados) {
      const producto = det.producto;

      await VentaDetalle.create(
        {
          venta_id: venta.id,
          producto_id: producto.id,
          cantidad: det.cantidad,
          precio_unitario: det.precio_unitario,
          porcentaje_descuento: det.porcentaje_descuento,
          subtotal: det.subtotal,
          iva_porcentaje: det.iva_porcentaje,
          iva_monto: det.iva_monto,
          total_linea: det.total_linea
        },
        { transaction: t }
      );

      const stock_anterior = producto.stock_actual;
      const stock_nuevo = stock_anterior - det.cantidad;

      if (stock_nuevo < 0) {
        throw new Error(`El movimiento generaría stock negativo para el producto ${producto.nombre}`);
      }

      producto.stock_actual = stock_nuevo;
      await producto.save({ transaction: t });

      await MovimientoInventario.create(
        {
          producto_id: producto.id,
          tipo_movimiento: 'VENTA',
          cantidad: det.cantidad,
          stock_anterior,
          stock_nuevo,
          referencia_tipo: 'VENTA',
          referencia_id: venta.id,
          usuario_id,
          fecha: new Date(),
          nota: nota || 'Venta en punto de venta'
        },
        { transaction: t }
      );
    }

    return venta;
  });
}

/**
 * Lista ventas con filtros opcionales.
 */
async function listarVentas({ fecha_inicio, fecha_fin, estado }) {
  const where = {};

  if (fecha_inicio && fecha_fin) {
    const inicio = new Date(`${fecha_inicio}T00:00:00`);
    const fin = new Date(`${fecha_fin}T23:59:59`);
    where.fecha = {
      [Op.between]: [inicio, fin]
    };
  }

  if (estado) {
    where.estado = estado;
  }

  const ventas = await Venta.findAll({
    where,
    include: [
      {
        model: Cliente,
        as: 'cliente',
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

  return ventas;
}

/**
 * Obtiene una venta con sus detalles, cliente y usuario.
 */
async function obtenerVentaPorId(id) {
  const venta = await Venta.findByPk(id, {
    include: [
      {
        model: Cliente,
        as: 'cliente'
      },
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nombre', 'apellido', 'email']
      },
      {
        model: VentaDetalle,
        as: 'detalles',
        include: [
          {
            model: Producto,
            as: 'producto',
            attributes: ['id', 'codigo', 'nombre']
          }
        ]
      }
    ]
  });

  if (!venta) {
    throw new Error('Venta no encontrada');
  }

  return venta;
}

/**
 * Anula una venta y revierte el stock de los productos.
 */
async function anularVenta(id, usuario_id) {
  return sequelize.transaction(async (t) => {
    const venta = await Venta.findByPk(id, {
      include: [{ model: VentaDetalle, as: 'detalles' }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    if (venta.estado === 'ANULADA') {
      throw new Error('La venta ya está anulada');
    }

    // Revertir stock por cada detalle
    for (const det of venta.detalles) {
      const producto = await Producto.findByPk(det.producto_id, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!producto) {
        throw new Error(`Producto no encontrado (ID: ${det.producto_id})`);
      }

      const stock_anterior = producto.stock_actual;
      const stock_nuevo = stock_anterior + det.cantidad;

      producto.stock_actual = stock_nuevo;
      await producto.save({ transaction: t });

      await MovimientoInventario.create(
        {
          producto_id: producto.id,
          tipo_movimiento: 'AJUSTE_POSITIVO',
          cantidad: det.cantidad,
          stock_anterior,
          stock_nuevo,
          referencia_tipo: 'ANULACION_VENTA',
          referencia_id: venta.id,
          usuario_id,
          fecha: new Date(),
          nota: 'Reverso de stock por anulación de venta'
        },
        { transaction: t }
      );
    }

    venta.estado = 'ANULADA';
    await venta.save({ transaction: t });

    return venta;
  });
}

module.exports = {
  crearVenta,
  listarVentas,
  obtenerVentaPorId,
  anularVenta
};
