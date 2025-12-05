// src/services/reportes.service.js
// Servicio para generación de reportes del sistema POS

const { Op, Sequelize } = require('sequelize');
const { Venta, Cliente, Usuario, VentaDetalle, Producto, Categoria } = require('../models');

/**
 * Reporte de ventas por fecha.
 * Excluye ventas con estado 'ANULADA' en esta primera versión.
 */
async function obtenerVentasPorFecha(fechaInicio, fechaFin) {
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin}T23:59:59`);

  const ventas = await Venta.findAll({
    where: {
      fecha: {
        [Op.between]: [inicio, fin]
      },
      estado: {
        [Op.ne]: 'ANULADA'
      }
    },
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
    order: [['fecha', 'ASC']]
  });

  const lista = ventas.map((venta) => ({
    id: venta.id,
    fecha: venta.fecha,
    total_neto: venta.total_neto,
    medio_pago: venta.medio_pago,
    estado: venta.estado,
    cliente_nombre: venta.cliente ? venta.cliente.nombre : null,
    usuario_nombre: venta.usuario
      ? `${venta.usuario.nombre} ${venta.usuario.apellido}`
      : null
  }));

  const totalVentas = lista.length;
  const sumaTotalNeto = lista.reduce(
    (acc, v) => acc + Number(v.total_neto || 0),
    0
  );

  return {
    ventas: lista,
    resumen: {
      total_ventas: totalVentas,
      suma_total_neto: sumaTotalNeto
    }
  };
}

/**
 * Reporte de ventas agrupadas por producto en un rango de fechas.
 * Solo considera ventas con estado 'COMPLETADA'.
 */
async function obtenerVentasPorProducto(fechaInicio, fechaFin) {
  const inicio = new Date(`${fechaInicio}T00:00:00`);
  const fin = new Date(`${fechaFin}T23:59:59`);

  const detalles = await VentaDetalle.findAll({
    include: [
      {
        model: Venta,
        as: 'venta',
        where: {
          fecha: {
            [Op.between]: [inicio, fin]
          },
          estado: 'COMPLETADA'
        },
        attributes: []
      },
      {
        model: Producto,
        as: 'producto',
        attributes: ['id', 'nombre']
      }
    ]
  });

  const agregados = new Map();

  detalles.forEach((detalle) => {
    const producto = detalle.producto;
    if (!producto) return;

    const key = producto.id;
    if (!agregados.has(key)) {
      agregados.set(key, {
        producto_id: producto.id,
        nombre: producto.nombre,
        cantidad_total_vendida: 0,
        total_ventas: 0
      });
    }

    const item = agregados.get(key);
    item.cantidad_total_vendida += Number(detalle.cantidad || 0);
    item.total_ventas += Number(detalle.total_linea || 0);
  });

  return {
    productos: Array.from(agregados.values())
  };
}

/**
 * Reporte de productos con inventario bajo (stock_actual <= stock_minimo).
 */
async function obtenerInventarioBajo() {
  const productos = await Producto.findAll({
    where: {
      activo: true,
      stock_actual: {
        [Op.lte]: Sequelize.col('stock_minimo')
      }
    },
    include: [
      {
        model: Categoria,
        as: 'categoria',
        attributes: ['nombre']
      }
    ]
  });

  return productos.map((p) => ({
    id: p.id,
    codigo: p.codigo,
    nombre: p.nombre,
    stock_actual: p.stock_actual,
    stock_minimo: p.stock_minimo,
    categoria: p.categoria ? p.categoria.nombre : null
  }));
}

module.exports = {
  obtenerVentasPorFecha,
  obtenerVentasPorProducto,
  obtenerInventarioBajo
};
