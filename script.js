// Este evento asegura que NINGÚN CÓDIGO se ejecute hasta que el HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DECLARACIÓN DE VARIABLES Y REFERENCIAS ---
    const fileInput = document.getElementById('mp3FileInput');
    console.log("El script se está ejecutando.");
alert("Script cargado."); // ESTA ES LA LÍNEA DE PRUEBA
    const selectButton = document.getElementById('selectFileButton');
    const convertButton = document.getElementById('convertButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const visorCanvas = document.getElementById('visor-canvas');

    // VARIABLE CLAVE: La definimos aquí para que sea visible en todo el script.
    let selectedFile = null;

    // *** ASEGÚRATE DE QUE ESTA URL SEA LA CORRECTA DE RENDER ***
    const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir'; 


    // --- 2. GESTIÓN DE LA CARGA DE ARCHIVOS (Botón Seleccionar MP3) ---

    // Conexión del botón visible al input oculto
    selectButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Lógica que habilita el botón y GUARDA el archivo en la variable seleccionada
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            // LÍNEA CLAVE: El archivo se guarda aquí
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


    // --- 3. LÓGICA DEL BOTÓN "CONVERTIR A PARTITURA" (El que no funcionaba) ---

    // Asigna el evento 'click' que verifica si el archivo existe y lo envía
    convertButton.addEventListener('click', () => {
        // La condición es: si la variable 'selectedFile' tiene un archivo, envíalo.
        if (selectedFile) { 
            convertToMusicXml(); 
        } else {
            alert("Error interno: selectedFile está vacío.");
        }
    });


    // --- 4. FUNCIÓN ASÍNCRONA DE CONVERSIÓN (Fetch) ---

    async function convertToMusicXml() {
        convertButton.disabled = true;
        convertButton.textContent = 'Convirtiendo...';
        visorCanvas.innerHTML = '<p>Enviando archivo al backend y esperando análisis...</p>';

        const formData = new FormData();
        // Aquí usamos la variable que se guardó en el paso 2
        formData.append('mp3File', selectedFile); 

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let statusText = response.statusText ? `: ${response.statusText}` : '';
                let errorMessage = await response.text();
                throw new Error(`Error HTTP: ${response.status}${statusText}. Mensaje del servidor: ${errorMessage.substring(0, 100)}...`);
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
                visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente.</p>');

            }).catch(error => {
                visorCanvas.innerHTML = `<p style="color: orange;">El XML es sintácticamente correcto pero el visor OSMD ha fallado.</p>`;
                console.error("Error al renderizar con OSMD:", error);
            });

        } catch (error) {
            visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
            console.error("Error fatal:", error);
        }
    }

}); // FIN del evento DOMContentLoaded

