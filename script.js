// Este evento asegura que NINGÚN CÓDIGO se ejecute hasta que el HTML esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DECLARACIÓN DE VARIABLES Y REFERENCIAS ---
    const convertButton = document.getElementById('convertButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const visorCanvas = document.getElementById('visor-canvas');

    let selectedFile = null;

    // URL CONFIRMADA DE TU BACKEND EN RENDER 
    const BACKEND_URL = 'https://backend-conversor-51sa.onrender.com/convertir'; 

    // Inicializar el mensaje
    fileNameDisplay.textContent = 'Listo para subir un archivo.';


    // --- 2. GESTIÓN DE LA CARGA DE ARCHIVOS (Conexión Directa y Habilitación) ---

    // CONEXIÓN CLAVE: Captura el archivo seleccionado
    document.getElementById('mp3FileInput').addEventListener('change', (event) => {
        
        // Verificamos si SÍ se seleccionó un archivo
        if (event.target.files && event.target.files.length > 0) {
            
            // El archivo se guarda
            selectedFile = event.target.files[0]; 
            fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
            
            // **********************************************
            // SOLUCIÓN FINAL: HABILITAR CON RETRASO 
            // Esto asegura que la propiedad 'disabled' se actualice correctamente.
            setTimeout(() => {
                 convertButton.disabled = false;
            }, 50); 
            // **********************************************
            
        } else {
            // Si el usuario canceló la selección
            selectedFile = null;
            fileNameDisplay.textContent = 'Selección cancelada. Listo para subir un archivo.';
            convertButton.disabled = true;
        }
    });


    // --- 3. LÓGICA DEL BOTÓN "CONVERTIR A PARTITURA" ---

    convertButton.addEventListener('click', () => {
        if (selectedFile) { 
            convertToMusicXml(); 
        } else {
            // Este alerta solo se dispara si el botón estaba habilitado sin archivo (error)
            alert("Error: No hay un archivo seleccionado. Recargue la página si el botón está activo sin archivo.");
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
            visorCanvas.innerHTML = `<p style="color: red;">Error en la conversión o comunicación: ${error.message}</p>`;
            console.error("Error en la conversión:", error);
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = 'Convertir a Partitura';
        }
    }


    // --- 5. FUNCIÓN DE RENDERIZADO CON OSMD (Usa la carga local) ---

    function renderMusicXml(xmlContent) {
        
        function tryRender() {
            // Verifica si la librería se cargó localmente
            if (typeof OpenSheetMusicDisplay !== 'undefined') {
                
                visorCanvas.innerHTML = ''; 

                try {
                    const osmd = new OpenSheetMusicDisplay("visor-canvas", {
                        backend: "canvas",
                    });

                    osmd.load(xmlContent).then(function() {
                        osmd.render(); 
                        visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente. ¡El frontend funciona! Ahora verificamos el procesamiento de Python.</p>');

                    }).catch(error => {
                        visorCanvas.innerHTML = `<p style="color: orange;">XML Inválido para OSMD. El backend envió datos, pero no son MusicXML válido.</p>`;
                        console.error("Error al renderizar con OSMD:", error);
                    });
                } catch (error) {
                    visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
                    console.error("Error fatal:", error);
                }

            } else {
                visorCanvas.innerHTML = '<p>Cargando librería de visualización...</p>';
                console.warn("OpenSheetMusicDisplay no definida. Asegúrese que el archivo está en /lib.");
                setTimeout(tryRender, 100); 
            }
        }
        
        tryRender();
    }

}); // FIN del evento DOMContentLoaded
