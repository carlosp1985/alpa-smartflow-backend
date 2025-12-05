// src/middleware/rol.middleware.js
// Middleware para verificar que el usuario tenga un rol permitido

function rolMiddlewareFactory(rolesPermitidos = []) {
  // Devuelve un middleware que valida el rol del usuario
  return function rolMiddleware(req, res, next) {
    // Se asume que req.user fue poblado por el middleware de autenticación
    if (!req.user || !req.user.rol) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No autorizado: usuario sin rol definido'
      });
    }

    const { rol } = req.user;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No autorizado: rol insuficiente'
      });
    }

    return next();
  };
}

module.exports = rolMiddlewareFactory;
