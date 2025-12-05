// src/models/configuracion.model.js
// Modelo de Configuración para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const Configuracion = sequelize.define(
    'Configuracion',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      clave: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      valor: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'configuracion',
      timestamps: true
    }
  );

  return Configuracion;
};
