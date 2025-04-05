// tests/page-objects/PatientRegistrationPage.js
const { zeroStep } = require('../utils/zerostep');

/** @typedef {import('@playwright/test').Page} Page */

/**
 * @typedef {Object} PersonalInfo
 * @property {string} firstName - Nombre del paciente
 * @property {string} lastName - Apellido del paciente
 * @property {string} idNumber - Número de identificación
 * @property {string} birthDate - Fecha de nacimiento (YYYY-MM-DD)
 * @property {string} gender - Género del paciente
 * @property {string} phone - Teléfono del paciente
 * @property {string} [email] - Correo electrónico (opcional)
 * @property {string} [address] - Dirección (opcional)
 */

/**
 * @typedef {Object} MedicalInfo
 * @property {string} [bloodType] - Tipo de sangre (opcional)
 * @property {string} [weight] - Peso (opcional)
 * @property {string} [height] - Altura (opcional)
 * @property {string} [allergies] - Alergias (opcional)
 * @property {string} [chronicConditions] - Condiciones crónicas (opcional)
 * @property {string} [familyHistory] - Historial familiar (opcional)
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} [emergencyName] - Nombre del contacto de emergencia (opcional)
 * @property {string} [emergencyRelation] - Relación con el paciente (opcional)
 * @property {string} [emergencyPhone] - Teléfono de emergencia (opcional)
 */

class PatientRegistrationPage {
  /**
   * Constructor de la página de registro de pacientes
   * @param {Page} page - Instancia de la página de Playwright
   */
  constructor(page) {
    this.page = page;
    
    // Selectores para los campos del formulario
    this.selectors = {
      // Botones de acción
      saveButton: '.btn-primary',
      cancelButton: '.btn-outline',
      
      // Campos de información personal
      firstNameInput: '#firstName',
      lastNameInput: '#lastName',
      idNumberInput: '#idNumber',
      birthDateInput: '#birthDate',
      genderSelect: '#gender',
      phoneInput: '#phone',
      emailInput: '#email',
      addressInput: '#address',
      patientIdInput: '#patientId',
      
      // Campos de información médica
      bloodTypeSelect: '#bloodType',
      weightInput: '#weight',
      heightInput: '#height',
      allergiesInput: '#allergies',
      chronicConditionsInput: '#chronicConditions',
      familyHistoryInput: '#familyHistory',
      medicalDocsInput: '#medicalDocs',
      
      // Campos de contacto de emergencia
      emergencyNameInput: '#emergencyName',
      emergencyRelationInput: '#emergencyRelation',
      emergencyPhoneInput: '#emergencyPhone',
      
      // Secciones del formulario
      personalInfoSection: '.form-section:nth-child(1)',
      medicalInfoSection: '.form-section:nth-child(2)',
      emergencyContactSection: '.form-section:nth-child(3)',
      
      // Indicadores de error
      errorBorder: '.is-invalid',
      invalidFeedback: '.invalid-feedback',
      
      // Elementos de retroalimentación
      fileNameSpan: '.file-name',
      successMessage: '.alert-success',
      errorMessage: '.alert-danger'
    };
  }

  /**
   * Función auxiliar para registrar pasos
   * @param {string} description - Descripción del paso
   */
  step(description) {
    return zeroStep(this.page)(description);
  }

  /**
   * Navega a la página de registro de pacientes
   */
  async goto() {
    await this.step('Navegar a la página de registro de pacientes');
    await this.page.goto('');
    await this.step('Verificar que la página de registro de pacientes ha cargado correctamente');
    await this.page.waitForSelector(this.selectors.firstNameInput);
  }

  /**
   * Llena el formulario con la información personal del paciente
   * @param {PersonalInfo} patientData - Datos del paciente
   */
  async fillPersonalInfo(patientData) {
    await this.step('Completar la sección de información personal');
    
    // Campos obligatorios
    await this.page.fill(this.selectors.firstNameInput, patientData.firstName || '');
    await this.page.fill(this.selectors.lastNameInput, patientData.lastName || '');
    await this.page.fill(this.selectors.idNumberInput, patientData.idNumber || '');
    await this.page.fill(this.selectors.birthDateInput, patientData.birthDate || '');
    await this.page.selectOption(this.selectors.genderSelect, patientData.gender || '');
    await this.page.fill(this.selectors.phoneInput, patientData.phone || '');

    // Campos opcionales
    if (patientData.email) await this.page.fill(this.selectors.emailInput, patientData.email);
    if (patientData.address) await this.page.fill(this.selectors.addressInput, patientData.address);
  }

