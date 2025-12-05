// src/services/auth.service.js
// Servicio de autenticación de usuarios

const { Usuario } = require('../models');
const { compararPassword } = require('../utils/hash.util');
const { generarToken } = require('../utils/jwt.util');

/**
 * Inicia sesión de un usuario a partir de username y password.
 * @param {string} username
 * @param {string} password
 */
async function login(username, password) {
  // Busca el usuario por username
  const usuario = await Usuario.findOne({ where: { username } });

  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  if (!usuario.activo) {
    throw new Error('El usuario se encuentra inactivo');
  }

  const passwordValida = await compararPassword(password, usuario.password_hash);

  if (!passwordValida) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol
  };

  const token = generarToken(payload);

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol
    }
  };
}

/**
 * Obtiene la información del usuario autenticado.
 * @param {number} idUsuario
 */
async function obtenerPerfil(idUsuario) {
  const usuario = await Usuario.findByPk(idUsuario, {
    attributes: { exclude: ['password_hash'] }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return usuario;
}

module.exports = {
  login,
  obtenerPerfil
};
