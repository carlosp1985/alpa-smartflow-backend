// src/utils/jwt.util.js
// Utilidades para generación y verificación de tokens JWT

const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Genera un token JWT para un usuario.
 * @param {Object} payload Datos del usuario (por ejemplo: { id, nombre, rol }).
 * @param {string} [secret] Secreto para firmar el token. Por defecto usa config.jwtSecret.
 * @param {string} [expiresIn] Tiempo de expiración. Por defecto usa config.jwtExpiration.
 * @returns {string} Token JWT generado.
 */
function generarToken(payload, secret = config.jwtSecret, expiresIn = config.jwtExpiration) {
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verifica un token JWT y devuelve su payload si es válido.
 * @param {string} token Token JWT a verificar.
 * @param {string} [secret] Secreto para verificar el token. Por defecto usa config.jwtSecret.
 * @returns {Object} Payload decodificado del token.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
function verificarToken(token, secret = config.jwtSecret) {
  return jwt.verify(token, secret);
}

module.exports = {
  generarToken,
  verificarToken
};
