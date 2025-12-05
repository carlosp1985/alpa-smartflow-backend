// src/config/env.js
// Configuración centralizada de variables de entorno

const dotenv = require('dotenv');

// Carga variables desde el archivo .env
dotenv.config();

const config = {
  // Puerto en el que se levantará el servidor HTTP
  port: process.env.PORT || 3000,

  // Configuración de base de datos MySQL
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'alpa_smartflow_pos',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },

  // Configuración de JWT
  jwtSecret: process.env.JWT_SECRET || 'cambia_este_secreto_en_produccion',
  jwtExpiration: process.env.JWT_EXPIRATION || '8h'
};

module.exports = config;
