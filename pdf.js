
document.addEventListener("DOMContentLoaded", function () {
    // Recuperar los datos del localStorage
    let datos = JSON.parse(localStorage.getItem("datosFormulario"));

    if (!datos || !datos.id) {
        console.log("⚠️ No hay datos válidos para generar el PDF. Intentando recargar datos...");

        // Esperar un poco y volver a obtener los datos
        setTimeout(() => {
            datos = JSON.parse(localStorage.getItem("datosFormulario"));
            if (!datos || !datos.id) {
                console.error("❌ Error: Los datos aún no están disponibles.");
                return;
            }
        }, 1000);
    }

    // Capturar el enlace de descarga
    const downloadLink = document.querySelector(".enlace-pdf");

    if (downloadLink) {
        downloadLink.addEventListener("click", function (event) {
            event.preventDefault();
            generarPDF(datos);
        });
    }

    // Eliminar los datos cuando se haga clic en "Enviar otra respuesta"
    const resetLink = document.querySelector(".enlace-volver");
    if (resetLink) {
        resetLink.addEventListener("click", function () {
            localStorage.removeItem("datosFormulario");
        });
    }
});

// Función para generar el PDF con estilo
function generarPDF(datos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ALMA BONITA PERU E.I.R.L.", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("RUC: 20600577990", 105, 22, { align: "center" });
    doc.text("Dirección: Los Olivos 381 - San Isidro", 105, 28, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(200, 0, 0);
    doc.text("Hoja de Reclamaciones", 105, 38, { align: "center" });
    doc.setTextColor(0, 0, 0);

    // Formatear la fecha de registro a "día-mes-año"
    // function formatearFecha(fecha) {
    //     const date = new Date(fecha);
    //     const año = date.getFullYear();
    //     const mes = String(date.getMonth() + 1).padStart(2, '0');
    //     const dia = String(date.getDate()).padStart(2, '0');
    //     return `${dia}-${mes}-${año}`;
    // }
    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const año = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const dia = String(date.getDate()).padStart(2, '0');
        const horas = String(date.getHours()).padStart(2, '0');
        const minutos = String(date.getMinutes()).padStart(2, '0');
        const segundos = String(date.getSeconds()).padStart(2, '0');
        
        return `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`;
    }

    // Verificar si `datos.id` está definido
    if (!datos.id) {
        console.error("❌ Error: El ID del reclamo no está definido.");
        return;
    }

    // Tabla de datos
    const info = [
        ["N° de Reclamo", String(datos.id)], 
        ["Fecha y hora de Registro", datos.fechaRegistro ? formatearFecha(datos.fechaRegistro) : "No disponible"],
        ["Nombre", datos.nombre || "No disponible"],
        ["DNI / RUC", datos.dni || "No disponible"],
        ["Teléfono", datos.telefono || "No disponible"],
        ["Correo Electrónico", datos.correo || "No disponible"],
        ["Dirección completa", datos.domicilio || "No disponible"],
        ["Distrito", datos.distrito || "No disponible"],
        ["Departamento", datos.departamento || "No disponible"],
        ["Provincia", datos.provincia || "No disponible"],
        ["Canal de Compra", datos.canalCompra || "No disponible"],
        ["Producto Adquirido", datos.producto || "No disponible"],
        ["Costo del Producto", datos.costoProducto ? `S/ ${datos.costoProducto}` : "No disponible"],
        ["Tipo de Reclamo", datos.tipoReclamo || "No disponible"],
        ["Detalle del Reclamo", datos.detalle || "No disponible"],
        ["Pedido del Consumidor", datos.pedido || "No disponible"],
        ["Observaciones", datos.observaciones || "No disponible"],
    ];

    // Convertir la matriz en un objeto para mejor depuración
    console.table(Object.fromEntries(info));

    let y = 50;
    doc.setFontSize(10);
    info.forEach(([key, value]) => {
        doc.setFillColor(200, 50, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(15, y, 80, 8, "F"); // Fondo de la celda izquierda
        doc.text(key, 17, y + 5, { maxWidth: 78 });

        doc.setFillColor(240, 240, 240);
        doc.setTextColor(0, 0, 0);
        doc.rect(95, y, 100, 8, "F"); // Fondo de la celda derecha
        doc.text(value, 97, y + 5, { maxWidth: 98 });

        y += 10;
    });

    doc.save("Hoja_Reclamaciones.pdf");
}
