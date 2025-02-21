let currentSection = 0;
const sections = document.querySelectorAll(".section");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const submitBtn = document.getElementById("submit");
const formContainer = document.getElementById("formContainer");
const confirmation = document.getElementById("confirmation");
nextBtn.classList.remove("hidden");

document.addEventListener("DOMContentLoaded", function () {
  const fechaRegistro = document.getElementById("fechaRegistro");

  if (fechaRegistro) {
      const now = new Date();
      
      // Obtener fecha en formato DD/MM/YYYY HH:MM
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const fechaFormateada = `${day}/${month}/${year} ${hours}:${minutes}`;
      fechaRegistro.value = fechaFormateada;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const checkboxMenorEdad = document.getElementById("menorEdad");
  
  // Seleccionamos todos los labels dentro del formulario
  const labels = document.querySelectorAll("#formContainer label");

  // Campos específicos a modificar
  const campos = ["Correo Electrónico", "Teléfono", "Dirección completa", "Distrito", "Departamento", "Provincia"];

  checkboxMenorEdad.addEventListener("change", function () {
      labels.forEach(label => {
          const textoOriginal = label.textContent.trim(); // Obtenemos el texto original del label sin espacios extra

          // Si el label coincide con uno de los campos a modificar
          if (campos.includes(textoOriginal)) {
              if (checkboxMenorEdad.checked) {
                  if (!textoOriginal.includes("Apoderado")) {
                      label.textContent = `${textoOriginal} Apoderado`;
                  }
              } else {
                  label.textContent = textoOriginal.replace(" Apoderado", ""); // Quitamos "Apoderado" si se desmarca
              }
          }
      });
  });
});



function showSection(index) {
    sections.forEach((section, i) => {
      section.classList.toggle("active", i === index);
    });
  
    prevBtn.classList.toggle("hidden", index === 0);
    nextBtn.classList.toggle("hidden", index === sections.length - 1);

    submitBtn.classList.toggle("hidden", index !== sections.length - 1);
  
    // Ocultar el título cuando se pasa a la sección 2 o posteriores
    const titleUno = document.getElementById("title-uno");
    if (index >= 1) {
      titleUno.style.display = "none";
    } else {
      titleUno.style.display = "block";
    }
  }
  

function nextSection() {


  let nombre = document.getElementById("nombre");
      let dni = document.getElementById("dni");

      let errorNombre = document.getElementById("errorNombre");
      let errorDni = document.getElementById("errorDni");
      let errorDniFormato = document.getElementById("errorDniFormato");
      let dniPattern = /^\d{8}$|^[a-zA-Z0-9]{9,20}$/; 

      let nombreContainer = document.getElementById("nombreContainer");
      let dniContainer = document.getElementById("dniContainer");

      let valid = true;

      if (!dni.value.trim().match(dniPattern)) {
      errorDniFormato.style.display = "flex";
      dni.classList.add("error");
      valid = false;
  } else {
      errorDniFormato.style.display = "none";
      dni.classList.remove("error");
  }

      if (nombre.value.trim() === "") {
          errorNombre.style.display = "flex";
          nombre.classList.add("error");
          nombreContainer.classList.add("error-container");
          valid = false;
      } else {
          errorNombre.style.display = "none";
          nombre.classList.remove("error");
          nombreContainer.classList.remove("error-container");
      }

      if (dni.value.trim() === "") {
          errorDni.style.display = "flex";
          dni.classList.add("error");
          dniContainer.classList.add("error-container");
          valid = false;
      } else {
          errorDni.style.display = "none";
          dni.classList.remove("error");
          dniContainer.classList.remove("error-container");
      }

// Si los campos requeridos están correctos, avanza a la siguiente sección
if (valid) {
  currentSection++;
  showSection(currentSection);
}


}

function prevSection() {
  currentSection--;
  showSection(currentSection);
}

function validateSection(index) {
  if (index === 0) {
    const dni = document.getElementById("dni").value;
    const email = document.getElementById("email").value;
    if (!/^([0-9]{8}|[A-Za-z0-9]{20})$/.test(dni)) {
      document.getElementById("dni").focus();
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById("email").focus();
      return false;
    }
  }
  return true;
}




async function submitForm() {
  // Obtener los valores del formulario
  const datosFormulario = {
      fechaRegistro: new Date().toISOString(), // Fecha actual en formato ISO
      nombre: document.getElementById("nombre").value.trim(),
      dni: document.getElementById("dni").value.trim(),
      telefono: document.getElementById("telefono")?.value.trim() || "",
      correo: document.getElementById("email")?.value.trim() || "",
      domicilio: document.getElementById("domicilio")?.value.trim() || "",
      distrito: document.getElementById("distrito")?.value.trim() || "",
      departamento: document.getElementById("departamento")?.value.trim() || "",
      provincia: document.getElementById("provincia")?.value.trim() || "",
      canalCompra: document.querySelector('input[name="canalCompra"]:checked')?.value || "",
      producto: document.getElementById("producto")?.value.trim() || "",
      costoProducto: document.getElementById("costo")?.value.trim() || "",
      tipoReclamo: document.querySelector('input[name="tipoReclamo"]:checked')?.value || "",
      detalle: document.getElementById("detalle")?.value.trim() || "",
      pedido: document.getElementById("PedidoConsumidor")?.value.trim() || "",
      observaciones: document.getElementById("observaciones")?.value.trim() || "",
  };

  // Validar campos obligatorios
  if (!datosFormulario.nombre || !datosFormulario.dni) {
      alert("⚠️ Por favor, completa los campos obligatorios: Nombre y DNI.");
      return;
  }

  console.log("📤 Enviando datos al libro de reclamaciones:", datosFormulario);

  try {
      // Enviar datos al libro de reclamaciones
      const responseLibro = await fetch("https://libroreclamaciones-552ad643df8d.herokuapp.com/api/libroReclamaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosFormulario),
      });

      if (!responseLibro.ok) {
          throw new Error(`❌ Error en la API del libro de reclamaciones: ${responseLibro.status}`);
      }

      const dataLibro = await responseLibro.json();
      console.log("✅ Respuesta del servidor - Libro:", dataLibro);

      // Guardar los datos en localStorage
      localStorage.setItem("datosFormulario", JSON.stringify(datosFormulario));

      // Mostrar mensaje de éxito sin esperar el envío de correo
      console.log("✅ Reclamo registrado con éxito.");

      // Enviar el correo en segundo plano
      sendEmail(datosFormulario);

      // Redirigir a la página final
      window.location.href = "paginafinal.html";

  } catch (error) {
      console.error("❌ Error al enviar datos al libro de reclamaciones:", error);
      alert("❌ Hubo un problema al registrar el reclamo. Inténtalo de nuevo.");
  }
}

// Función para enviar el correo en segundo plano
async function sendEmail(datosFormulario) {
  console.log("📤 Enviando correo en segundo plano...");

  try {
      const responseEmail = await fetch("https://libroreclamaciones-552ad643df8d.herokuapp.com/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosFormulario),
      });

      if (!responseEmail.ok) {
          throw new Error(`❌ Error en la API de correo: ${responseEmail.status}`);
      }

      const dataEmail = await responseEmail.json();
      console.log("✅ Correo enviado con éxito:", dataEmail);

  } catch (error) {
      console.error("❌ Error al enviar el correo:", error);
  }
}
