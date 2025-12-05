// src/middleware/error.middleware.js
// Middleware de manejo centralizado de errores

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Si el error tiene código de estado, se utiliza; si no, 500 por defecto
  const statusCode = err.statusCode || 500;

  // En un entorno real se puede añadir más información de logging
  res.status(statusCode).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor',
    // En producción normalmente no se envía el stack
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = errorHandler;
