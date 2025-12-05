// src/models/producto.model.js
// Modelo de Producto para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define(
    'Producto',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias',
          key: 'id'
        }
      },
      precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },
      iva_porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0
      },
      stock_actual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'productos',
      timestamps: true
    }
  );

  return Producto;
};
