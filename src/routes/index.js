// src/routes/index.js
// Router principal de la API. Aquí se montan los routers por módulo.

const express = require('express');

const authRoutes = require('./auth.routes');
const usuariosRoutes = require('./usuarios.routes');
const categoriasRoutes = require('./categorias.routes');
// productos.routes, clientes.routes y ventas.routes se asumen creadas previamente
// eslint-disable-next-line global-require
const productosRoutes = require('./productos.routes');
// eslint-disable-next-line global-require
const clientesRoutes = require('./clientes.routes');
// eslint-disable-next-line global-require
const ventasRoutes = require('./ventas.routes');
const reportesRoutes = require('./reportes.routes');
const inventarioRoutes = require('./inventario.routes');
const configRoutes = require('./config.routes');
const facturacionRoutes = require('./facturacion.routes');

const authMiddleware = require('../middleware/auth.middleware');
const rolMiddleware = require('../middleware/rol.middleware');

const router = express.Router();

// Ruta de estado simple para verificar que la API está en ejecución
router.get('/status', (req, res) => {
  return res.json({
    status: 'ok',
    message: 'AlPa SmartFlow POS API'
  });
});

// Autenticación (no requiere estar autenticado previamente)
router.use('/auth', authRoutes);

// Usuarios (solo ADMINISTRADOR) -> protección ya aplicada en usuarios.routes
router.use('/usuarios', usuariosRoutes);

// Categorías
router.use('/categorias', categoriasRoutes);

// Productos
router.use('/productos', authMiddleware, productosRoutes);

// Clientes
router.use('/clientes', authMiddleware, clientesRoutes);

// Ventas
router.use('/ventas', authMiddleware, ventasRoutes);

// Reportes (todos requieren usuario autenticado)
router.use('/reportes', authMiddleware, reportesRoutes);

// Inventario: movimientos para cualquier usuario autenticado,
// ajustes solo para ADMINISTRADOR (se valida dentro de las rutas/controladores)
router.use('/inventario', authMiddleware, inventarioRoutes);

// Configuración: lectura para cualquier usuario autenticado,
// actualización solo ADMINISTRADOR (se valida en routes/index con rolMiddleware)
router.use('/config', authMiddleware, configRoutes);

// Facturación electrónica: lectura para cualquier usuario autenticado,
// creación/actualización solo ADMINISTRADOR (validación de rol en routes/index)
router.use('/facturacion', authMiddleware, facturacionRoutes);

module.exports = router;
