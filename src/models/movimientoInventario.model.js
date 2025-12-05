// src/models/movimientoInventario.model.js
// Modelo de Movimiento de Inventario para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const MovimientoInventario = sequelize.define(
    'MovimientoInventario',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'productos',
          key: 'id'
        }
      },
      tipo_movimiento: {
        type: DataTypes.ENUM('INICIAL', 'COMPRA', 'VENTA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'),
        allowNull: false
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock_anterior: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock_nuevo: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      referencia_tipo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      referencia_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        }
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      nota: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'movimientos_inventario',
      timestamps: true
    }
  );

  return MovimientoInventario;
};
