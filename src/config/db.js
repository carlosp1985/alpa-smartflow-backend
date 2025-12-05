// src/config/db.js
// Configuración e instancia de Sequelize para MySQL

const { Sequelize } = require('sequelize');
const config = require('./env');

// Se crea la instancia de Sequelize usando variables de entorno centralizadas
const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false // Se puede habilitar en desarrollo si se desea
  }
);

module.exports = sequelize;
