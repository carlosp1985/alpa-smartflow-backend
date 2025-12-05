// src/services/clientes.service.js
// Servicio de gestión de clientes

const { Op } = require('sequelize');
const { Cliente } = require('../models');
const { getPagination } = require('../utils/pagination.util');

/**
 * Lista clientes con paginación y búsqueda opcional por nombre o documento.
 */
async function listarClientes({ page = 1, limit = 10, buscar }) {
  const { offset, limit: limitNumber } = getPagination(page, limit);

  const where = {};

  if (buscar) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${buscar}%` } },
      { numero_documento: { [Op.like]: `%${buscar}%` } }
    ];
  }

  const { count, rows } = await Cliente.findAndCountAll({
    where,
    offset,
    limit: limitNumber,
    order: [['nombre', 'ASC']]
  });

  return {
    total: count,
    clientes: rows,
    page: Number(page),
    limit: limitNumber
  };
}

/**
 * Obtiene un cliente por ID.
 */
async function obtenerClientePorId(id) {
  const cliente = await Cliente.findByPk(id);

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  return cliente;
}

/**
 * Crea un nuevo cliente.
 */
async function crearCliente(data) {
  const cliente = await Cliente.create(data);
  return cliente;
}

/**
 * Actualiza un cliente existente.
 */
async function actualizarCliente(id, data) {
  const cliente = await Cliente.findByPk(id);

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  const camposActualizables = [
    'tipo_documento',
    'numero_documento',
    'nombre',
    'telefono',
    'email',
    'direccion',
    'activo'
  ];

  camposActualizables.forEach((campo) => {
    if (data[campo] !== undefined) {
      cliente[campo] = data[campo];
    }
  });

  await cliente.save();

  return cliente;
}

module.exports = {
  listarClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente
};
