// Este evento asegura que NINGÚN CÓDIGO se ejecute hasta que el HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DECLARACIÓN DE VARIABLES Y REFERENCIAS ---
    const fileInput = document.getElementById('mp3FileInput');
    const selectButton = document.getElementById('selectFileButton');
    const convertButton = document.getElementById('convertButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const visorCanvas = document.getElementById('visor-canvas');

    let selectedFile = null;

    // URL CONFIRMADA DE TU BACKEND EN RENDER (TERMINA EN /convertir)
    const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir'; 


    // --- 2. GESTIÓN DE LA CARGA DE ARCHIVOS ---

    // Conexión del botón visible al input oculto
    selectButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Lógica que habilita el botón y GUARDA el archivo
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            selectedFile = event.target.files[0]; 
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            convertButton.disabled = false; 
        } else {
            selectedFile = null;
            fileNameDisplay.textContent = 'Esperando archivo...';
            convertButton.disabled = true;
        }
    });
    
    // Inicializar el mensaje
    fileNameDisplay.textContent = 'Listo para subir un archivo.';


    // --- 3. LÓGICA DEL BOTÓN "CONVERTIR A PARTITURA" ---

    convertButton.addEventListener('click', () => {
        if (selectedFile) { 
            convertToMusicXml(); 
        } else {
            // Esto solo ocurriría por un error de sincronización
            alert("Por favor, selecciona un archivo MP3 primero.");
        }
    });


    // --- 4. FUNCIÓN ASÍNCRONA DE CONVERSIÓN (Fetch) ---

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
            });

            if (!response.ok) {
                let statusText = response.statusText ? `: ${response.statusText}` : '';
                let errorMessage = await response.text();
                // Si el backend responde, pero con error (ej. 500, 400), muestra el detalle.
                throw new Error(`Error HTTP: ${response.status}${statusText}. Mensaje del servidor: ${errorMessage.substring(0, 100)}...`);
            }

            const xmlText = await response.text();
            
            // Renderizado del XML (OSMD)
            renderMusicXml(xmlText);

        } catch (error) {
            // Si hay un error de red (Failed to fetch), se captura aquí.
            visorCanvas.innerHTML = `<p style="color: red;">Error en la conversión o comunicación: ${error.message}</p>`;
            console.error("Error en la conversión:", error);
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = 'Convertir a Partitura';
        }
    }


    // --- 5. FUNCIÓN DE RENDERIZADO CON OSMD (Resuelve el error "is not defined") ---

    function renderMusicXml(xmlContent) {
        try {
            visorCanvas.innerHTML = ''; 

            // Esta línea funciona si la librería se cargó en index.html
            const osmd = new OpenSheetMusicDisplay("visor-canvas", {
                backend: "canvas",
            });

            osmd.load(xmlContent).then(function() {
                osmd.render(); 
                visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente (aunque el backend aún devuelve una partitura vacía).</p>');

            }).catch(error => {
                visorCanvas.innerHTML = `<p style="color: orange;">El XML es sintácticamente correcto pero inválido para MusicXML (verifique el backend).</p>`;
                console.error("Error al renderizar con OSMD:", error);
            });

        } catch (error) {
            visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
            console.error("Error fatal:", error);
        }
    }

}); // FIN del evento DOMContentLoaded
