using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using WebDriverManager.DriverConfigs.Impl;
using WebDriverManager;


namespace MediCare.Tests.UI
{
    [TestFixture]
    public class RegistroPacientesTests
    {
        private IWebDriver driver;
        private WebDriverWait wait;
        private string baseUrl;

        [SetUp]
        public void Setup()
        {
            new DriverManager().SetUpDriver(new ChromeConfig());
            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--start-maximized");
            driver = new ChromeDriver(options);
            wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            baseUrl = "file:///" + Path.GetFullPath("../../../Interfaces/registro-pacientes.html");
            driver.Navigate().GoToUrl(baseUrl);
        }

        [TearDown]
        public void TearDown()
        {
            if (driver != null)
            {
                Thread.Sleep(1500);
                driver.Quit();
                driver.Dispose();
            }
        }

        public void VerificarTituloPagina()
        {
            string expectedTitle = "Registro de Pacientes - Sistema de Gestión de Pacientes";
            string actualTitle = driver.Title;
            Assert.That(actualTitle, Is.EqualTo(expectedTitle));
        }

        [Test]
        public void VerificarValidacionCamposObligatorios()
        {
            driver.FindElement(By.CssSelector(".btn-primary")).Click();
            IAlert alert = wait.Until(ExpectedConditions.AlertIsPresent());
            Assert.That(alert.Text, Is.EqualTo("Por favor complete todos los campos obligatorios"));
            alert.Accept();
        }

        [Test]
        public void RegistrarPacienteExitoso()
        {
            driver.FindElement(By.Id("firstName")).SendKeys("Juan");
            driver.FindElement(By.Id("lastName")).SendKeys("Pérez");
            driver.FindElement(By.Id("idNumber")).SendKeys("12345678A");
            driver.FindElement(By.Id("birthDate")).SendKeys("01/01/1980");
            new SelectElement(driver.FindElement(By.Id("gender"))).SelectByValue("male");
            driver.FindElement(By.Id("phone")).SendKeys("555123456");
            driver.FindElement(By.CssSelector(".btn-primary")).Click();
            IAlert alert = wait.Until(ExpectedConditions.AlertIsPresent());
            Assert.That(alert.Text, Is.EqualTo("Datos del paciente guardados correctamente (Demo)"));
            alert.Accept();
            string patientId = driver.FindElement(By.Id("patientId")).GetAttribute("value");
            Assert.That(patientId, Does.StartWith("PAC-"));
        }

        [Test]
        public void VerificarCargaDocumentosMedicos()
        {
            // Crear la ruta del archivo
            string filePath = Path.GetFullPath("../../../TestFiles/sample.pdf");
            ((IJavaScriptExecutor)driver).ExecuteScript("window.scrollTo(0, 760);");

            // Añadir una pausa para que el desplazamiento sea visible
            Thread.Sleep(1000);

            IWebElement fileInput = driver.FindElement(By.Id("medicalDocs"));
            Thread.Sleep(1000);

            // Enviar la ruta del archivo
            fileInput.SendKeys(filePath);

            // Verificar que el nombre del archivo aparece
            IWebElement fileNameElement = driver.FindElement(By.CssSelector(".file-name"));
            wait.Until(d => fileNameElement.Text.Contains("sample.pdf"));
            Assert.That(fileNameElement.Text, Does.Contain("sample.pdf"));
        }

        [Test]
        public void VerificarNavegacionMenuLateral()
        {
            IList<IWebElement> menuItems = driver.FindElements(By.CssSelector(".menu-item"));
            Assert.That(menuItems.Count, Is.EqualTo(5));
            string[] expectedTexts = { "Dashboard", "Pacientes", "Citas", "Medicamentos", "Informes" };
            for (int i = 0; i < menuItems.Count; i++)
            {
                string text = menuItems[i].FindElement(By.TagName("span")).Text;
                Assert.That(text, Is.EqualTo(expectedTexts[i]));
            }
        }

        [TestCase("12345", "El ID de identificación debe tener un formato válido")]
        [TestCase("AB123456", "El ID de identificación debe tener un formato válido")]
        [Description("Verificar validación de formato de número de identificación")]
        public void ValidarFormatoNumeroIdentificacion(string idNumber, string expectedError)
        {
            // Completar los campos obligatorios excepto el de identificación
            driver.FindElement(By.Id("firstName")).SendKeys("Juan");
            driver.FindElement(By.Id("lastName")).SendKeys("Pérez");
            driver.FindElement(By.Id("birthDate")).SendKeys("01/01/1980");

            // Seleccionar género
            var selectGender = new SelectElement(driver.FindElement(By.Id("gender")));
            selectGender.SelectByValue("male");

            driver.FindElement(By.Id("phone")).SendKeys("555123456");

            // Ingresar el número de identificación con formato inválido
            driver.FindElement(By.Id("idNumber")).SendKeys(idNumber);

            // Intentar guardar el formulario
            driver.FindElement(By.CssSelector(".btn-primary")).Click();

            // Verificar que aparece el mensaje de error
            IAlert alert = wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.AlertIsPresent());
            string alertMessage = alert.Text;
            alert.Accept();

            Assert.That(alertMessage, Does.Contain(expectedError),
                $"El mensaje de error para identificación inválida no contiene: {expectedError}");
        }

