
document.addEventListener("DOMContentLoaded", async function () {
    const url = "https://libroreclamaciones-552ad643df8d.herokuapp.com/api/libroReclamaciones/ID";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const ultimoID = data.ultimoID; // Extraer el último ID de la API

        // Guardar el ID en localStorage correctamente
        let datosFormulario = JSON.parse(localStorage.getItem("datosFormulario")) || {};
        datosFormulario.id = ultimoID; 
        localStorage.setItem("datosFormulario", JSON.stringify(datosFormulario));

        // Pintar el ID en el HTML
        const numeroReclamoElement = document.querySelector("#numero-reclamo");
        if (numeroReclamoElement) {
            numeroReclamoElement.textContent = `✅ Número de Reclamo: ${ultimoID}`;
        } else {
            console.error("⚠️ No se encontró el elemento con ID 'numero-reclamo' en el HTML.");
        }

    } catch (error) {
        console.error("❌ Error al obtener el último ID:", error);
    }
});
