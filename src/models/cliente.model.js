// src/models/cliente.model.js
// Modelo de Cliente para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define(
    'Cliente',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tipo_documento: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      numero_documento: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      tableName: 'clientes',
      timestamps: true
    }
  );

  return Cliente;
};
