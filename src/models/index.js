// src/models/index.js
// Inicializa Sequelize, registra los modelos y configura las asociaciones

const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Se guarda la instancia de Sequelize y el constructor para uso posterior
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importación y definición de modelos
db.Usuario = require('./usuario.model')(sequelize, Sequelize.DataTypes);
db.Categoria = require('./categoria.model')(sequelize, Sequelize.DataTypes);
db.Producto = require('./producto.model')(sequelize, Sequelize.DataTypes);
db.Cliente = require('./cliente.model')(sequelize, Sequelize.DataTypes);
db.Venta = require('./venta.model')(sequelize, Sequelize.DataTypes);
db.VentaDetalle = require('./ventaDetalle.model')(sequelize, Sequelize.DataTypes);
db.MovimientoInventario = require('./movimientoInventario.model')(sequelize, Sequelize.DataTypes);
db.FacturacionElectronica = require('./facturacionElectronica.model')(sequelize, Sequelize.DataTypes);
db.Configuracion = require('./configuracion.model')(sequelize, Sequelize.DataTypes);

// Definición de asociaciones entre modelos

// Usuario tiene muchas Ventas
db.Usuario.hasMany(db.Venta, { foreignKey: 'usuario_id', as: 'ventas' });
db.Venta.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Cliente tiene muchas Ventas
db.Cliente.hasMany(db.Venta, { foreignKey: 'cliente_id', as: 'ventas' });
db.Venta.belongsTo(db.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Categoria tiene muchos Productos
db.Categoria.hasMany(db.Producto, { foreignKey: 'categoria_id', as: 'productos' });
db.Producto.belongsTo(db.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// Producto tiene muchos VentaDetalle
db.Producto.hasMany(db.VentaDetalle, { foreignKey: 'producto_id', as: 'detallesVenta' });
db.VentaDetalle.belongsTo(db.Producto, { foreignKey: 'producto_id', as: 'producto' });

// Venta tiene muchas VentaDetalle
db.Venta.hasMany(db.VentaDetalle, { foreignKey: 'venta_id', as: 'detalles' });
db.VentaDetalle.belongsTo(db.Venta, { foreignKey: 'venta_id', as: 'venta' });

// Producto tiene muchos MovimientoInventario
db.Producto.hasMany(db.MovimientoInventario, { foreignKey: 'producto_id', as: 'movimientosInventario' });
db.MovimientoInventario.belongsTo(db.Producto, { foreignKey: 'producto_id', as: 'producto' });

// Usuario tiene muchos MovimientoInventario
db.Usuario.hasMany(db.MovimientoInventario, { foreignKey: 'usuario_id', as: 'movimientosInventario' });
db.MovimientoInventario.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Venta tiene una FacturacionElectronica
db.Venta.hasOne(db.FacturacionElectronica, { foreignKey: 'venta_id', as: 'facturacionElectronica' });
db.FacturacionElectronica.belongsTo(db.Venta, { foreignKey: 'venta_id', as: 'venta' });

module.exports = db;
