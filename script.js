// Este evento asegura que NINGÚN CÓDIGO se ejecute hasta que el HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DECLARACIÓN DE VARIABLES Y REFERENCIAS ---
    const fileInput = document.getElementById('mp3FileInput');
    const selectButton = document.getElementById('selectFileButton');
    const convertButton = document.getElementById('convertButton'); // Botón de Partitura
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const visorCanvas = document.getElementById('visor-canvas');

    let selectedFile = null;

    // *** ASEGÚRATE DE QUE ESTA URL SEA LA CORRECTA DE RENDER ***
    const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir'; 


    // --- 2. GESTIÓN DE LA CARGA DE ARCHIVOS (Botón Seleccionar MP3) ---

    // Conexión del botón visible al input oculto (ya resuelto)
    selectButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Habilitar/Deshabilitar el botón "Convertir a Partitura"
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            selectedFile = event.target.files[0];
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            convertButton.disabled = false; // HABILITACIÓN CLAVE
        } else {
            selectedFile = null;
            fileNameDisplay.textContent = 'Esperando archivo...';
            convertButton.disabled = true;
        }
    });
    
    // Inicializar el mensaje
    fileNameDisplay.textContent = 'Listo para subir un archivo.';


    // --- 3. LÓGICA DEL BOTÓN "CONVERTIR A PARTITURA" ---

    // Asigna el evento 'click' al botón de conversión
    convertButton.addEventListener('click', () => {
        if (selectedFile) {
            // Llama a la función de envío (que está definida más abajo)
            convertToMusicXml(); 
        } else {
            // Esto no debería suceder si el botón está deshabilitado
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
                let errorMessage = await response.text();
                throw new Error(`Error HTTP: ${response.status}. Mensaje del servidor: ${errorMessage.substring(0, 100)}...`);
            }

            const xmlText = await response.text();
            
            // Renderizado del XML (OSMD)
            renderMusicXml(xmlText);

        } catch (error) {
            visorCanvas.innerHTML = `<p style="color: red;">Error en la conversión o comunicación: ${error.message}</p>`;
            console.error("Error en la conversión:", error);
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = 'Convertir a Partitura';
        }
    }


    // --- 5. FUNCIÓN DE RENDERIZADO CON OSMD ---

    function renderMusicXml(xmlContent) {
        try {
            visorCanvas.innerHTML = ''; 

            const osmd = new OpenSheetMusicDisplay("visor-canvas", {
                backend: "canvas",
            });

            osmd.load(xmlContent).then(function() {
                osmd.render(); 
                visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente (renderizado gráfico).</p>');

            }).catch(error => {
                visorCanvas.innerHTML = `<p style="color: orange;">El XML es sintácticamente correcto pero inválido para MusicXML (verifique el backend).</p>
                                         <pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.8em;">Contenido XML: ${xmlContent.substring(0, 500)}...</pre>`;
                console.error("Error al renderizar con OSMD:", error);
            });

        } catch (error) {
            visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
            console.error("Error fatal:", error);
        }
    }

}); // FIN del evento DOMContentLoaded
