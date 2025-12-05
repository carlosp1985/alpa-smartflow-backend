// src/models/facturacionElectronica.model.js
// Modelo de Facturación Electrónica para el sistema AlPa SmartFlow POS

module.exports = (sequelize, DataTypes) => {
  const FacturacionElectronica = sequelize.define(
    'FacturacionElectronica',
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
      cufe: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      xml_ruta: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      pdf_ruta: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      estado_dian: {
        type: DataTypes.ENUM('PENDIENTE', 'ENVIADA', 'ACEPTADA', 'RECHAZADA'),
        allowNull: false,
        defaultValue: 'PENDIENTE'
      },
      mensaje_respuesta: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'facturacion_electronica',
      timestamps: true
    }
  );

  return FacturacionElectronica;
};
