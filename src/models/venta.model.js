// src/models/venta.model.js
// Modelo de Venta para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const Venta = sequelize.define(
    'Venta',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'clientes',
          key: 'id'
        }
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      total_bruto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      total_descuentos: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      total_impuestos: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      total_neto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      medio_pago: {
        type: DataTypes.ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'MIXTO', 'OTRO'),
        allowNull: false
      },
      estado: {
        type: DataTypes.ENUM('COMPLETADA', 'ANULADA'),
        allowNull: false,
        defaultValue: 'COMPLETADA'
      },
      nota: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'ventas',
      timestamps: true
    }
  );

  return Venta;
};