  /**
   * Llena el formulario con la información médica del paciente
   * @param {MedicalInfo} patientData - Datos médicos del paciente
   */
  async fillMedicalInfo(patientData) {
    await this.step('Completar la sección de información médica');
    
    if (patientData.bloodType) {
      await this.page.selectOption(this.selectors.bloodTypeSelect, patientData.bloodType);
    }
    
    if (patientData.weight) {
      const weight = parseFloat(patientData.weight);
      if (!isNaN(weight)) {
        await this.page.fill(this.selectors.weightInput, weight.toString());
      }
    }
    
    if (patientData.height) {
      const height = parseFloat(patientData.height);
      if (!isNaN(height)) {
        await this.page.fill(this.selectors.heightInput, height.toString());
      }
    }
    
    if (patientData.allergies) {
      await this.page.fill(this.selectors.allergiesInput, patientData.allergies);
    }
    
    if (patientData.chronicConditions) {
      await this.page.fill(this.selectors.chronicConditionsInput, patientData.chronicConditions);
    }
    
    if (patientData.familyHistory) {
      await this.page.fill(this.selectors.familyHistoryInput, patientData.familyHistory);
    }
  }

  /**
   * Llena la información de contacto de emergencia
   * @param {EmergencyContact} patientData - Datos de contacto de emergencia
   */
  async fillEmergencyContact(patientData) {
    await this.step('Completar la sección de contacto de emergencia');
    
    if (patientData.emergencyName) {
      await this.page.fill(this.selectors.emergencyNameInput, patientData.emergencyName);
    }
    
    if (patientData.emergencyRelation) {
      await this.page.fill(this.selectors.emergencyRelationInput, patientData.emergencyRelation);
    }
    
    if (patientData.emergencyPhone) {
      await this.page.fill(this.selectors.emergencyPhoneInput, patientData.emergencyPhone);
    }
  }

  /**
   * Sube un documento médico (simulación)
   * @param {string} filePath - Ruta al archivo a subir
   */
  async uploadMedicalDocument(filePath) {
    await this.step('Subir documento médico');
    await this.page.setInputFiles(this.selectors.medicalDocsInput, filePath);
    
    // Verificar que el nombre del archivo aparece en la interfaz
    const fileName = filePath.split('/').pop(); // Extraer solo el nombre del archivo
    await this.step(`Verificar que aparece el nombre del archivo "${fileName}"`);
    await this.page.waitForSelector(`${this.selectors.fileNameSpan}:text("${fileName}")`);
  }

  /**
   * Guarda el formulario haciendo clic en el botón guardar
   */
  async saveForm() {
    await this.step('Hacer clic en el botón Guardar');
    await this.page.click(this.selectors.saveButton);
  }

  /**
   * Cancela el formulario haciendo clic en el botón cancelar
   */
  async cancelForm() {
    await this.step('Hacer clic en el botón Cancelar');
    await this.page.click(this.selectors.cancelButton);
  }

  /**
   * Verifica si hay campos con errores de validación
   * @returns {Promise<boolean>} true si hay errores, false si no
   */
  async hasValidationErrors() {
    await this.step('Verificar si hay errores de validación');
    
    // Verificar campos obligatorios vacíos
    const requiredFields = [
      this.selectors.firstNameInput,
      this.selectors.lastNameInput,
      this.selectors.idNumberInput,
      this.selectors.birthDateInput,
      this.selectors.genderSelect,
      this.selectors.phoneInput
    ];

    for (const selector of requiredFields) {
      const value = await this.page.inputValue(selector);
      if (!value) {
        return true;
      }
    }

    // Verificar si hay campos con la clase de error
    const errorElements = await this.page.$$(this.selectors.errorBorder);
    return errorElements.length > 0;
  }

  /**
   * Verifica si se generó un ID de paciente
   * @returns {Promise<boolean>} true si el ID se generó, false si no
   */
  async hasPatientIdGenerated() {
    await this.step('Verificar si se generó un ID de paciente');
    const patientIdValue = await this.page.inputValue(this.selectors.patientIdInput);
    return patientIdValue.startsWith('PAC-');
  }

  /**
   * Llena el formulario completo del paciente
   * @param {PersonalInfo & MedicalInfo & EmergencyContact} patientData - Datos completos del paciente
   */
  async fillCompleteForm(patientData) {
    await this.fillPersonalInfo(patientData);
    await this.fillMedicalInfo(patientData);
    await this.fillEmergencyContact(patientData);
  }

  /**
   * Valida los campos obligatorios uno por uno
   */
  async validateRequiredFields() {
    await this.step('Verificar campos obligatorios');
    const requiredFields = [
      { selector: this.selectors.firstNameInput, name: 'Nombre', type: 'input' },
      { selector: this.selectors.lastNameInput, name: 'Apellido', type: 'input' },
      { selector: this.selectors.idNumberInput, name: 'Número de identificación', type: 'input' },
      { selector: this.selectors.birthDateInput, name: 'Fecha de nacimiento', type: 'input' },
      { selector: this.selectors.genderSelect, name: 'Género', type: 'select' },
      { selector: this.selectors.phoneInput, name: 'Teléfono', type: 'input' }
    ];

    for (const field of requiredFields) {
      if (field.type === 'select') {
        await this.page.selectOption(field.selector, '');
      } else {
        await this.page.fill(field.selector, '');
      }
      
      await this.page.click(this.selectors.saveButton);
      
      const value = await this.page.inputValue(field.selector);
      const hasError = !value; // Si el campo está vacío, hay error
      
      if (!hasError) {
        throw new Error(`El campo ${field.name} no muestra error de validación`);
      }
    }
  }
}

module.exports = { PatientRegistrationPage };