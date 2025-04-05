// tests/patient-registration-advanced.spec.js
const { test, expect } = require('@playwright/test');
const { PatientRegistrationPage } = require('./page-objects/PatientRegistrationPage');
const { SidebarComponent } = require('./page-objects/SidebarComponent');
const { zeroStep } = require('./utils/zerostep');
const { generatePatientData, invalidData } = require('./utils/test-data');
const { pause, isEmpty, isValidEmail, isValidPhone, isFutureDate } = require('./utils/helpers');

test.describe('Pruebas Avanzadas de Registro de Pacientes', () => {
  // Antes de cada prueba, navegamos a la página de registro
  test.beforeEach(async ({ page }) => {
    const patientPage = new PatientRegistrationPage(page);
    await patientPage.goto();
  });

  test('TC-001: Validación de campos obligatorios uno por uno', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    
    await step('Verificar campos obligatorios');
    await patientPage.validateRequiredFields();

    await pause(1000);
  });

  test('TC-002: Validar comportamiento al ingresar valores extremos', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    
    // Probar con valores extremadamente largos
    await step('Probar con un nombre extremadamente largo');
    const longName = 'A'.repeat(1000); // Un nombre de 1000 caracteres
    await page.fill(patientPage.selectors.firstNameInput, longName);
    
    // Verificar que el campo acepta el valor (no hay validación de longitud máxima)
    const nameValue = await page.inputValue(patientPage.selectors.firstNameInput);
    await step('Verificar que el campo acepta un valor extremadamente largo');
    expect(nameValue.length).toBeGreaterThan(100); // Debería aceptar al menos 100 caracteres
    
    // Probar con valores extremos para campos numéricos
    await step('Probar con un valor extremo para el peso');
    await page.fill(patientPage.selectors.weightInput, '9999');
    
    // Probar con altura extrema
    await step('Probar con un valor extremo para la altura');
    await page.fill(patientPage.selectors.heightInput, '999');
    
    // Verificar que los campos aceptan estos valores (no hay validación de rango)
    const weightValue = await page.inputValue(patientPage.selectors.weightInput);
    const heightValue = await page.inputValue(patientPage.selectors.heightInput);
    
    await step('Verificar que los campos numéricos aceptan valores extremos');
    expect(parseInt(weightValue)).toBe(9999);
    expect(parseInt(heightValue)).toBe(999);
    
    // Señalar que en una aplicación real, debería haber validaciones de rango
    await step('Señalar que debería haber validaciones de rango para campos numéricos');
    console.log('Advertencia: No hay validación de rango para campos numéricos como peso y altura');

    await pause(1000);
  });

  test('TC-003: Verificar comportamiento con caracteres especiales', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    // Probar con caracteres especiales en campos de texto
    await step('Probar con caracteres especiales en campos de texto');
    const specialChars = '!@#$%^&*()_+';
    await page.fill(patientPage.selectors.firstNameInput, `Test${specialChars}`);
    await page.fill(patientPage.selectors.lastNameInput, `User${specialChars}`);
    
    // Verificar que los campos de texto aceptan caracteres especiales
    await step('Verificar que los campos de texto aceptan caracteres especiales');
    const firstName = await page.inputValue(patientPage.selectors.firstNameInput);
    const lastName = await page.inputValue(patientPage.selectors.lastNameInput);
    expect(firstName).toContain(specialChars);
    expect(lastName).toContain(specialChars);
    
    // Probar con caracteres no numéricos en campos numéricos
    await step('Verificar que los campos numéricos solo aceptan números');
    
    // Primero establecemos valores numéricos válidos
    await page.fill(patientPage.selectors.weightInput, '123');
    await page.fill(patientPage.selectors.heightInput, '456');
    
    const weight = await page.inputValue(patientPage.selectors.weightInput);
    const height = await page.inputValue(patientPage.selectors.heightInput);
    
    expect(weight).toBe('123');
    expect(height).toBe('456');
    
    // Intentar ingresar caracteres no numéricos usando keyboard.type
    await step('Intentar ingresar caracteres no numéricos usando keyboard.type');
    await page.focus(patientPage.selectors.weightInput);
    await page.keyboard.type('abc');
    await page.focus(patientPage.selectors.heightInput);
    await page.keyboard.type('!@#');
    
    const weightAfter = await page.inputValue(patientPage.selectors.weightInput);
    const heightAfter = await page.inputValue(patientPage.selectors.heightInput);
    
    // Los valores deberían seguir siendo los números originales
    expect(weightAfter).toBe('123');
    expect(heightAfter).toBe('456');

    await pause(1000);
  });

  test('TC-004: Verificar la navegación entre campos usando Tab', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    
    await step('Navegar a la página de registro de pacientes');
    await patientPage.goto();
    
    await step('Verificar que todos los campos son accesibles mediante tabulación');
    
    // Obtener todos los elementos tabulables y sus IDs
    const focusableElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea, button:not([disabled])'));
      return elements.map(el => {
        const htmlEl = /** @type {HTMLElement} */ (el);
        return {
          id: htmlEl.id,
          tagName: htmlEl.tagName.toLowerCase(),
          type: htmlEl.getAttribute('type'),
          name: htmlEl.getAttribute('name'),
          className: htmlEl.className,
          label: htmlEl.previousElementSibling?.textContent?.trim(),
          tabIndex: htmlEl.tabIndex,
          disabled: htmlEl.hasAttribute('disabled'),
          hidden: htmlEl.hidden || htmlEl.style.display === 'none' || htmlEl.style.visibility === 'hidden',
          computedStyle: {
            display: window.getComputedStyle(htmlEl).display,
            visibility: window.getComputedStyle(htmlEl).visibility,
            opacity: window.getComputedStyle(htmlEl).opacity
          }
        };
      });
    });
    
    console.log('Elementos tabulables encontrados:', focusableElements);
    
    // Verificar que podemos tabular a través de todos los campos
    const visitedFields = new Set();
    
    // Filtrar los campos del formulario
    const formFields = focusableElements.filter(el => 
      el.id && // Solo campos con ID
      el.className.includes('form-control') && // Solo campos del formulario
      !el.id.includes('emergency') && // Excluir campos de emergencia
      el.id !== 'patientId' // Excluir el campo patientId
    );
    
    // Verificar que no hay campos ocultos o deshabilitados que deberían ser accesibles
    const inaccessibleFields = formFields.filter(field => 
      field.disabled || 
      field.hidden || 
      field.computedStyle.display === 'none' || 
      field.computedStyle.visibility === 'hidden' ||
      field.computedStyle.opacity === '0'
    );
    
    if (inaccessibleFields.length > 0) {
      console.log('Campos que están ocultos o deshabilitados:', inaccessibleFields);
    }
    
    // Verificar que los tabindex están configurados correctamente
    const fieldsWithTabIndex = formFields.filter(field => field.tabIndex !== 0);
    if (fieldsWithTabIndex.length > 0) {
      console.log('Campos con tabIndex personalizado:', fieldsWithTabIndex);
    }
    
    // Empezar desde el primer botón o campo antes del formulario
    await page.keyboard.press('Tab'); // Ir al primer elemento tabulable
    await page.keyboard.press('Tab'); // Ir al segundo elemento tabulable
    await page.keyboard.press('Tab'); // Ir al tercer elemento tabulable
    await page.keyboard.press('Tab'); // Ir al primer campo del formulario
    
    let lastFocusedField = null;
    let stuckCount = 0;
    
    // Intentar tabular hasta que hayamos visitado todos los campos o hecho 50 intentos
    for (let i = 0; i < 50 && visitedFields.size < formFields.length; i++) {
      const newField = await page.evaluate(() => {
        const active = /** @type {HTMLElement} */ (document.activeElement);
        return {
          id: active?.id,
          tagName: active?.tagName,
          type: active?.getAttribute('type'),
          label: active?.previousElementSibling?.textContent?.trim(),
          tabIndex: active?.tabIndex,
          className: active?.className
        };
      });
      
      if (newField.id === lastFocusedField?.id) {
        stuckCount++;
        if (stuckCount > 3) {
          console.log('El foco se quedó atascado en:', newField);
          break;
        }
      } else {
        stuckCount = 0;
      }
      
      if (newField.id && !visitedFields.has(newField.id)) {
        visitedFields.add(newField.id);
        console.log(`Campo visitado: ${newField.id} (${newField.label}) - tabIndex: ${newField.tabIndex}`);
        
        // Si estamos en el campo de fecha, tabular 3 veces más para pasar por día, mes y año
        if (newField.id === 'birthDate') {
          console.log('Campo de fecha detectado, tabulando 3 veces adicionales...');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');
        }
      }
      
      lastFocusedField = newField;
    await page.keyboard.press('Tab');
      
      // Pequeña pausa para asegurar que el foco se ha movido
      await page.waitForTimeout(100);
    }
    
    // Verificar que hemos visitado todos los campos esperados
    const expectedFields = formFields.map(f => f.id);
    const missingFields = expectedFields.filter(id => !visitedFields.has(id));
    
    if (missingFields.length > 0) {
      console.log('Campos no accesibles mediante tabulación:', missingFields);
      console.log('Campos visitados:', Array.from(visitedFields));
      
      // Obtener más información sobre los campos no accesibles
      const missingFieldsInfo = formFields.filter(f => missingFields.includes(f.id));
      console.log('Información detallada de campos no accesibles:', missingFieldsInfo);
      
      // Intentar enfocar directamente los campos no accesibles
      for (const fieldId of missingFields) {
        console.log(`Intentando enfocar directamente el campo ${fieldId}...`);
        await page.focus(`#${fieldId}`);
        const isFocused = await page.evaluate((id) => document.activeElement?.id === id, fieldId);
        console.log(`¿Se pudo enfocar ${fieldId}?`, isFocused);
      }
    }
    
    expect(missingFields.length, 'Algunos campos no son accesibles mediante tabulación').toBe(0);
    expect(inaccessibleFields.length, 'Algunos campos están ocultos o deshabilitados').toBe(0);
    expect(fieldsWithTabIndex.length, 'Algunos campos tienen tabIndex personalizado').toBe(0);

    await pause(1000);
  });

  test('TC-005: Verificar accesibilidad básica', async ({ page }) => {
    const step = zeroStep(page);
    
    // Verificar que los campos obligatorios están marcados adecuadamente
    await step('Verificar que los campos obligatorios están marcados adecuadamente');
    const requiredLabels = await page.$$('.required');
    expect(requiredLabels.length).toBeGreaterThan(0);
    
    // Verificar que los campos tienen etiquetas asociadas
    await step('Verificar que todos los campos tienen etiquetas asociadas');
    const inputsWithoutLabels = await page.$$('input:not([type="hidden"]):not([type="file"]):not([aria-label]):not([title])');
    
    for (const input of inputsWithoutLabels) {
      const id = await input.getAttribute('id');
      if (id) {
        const hasLabel = await page.$(`label[for="${id}"]`);
        expect(hasLabel).not.toBeNull();
      }
    }
    
    // Verificar que los selectores tienen textos descriptivos
    await step('Verificar que los selectores tienen opciones con textos descriptivos');
    const options = await page.$$('select option');
    for (const option of options) {
      const text = await option.textContent();
      if (text) {
        expect(text.trim()).not.toBe('');
      }
    }

    await pause(1000);
  });

  test('TC-006: Verificar visualización responsiva', async ({ page }) => {
    const step = zeroStep(page);
    const patientPage = new PatientRegistrationPage(page);
    
    // Verificar visualización en escritorio (1920x1080)
    await step('Verificar visualización en tamaño escritorio (1920x1080)');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await patientPage.goto();
    
    const desktopSidebarWidth = await page.evaluate(() => {
      const sidebar = /** @type {HTMLElement} */ (document.querySelector('.sidebar'));
      return sidebar ? sidebar.offsetWidth : 0;
    });
    
    // En escritorio, el sidebar debería tener un ancho de 220px
    expect(desktopSidebarWidth).toBe(220);
    
    // Verificar visualización en tablet (768x1024)
    await step('Verificar visualización en tamaño tablet (768x1024)');
    await page.setViewportSize({ width: 768, height: 1024 });
    await patientPage.goto();
    
    const tabletSidebarWidth = await page.evaluate(() => {
      const sidebar = /** @type {HTMLElement} */ (document.querySelector('.sidebar'));
      return sidebar ? sidebar.offsetWidth : 0;
    });
    
    // En tablet, el sidebar debería tener un ancho de 220px o menos
    expect(tabletSidebarWidth).toBeLessThanOrEqual(220);
    
    // Verificar visualización en móvil (375x667)
    await step('Verificar visualización en tamaño móvil (375x667)');
    await page.setViewportSize({ width: 375, height: 667 });
    await patientPage.goto();
    
    const mobileSidebarWidth = await page.evaluate(() => {
      const sidebar = /** @type {HTMLElement} */ (document.querySelector('.sidebar'));
      return sidebar ? sidebar.offsetWidth : 0;
    });
    
    // En móvil, el sidebar debería tener un ancho de 70px o menos
    expect(mobileSidebarWidth).toBeLessThanOrEqual(70);

    await pause(1000);
  });
});