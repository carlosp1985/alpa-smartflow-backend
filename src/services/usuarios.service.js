// src/services/usuarios.service.js
// Servicio de gestión de usuarios

const { Usuario } = require('../models');
const { encriptarPassword } = require('../utils/hash.util');
const { getPagination } = require('../utils/pagination.util');

/**
 * Obtiene una lista paginada de usuarios.
 */
async function listarUsuarios(page = 1, limit = 10) {
  const { offset, limit: limitNumber } = getPagination(page, limit);

  const { count, rows } = await Usuario.findAndCountAll({
    offset,
    limit: limitNumber,
    attributes: { exclude: ['password_hash'] },
    order: [['id', 'ASC']]
  });

  return {
    total: count,
    usuarios: rows,
    page: Number(page),
    limit: limitNumber
  };
}

/**
 * Crea un nuevo usuario.
 */
async function crearUsuario(data) {
  const {
    nombre,
    apellido,
    email,
    username,
    password,
    rol
  } = data;

  const password_hash = await encriptarPassword(password);

  const usuario = await Usuario.create({
    nombre,
    apellido,
    email,
    username,
    password_hash,
    rol,
    activo: true
  });

  // Se excluye el hash de la respuesta
  const usuarioPlano = usuario.toJSON();
  delete usuarioPlano.password_hash;

  return usuarioPlano;
}

/**
 * Actualiza un usuario existente.
 */
async function actualizarUsuario(id, data) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const camposActualizables = ['nombre', 'apellido', 'email', 'username', 'rol'];

  camposActualizables.forEach((campo) => {
    if (data[campo] !== undefined) {
      usuario[campo] = data[campo];
    }
  });

  // Si viene password, se actualiza el hash
  if (data.password) {
    usuario.password_hash = await encriptarPassword(data.password);
  }

  await usuario.save();

  const usuarioPlano = usuario.toJSON();
  delete usuarioPlano.password_hash;

  return usuarioPlano;
}

/**
 * Cambia el estado activo/inactivo de un usuario.
 */
async function cambiarEstadoUsuario(id, activo) {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  usuario.activo = !!activo;
  await usuario.save();

  const usuarioPlano = usuario.toJSON();
  delete usuarioPlano.password_hash;

  return usuarioPlano;
}

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario
};
