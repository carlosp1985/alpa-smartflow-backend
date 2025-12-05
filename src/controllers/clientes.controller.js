// src/controllers/clientes.controller.js
// Controlador para gestión de clientes

const clientesService = require('../services/clientes.service');

// GET /api/clientes
async function listarClientes(req, res) {
  try {
    const { page = 1, limit = 10, buscar } = req.query;

    const data = await clientesService.listarClientes({ page, limit, buscar });

    return res.json({
      ok: true,
      data,
      message: 'Clientes obtenidos correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al listar clientes'
    });
  }
}

// GET /api/clientes/:id
async function obtenerCliente(req, res) {
  try {
    const { id } = req.params;

    const cliente = await clientesService.obtenerClientePorId(id);

    return res.json({
      ok: true,
      data: cliente,
      message: 'Cliente obtenido correctamente'
    });
  } catch (error) {
    const status = error.message === 'Cliente no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al obtener cliente'
    });
  }
}

// POST /api/clientes
async function crearCliente(req, res) {
  try {
    const cliente = await clientesService.crearCliente(req.body);

    return res.status(201).json({
      ok: true,
      data: cliente,
      message: 'Cliente creado correctamente'
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: error.message || 'Error al crear cliente'
    });
  }
}

// PUT /api/clientes/:id
async function actualizarCliente(req, res) {
  try {
    const { id } = req.params;

    const cliente = await clientesService.actualizarCliente(id, req.body);

    return res.json({
      ok: true,
      data: cliente,
      message: 'Cliente actualizado correctamente'
    });
  } catch (error) {
    const status = error.message === 'Cliente no encontrado' ? 404 : 400;
    return res.status(status).json({
      ok: false,
      message: error.message || 'Error al actualizar cliente'
    });
  }
}

module.exports = {
  listarClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente
};
