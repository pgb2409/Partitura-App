// Este evento asegura que NINGÚN CÓDIGO se ejecute hasta que el HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DECLARACIÓN DE VARIABLES Y REFERENCIAS ---
    const fileInput = document.getElementById('mp3FileInput');
    const convertButton = document.getElementById('convertButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const visorCanvas = document.getElementById('visor-canvas');

    let selectedFile = null;

    // URL CONFIRMADA DE TU BACKEND EN RENDER (TERMINA EN /convertir)
    const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir'; 

    // --- 2. GESTIÓN DE LA CARGA DE ARCHIVOS (ESTA ES LA SECCIÓN CLAVE) ---

    // La lógica que habilita el botón y GUARDA el archivo
    fileInput.addEventListener('change', (event) => {
        // Verifica si SÍ se seleccionó un archivo
        if (event.target.files && event.target.files.length > 0) {
            // LÍNEA CLAVE: El archivo se guarda aquí y el display se actualiza
            selectedFile = event.target.files[0]; 
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            convertButton.disabled = false; // HABILITA el botón Convertir
        } else {
            // Si el usuario canceló la selección
            selectedFile = null;
            fileNameDisplay.textContent = 'Selección cancelada. Esperando archivo...';
            convertButton.disabled = true;
        }
    });
    
    // Inicializar el mensaje (dejamos este mensaje simple)
    fileNameDisplay.textContent = 'Esperando archivo...';


    // --- 3. LÓGICA DEL BOTÓN "CONVERTIR A PARTITURA" ---
    // ... (El resto del script queda igual) ...
    
    // ... (incluyendo convertToMusicXml y renderMusicXml)
    
}); // FIN del evento DOMContentLoaded
