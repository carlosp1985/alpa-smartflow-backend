// src/services/categorias.service.js
// Servicio de gestión de categorías de productos

const { Categoria } = require('../models');

/**
 * Lista categorías, opcionalmente filtrando solo activas.
 */
async function listarCategorias({ incluirInactivas = false } = {}) {
  const where = {};

  if (!incluirInactivas) {
    where.activo = true;
  }

  const categorias = await Categoria.findAll({
    where,
    order: [['nombre', 'ASC']]
  });

  return categorias;
}

/**
 * Obtiene una categoría por su ID.
 */
async function obtenerCategoriaPorId(id) {
  const categoria = await Categoria.findByPk(id);
  return categoria;
}

/**
 * Crea una nueva categoría.
 */
async function crearCategoria(data) {
  const { nombre, descripcion } = data;

  const categoria = await Categoria.create({
    nombre,
    descripcion,
    activo: true
  });

  return categoria;
}

/**
 * Actualiza nombre y/o descripción de una categoría.
 */
async function actualizarCategoria(id, data) {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }

  if (data.nombre !== undefined) {
    categoria.nombre = data.nombre;
  }

  if (data.descripcion !== undefined) {
    categoria.descripcion = data.descripcion;
  }

  await categoria.save();

  return categoria;
}

/**
 * Cambia el estado activo de una categoría.
 */
async function cambiarEstadoCategoria(id, activo) {
  const categoria = await Categoria.findByPk(id);

  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }

  categoria.activo = !!activo;
  await categoria.save();

  return categoria;
}

module.exports = {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
  obtenerCategoriaPorId
};
