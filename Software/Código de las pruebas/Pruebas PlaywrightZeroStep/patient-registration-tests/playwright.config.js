// playwright.config.js
const { defineConfig } = require('@playwright/test');
const { dirname } = require('path');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  // Número máximo de intentos por prueba
  retries: process.env.CI ? 2 : 0,
  
  // Configuración de reportes
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  // Configuración de los navegadores a utilizar
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  
  // Configuración global
  use: {
    // La URL base donde se encuentra la aplicación
    baseURL: `file://${path.resolve(__dirname, 'registro-pacientes.html')}`,
    trace: 'on-first-retry',
    
    // Configuración de navegación
    actionTimeout: 10000,
    navigationTimeout: 15000,
    
    // Elegimos si queremos ver el navegador al ejecutar las pruebas
    // En desarrollo es útil tenerlo en 'false' para ver lo que ocurre
    headless: false,
    
    // Ignoramos errores HTTPS en desarrollo
    ignoreHTTPSErrors: true,
  },
});