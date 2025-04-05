declare module 'zerostep' {
  /**
   * Función para registrar pasos en las pruebas
   * @param {import('@playwright/test').Page} page - Página de Playwright
   * @returns {Function} Función para registrar un paso
   */
  export function zeroStep(page: any): (description: string) => void;
} 