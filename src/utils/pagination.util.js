// src/utils/pagination.util.js
// Helper sencillo para paginación basado en page y limit

/**
 * Calcula offset y limit a partir de page y limit.
 * @param {number|string} page Número de página (1-based).
 * @param {number|string} limit Cantidad de registros por página.
 * @param {Object} opciones Opciones adicionales.
 * @param {number} [opciones.defaultPage=1] Página por defecto.
 * @param {number} [opciones.defaultLimit=10] Límite por defecto.
 * @param {number} [opciones.maxLimit=100] Límite máximo permitido.
 * @returns {{ offset: number, limit: number, page: number }}
 */
function getPagination(page, limit, opciones = {}) {
  const defaultPage = opciones.defaultPage || 1;
  const defaultLimit = opciones.defaultLimit || 10;
  const maxLimit = opciones.maxLimit || 100;

  let pageNumber = parseInt(page, 10);
  let limitNumber = parseInt(limit, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = defaultPage;
  }

  if (Number.isNaN(limitNumber) || limitNumber < 1) {
    limitNumber = defaultLimit;
  }

  if (limitNumber > maxLimit) {
    limitNumber = maxLimit;
  }

  const offset = (pageNumber - 1) * limitNumber;

  return {
    offset,
    limit: limitNumber,
    page: pageNumber
  };
}

module.exports = {
  getPagination
};
