// Referencias a elementos del DOM
const fileInput = document.getElementById('mp3FileInput');
const selectButton = document.getElementById('selectFileButton');
const convertButton = document.getElementById('convertButton');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const visorCanvas = document.getElementById('visor-canvas');

// Estado de la aplicación
let selectedFile = null;

// URL de tu backend
const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir';

// --- GESTIÓN DE LA CARGA DE ARCHIVOS ---

// El botón "Seleccionar" hace click en el input de archivo (que está oculto)
selectButton.addEventListener('click', () => {
    fileInput.click();
});

// Cuando se selecciona un archivo, actualiza el estado
fileInput.addEventListener('change', (event) => {
    // Si hay archivos seleccionados, toma el primero
    if (event.target.files.length > 0) {
        selectedFile = event.target.files[0];
        fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
        convertButton.disabled = false; // Habilita el botón de conversión
    } else {
        selectedFile = null;
        fileNameDisplay.textContent = 'Esperando archivo...';
        convertButton.disabled = true;
    }
});


// --- LÓGICA DE CONVERSIÓN Y VISUALIZACIÓN ---

convertButton.addEventListener('click', () => {
    if (selectedFile) {
        convertToMusicXml();
    } else {
        alert("Por favor, selecciona un archivo MP3 primero.");
    }
});

async function convertToMusicXml() {
    convertButton.disabled = true;
    convertButton.textContent = 'Convirtiendo...';
    visorCanvas.innerHTML = '<p>Enviando archivo al backend y esperando análisis...</p>';

    const formData = new FormData();
    formData.append('mp3File', selectedFile);

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData,
            // Nota: fetch automáticamente establece el Content-Type para FormData
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // El backend responde con el contenido del archivo .musicxml como texto
        const xmlText = await response.text();
        
        // ** PUNTO CRÍTICO RESUELTO: VISUALIZACIÓN REAL **
        renderMusicXml(xmlText);

    } catch (error) {
        visorCanvas.innerHTML = `<p style="color: red;">Error en la conversión o comunicación: ${error.message}</p>`;
        console.error("Error en la conversión:", error);
    } finally {
        convertButton.disabled = false;
        convertButton.textContent = 'Convertir a Partitura';
    }
}

// --- FUNCIÓN DE RENDERIZADO CON OSMD (Solución al Problema 3) ---

function renderMusicXml(xmlContent) {
    try {
        // Limpiamos el contenedor
        visorCanvas.innerHTML = ''; 

        // 1. Inicializar OpenSheetMusicDisplay con el ID del contenedor
        const osmd = new OpenSheetMusicDisplay("visor-canvas", {
            backend: "canvas",
            // Puedes añadir más opciones aquí, como si quieres ver o no la tablatura
        });

        // 2. Cargar el contenido XML
        osmd.load(xmlContent).then(function() {
            // 3. Renderizar la partitura
            osmd.render(); 
            visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente (renderizado gráfico).</p>');

        }).catch(error => {
            // Esto captura errores si el XML recibido es inválido para OSMD
            visorCanvas.innerHTML = `<p style="color: orange;">El XML es sintácticamente correcto pero inválido para MusicXML (puede ser el XML simulado).</p>
                                     <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.8em;">Contenido XML: ${xmlContent.substring(0, 500)}...</pre>`;
            console.error("Error al renderizar con OSMD:", error);
        });

    } catch (error) {
        visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
        console.error("Error fatal:", error);
    }
}

// Inicializar el mensaje al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fileNameDisplay.textContent = 'Listo para subir un archivo.';
});
