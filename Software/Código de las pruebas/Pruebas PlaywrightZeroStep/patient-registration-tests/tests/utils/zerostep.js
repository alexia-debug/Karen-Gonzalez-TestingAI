/**
 * Implementación simple de zerostep para pruebas
 * @param {import('@playwright/test').Page} page - Página de Playwright
 * @returns {Function} Función para registrar un paso
 */
function zeroStep(page) {
  return function(description) {
    console.log(`Step: ${description}`);
    return Promise.resolve();
  };
}

module.exports = { zeroStep }; 