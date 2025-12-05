// src/utils/hash.util.js
// Utilidades para hash y verificación de contraseñas utilizando bcrypt

const bcrypt = require('bcrypt');

// Número de rondas de sal. En producción se puede aumentar si el rendimiento lo permite.
const SALT_ROUNDS = 10;

/**
 * Genera un hash seguro de una contraseña en texto plano.
 * @param {string} password Contraseña en texto plano.
 * @returns {Promise<string>} Hash de la contraseña.
 */
async function encriptarPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compara una contraseña en texto plano con un hash almacenado.
 * @param {string} password Contraseña en texto plano.
 * @param {string} hash Hash almacenado.
 * @returns {Promise<boolean>} true si coinciden, false en caso contrario.
 */
function compararPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  encriptarPassword,
  compararPassword
};
