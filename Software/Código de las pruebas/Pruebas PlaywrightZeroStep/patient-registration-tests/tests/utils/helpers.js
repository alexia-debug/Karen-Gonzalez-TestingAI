// tests/utils/helpers.js

/**
 * Pausa la ejecución por un tiempo específico
 * @param {number} ms - Milisegundos a esperar
 */
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verifica si un valor está vacío
 * @param {any} value - Valor a verificar
 * @returns {boolean}
 */
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida si un número de teléfono es válido
 * @param {string} phone - Teléfono a validar
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Verifica si una fecha es futura
 * @param {string} date - Fecha a verificar (formato YYYY-MM-DD)
 * @returns {boolean}
 */
function isFutureDate(date) {
  const inputDate = new Date(date);
  const today = new Date();
  return inputDate > today;
}

/**
 * Genera un nombre de archivo temporal para pruebas
 * @param {string} extension - Extensión del archivo (sin el punto)
 * @returns {string} Nombre de archivo único
 */
function generateTempFileName(extension = 'pdf') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `test-file-${timestamp}-${random}.${extension}`;
}

module.exports = { pause, isEmpty, isValidEmail, isValidPhone, isFutureDate, generateTempFileName };