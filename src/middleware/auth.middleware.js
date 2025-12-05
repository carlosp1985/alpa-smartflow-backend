// src/middleware/auth.middleware.js
// Middleware para verificar JWT en el header Authorization

const config = require('../config/env');
const { verificarToken } = require('../utils/jwt.util');

function authMiddleware(req, res, next) {
  // Se espera un header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token de autenticación no proporcionado'
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Cabecera de autorización inválida'
    });
  }

  try {
    // Verifica el token usando el secreto configurado
    const payload = verificarToken(token, config.jwtSecret);

    // Se adjunta la información del usuario al objeto de la petición
    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado'
    });
  }
}

module.exports = authMiddleware;
