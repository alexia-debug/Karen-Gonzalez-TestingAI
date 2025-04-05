// tests/utils/test-data.js
const { faker } = require('@faker-js/faker');

/** @typedef {import('../page-objects/PatientRegistrationPage').PersonalInfo} PersonalInfo */
/** @typedef {import('../page-objects/PatientRegistrationPage').MedicalInfo} MedicalInfo */
/** @typedef {import('../page-objects/PatientRegistrationPage').EmergencyContact} EmergencyContact */

/**
 * @typedef {Object} PatientDataOptions
 * @property {boolean} [minimal] - Si es true, genera solo datos obligatorios
 * @property {boolean} [complete] - Si es true, genera todos los datos opcionales
 * @property {boolean} [withEmergency] - Si es true, incluye datos de contacto de emergencia
 * @property {boolean} [withContact] - Si es true, incluye datos de contacto adicionales
 * @property {boolean} [withInsurance] - Si es true, incluye datos de seguro
 * @property {boolean} [withAllergies] - Si es true, incluye datos de alergias
 * @property {boolean} [withMedications] - Si es true, incluye datos de medicamentos
 * @property {boolean} [withDiseases] - Si es true, incluye datos de enfermedades
 * @property {boolean} [withSurgeries] - Si es true, incluye datos de cirugías
 */

/**
 * @param {PatientDataOptions} options
 * @returns {PersonalInfo & MedicalInfo & EmergencyContact}
 */
function generatePatientData(options = {}) {
  /** @type {PersonalInfo & MedicalInfo & EmergencyContact} */
  const data = {
    // Required PersonalInfo fields
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    idNumber: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
    birthDate: faker.date.past({ years: 30 }).toISOString().split('T')[0],
    gender: faker.helpers.arrayElement(['male', 'female', 'other']),
    phone: faker.phone.number(),
    // Optional fields will be added conditionally
  };

  // Optional PersonalInfo fields
  if (!options.minimal) {
    data.email = faker.internet.email();
    data.address = faker.location.streetAddress();
  }

  // Optional MedicalInfo fields
  if (options.complete || options.withAllergies || options.withMedications ||
    options.withDiseases || options.withSurgeries) {
    data.bloodType = faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
    data.weight = faker.number.int({ min: 40, max: 120 }).toString();
    data.height = faker.number.int({ min: 150, max: 200 }).toString();
  }

  if (options.withAllergies) {
    data.allergies = faker.helpers.arrayElement([
      'Penicilina', 'Polen', 'Mariscos', 'Lácteos', 'Ninguna'
    ]);
  }

  if (options.withDiseases) {
    data.chronicConditions = faker.helpers.arrayElement([
      'Diabetes', 'Hipertensión', 'Asma', 'Ninguna'
    ]);
  }

  // Optional EmergencyContact fields
  if (options.withEmergency) {
    data.emergencyName = faker.person.fullName();
    data.emergencyRelation = faker.helpers.arrayElement(['Padre', 'Madre', 'Hermano', 'Hermana', 'Cónyuge']);
    data.emergencyPhone = faker.phone.number();
  }

  // Additional contact information
  if (options.withContact) {
    data.email = faker.internet.email();
    data.address = faker.location.streetAddress();
  }

  // Insurance information
  if (options.withInsurance) {
    // Since there's no insurance field in the form, we'll just add more contact info
    data.email = faker.internet.email();
    data.address = faker.location.streetAddress();
  }

  return data;
}

// Datos para pruebas específicas de validación de errores
const invalidData = {
  invalidEmail: 'invalid-email',
  futureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  shortPhone: '123',
  longPhone: '12345678901234567890'
};

module.exports = { generatePatientData, invalidData };