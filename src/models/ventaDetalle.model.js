// src/models/ventaDetalle.model.js
// Modelo de Detalle de Venta para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const VentaDetalle = sequelize.define(
    'VentaDetalle',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ventas',
          key: 'id'
        }
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id'
        }
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      porcentaje_descuento: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      iva_porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      iva_monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      total_linea: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    },
    {
      tableName: 'ventas_detalle',
      timestamps: true
    }
  );

  return VentaDetalle;
};