        [Test]
        [Description("Verificar que el botón Cancelar limpia el formulario")]
        public void VerificarBotonCancelar()
        {
            // Completar algunos campos
            driver.FindElement(By.Id("firstName")).SendKeys("Juan");
            driver.FindElement(By.Id("lastName")).SendKeys("Pérez");

            // Hacer clic en el botón Cancelar
            driver.FindElement(By.CssSelector(".btn-outline")).Click();

            // Verificar que los campos están vacíos
            string firstNameValue = driver.FindElement(By.Id("firstName")).GetAttribute("value");
            string lastNameValue = driver.FindElement(By.Id("lastName")).GetAttribute("value");

            Assert.That(string.IsNullOrEmpty(firstNameValue), Is.True, "El campo de nombre no se limpió correctamente");
            Assert.That(string.IsNullOrEmpty(lastNameValue), Is.True, "El campo de apellido no se limpió correctamente");
        }

        [Test]
        [Description("Verificar que la sección de información médica acepta datos correctamente")]
        public void VerificarInformacionMedica()
        {
            // Completar campos de información médica
            var selectBloodType = new SelectElement(driver.FindElement(By.Id("bloodType")));
            selectBloodType.SelectByValue("O+");

            driver.FindElement(By.Id("weight")).SendKeys("75");
            driver.FindElement(By.Id("height")).SendKeys("175");
            driver.FindElement(By.Id("allergies")).SendKeys("Penicilina, Polen");
            driver.FindElement(By.Id("chronicConditions")).SendKeys("Hipertensión");

            // Completar campos obligatorios para poder guardar
            driver.FindElement(By.Id("firstName")).SendKeys("Juan");
            driver.FindElement(By.Id("lastName")).SendKeys("Pérez");
            driver.FindElement(By.Id("idNumber")).SendKeys("12345678A");
            driver.FindElement(By.Id("birthDate")).SendKeys("01/01/1980");

            var selectGender = new SelectElement(driver.FindElement(By.Id("gender")));
            selectGender.SelectByValue("male");

            driver.FindElement(By.Id("phone")).SendKeys("555123456");

            // Guardar el formulario
            driver.FindElement(By.CssSelector(".btn-primary")).Click();

            // Aceptar alerta de éxito
            IAlert alert = wait.Until(SeleniumExtras.WaitHelpers.ExpectedConditions.AlertIsPresent());
            alert.Accept();

            // Verificar que los datos médicos se mantienen
            string bloodType = new SelectElement(driver.FindElement(By.Id("bloodType"))).SelectedOption.GetAttribute("value");
            string weight = driver.FindElement(By.Id("weight")).GetAttribute("value");
            string height = driver.FindElement(By.Id("height")).GetAttribute("value");
            string allergies = driver.FindElement(By.Id("allergies")).GetAttribute("value");

            Assert.That(bloodType, Is.EqualTo("O+"), "El tipo de sangre no se guardó correctamente");
            Assert.That(weight, Is.EqualTo("75"), "El peso no se guardó correctamente");
            Assert.That(height, Is.EqualTo("175"), "La altura no se guardó correctamente");
            Assert.That(allergies, Is.EqualTo("Penicilina, Polen"), "Las alergias no se guardaron correctamente");
        }

        [Test]
        [Description("Verificar la funcionalidad de búsqueda de pacientes")]
        public void VerificarBusquedaPacientes()
        {
            // Obtener campo de búsqueda
            IWebElement searchField = driver.FindElement(By.CssSelector(".search-bar"));

            // Ingresar término de búsqueda
            searchField.SendKeys("Juan Pérez");
            searchField.SendKeys(Keys.Enter);

            // Verificar que se realiza la búsqueda (en este caso, como es una demo, verificamos que el campo mantiene el valor)
            string searchValue = searchField.GetAttribute("value");
            Assert.That(searchValue, Is.EqualTo("Juan Pérez"), "El campo de búsqueda no mantiene el valor ingresado");
        }

        [Test]
        [Description("Verificar que el formulario se adapta correctamente a diferentes tamaños de pantalla")]
        public void VerificarResponsividad()
        {
            // Tamaño original (desktop)
            int originalWidth = driver.Manage().Window.Size.Width;

            // Cambiar a tamaño de tablet
            driver.Manage().Window.Size = new System.Drawing.Size(800, 600);
            Thread.Sleep(1000); // Esperar a que se apliquen los cambios

            // Verificar estado de elementos en modo tablet
            IWebElement sidebar = driver.FindElement(By.CssSelector(".sidebar"));
            string sidebarWidth = sidebar.GetCssValue("width");

            Assert.That(sidebarWidth, Does.Contain("70px"),
                "El sidebar no se adaptó correctamente al tamaño de tablet");

            // Cambiar a tamaño de móvil
            driver.Manage().Window.Size = new System.Drawing.Size(500, 800);
            Thread.Sleep(1000); // Esperar a que se apliquen los cambios

            // Verificar que el campo de búsqueda está oculto en móvil
            IWebElement searchContainer = driver.FindElement(By.CssSelector(".search-container"));
            string searchDisplay = searchContainer.GetCssValue("display");

            Assert.That(searchDisplay, Does.Contain("none"),
                "El campo de búsqueda no se ocultó correctamente en modo móvil");

            // Restaurar tamaño original
            driver.Manage().Window.Size = new System.Drawing.Size(originalWidth, 600);
        }
    }
}