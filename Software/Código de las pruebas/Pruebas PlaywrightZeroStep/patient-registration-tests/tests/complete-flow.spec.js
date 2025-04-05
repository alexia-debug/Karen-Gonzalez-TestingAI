// tests/complete-flow.spec.js
const { test, expect } = require('@playwright/test');
const { PatientRegistrationPage } = require('./page-objects/PatientRegistrationPage');
const { SidebarComponent } = require('./page-objects/SidebarComponent');
const { zeroStep } = require('./utils/zerostep');
const { generatePatientData } = require('./utils/test-data');
const { pause } = require('./utils/helpers');

test.describe('Flujo Completo de Registro de Pacientes', () => {
  test('Registro de paciente con validación completa del flujo', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const sidebar = new SidebarComponent(page);
    const patientData = generatePatientData();
    
    // Paso 1: Navegación inicial y verificación de la página
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Verificar que la página ha cargado correctamente');
    await expect(page).toHaveTitle(/Registro de Pacientes/);
    
    // Paso 2: Verificar componentes de navegación
    await step('Verificar que la barra lateral está visible');
    expect(await sidebar.isVisible()).toBeTruthy();
    
    await step('Verificar que el elemento activo en el menú es "Pacientes"');
    expect(await sidebar.getActiveMenuItem()).toContain('Pacientes');
    
    // Paso 3: Validar el formulario vacío
    await step('Verificar que el formulario está inicialmente vacío');
    const initialFirstName = await page.inputValue(patientPage.selectors.firstNameInput);
    expect(initialFirstName).toBe('');
    
    await step('Verificar que el campo de ID de paciente está deshabilitado');
    const isPatientIdDisabled = await page.isDisabled(patientPage.selectors.patientIdInput);
    expect(isPatientIdDisabled).toBeTruthy();
    
    // Paso 4: Intentar guardar sin datos y verificar validación
    await step('Intentar guardar el formulario sin completar campos obligatorios');
    
    // Configurar el listener de diálogo antes de la acción que lo dispara
    page.once('dialog', async dialog => {
      await step('Verificar que aparece mensaje de error sobre campos obligatorios');
      expect(dialog.message()).toContain('obligatorios');
      await dialog.accept();
    });
    
    await patientPage.saveForm();
    
    // Verificar que hay errores de validación
    await step('Verificar que los campos obligatorios tienen marcas de error');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBeTruthy();
    
    // Resto del código...
  });

  test('TC-001: Registro completo de un nuevo paciente', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData();
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos válidos');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-002: Registro de paciente con datos mínimos', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ minimal: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos mínimos');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-003: Registro de paciente con datos completos', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ complete: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con todos los datos opcionales');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-004: Registro de paciente con datos de emergencia', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withEmergency: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de emergencia');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-005: Registro de paciente con datos de contacto', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withContact: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de contacto');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-006: Registro de paciente con datos de seguro', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withInsurance: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de seguro');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-007: Registro de paciente con datos de alergias', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withAllergies: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de alergias');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-008: Registro de paciente con datos de medicamentos', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withMedications: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de medicamentos');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-009: Registro de paciente con datos de enfermedades', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withDiseases: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de enfermedades');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });

  test('TC-010: Registro de paciente con datos de cirugías', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    const patientData = generatePatientData({ withSurgeries: true });
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Llenar el formulario con datos de cirugías');
    await patientPage.fillCompleteForm(patientData);
    
    await step('Verificar que no hay errores de validación');
    const hasErrors = await patientPage.hasValidationErrors();
    expect(hasErrors).toBe(false);
    
    await step('Guardar el formulario');
    await patientPage.saveForm();
    
    await step('Verificar que se muestra el mensaje de éxito');
    const successMessage = await page.textContent('.alert-success');
    expect(successMessage).toContain('Paciente registrado exitosamente');

    await pause(1000);
  });
});