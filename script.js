// --- 5. FUNCIÓN DE RENDERIZADO CON OSMD (CON VERIFICACIÓN DE CARGA) ---

function renderMusicXml(xmlContent) {
    
    // Función recursiva que espera hasta que la librería esté cargada
    function tryRender() {
        // Verifica si la librería OpenSheetMusicDisplay ya existe
        if (typeof OpenSheetMusicDisplay !== 'undefined') {
            
            // Si existe, procede con el renderizado normal
            visorCanvas.innerHTML = ''; 

            try {
                const osmd = new OpenSheetMusicDisplay("visor-canvas", {
                    backend: "canvas",
                });

                osmd.load(xmlContent).then(function() {
                    osmd.render(); 
                    visorCanvas.insertAdjacentHTML('afterbegin', '<p style="color: green;">Partitura cargada correctamente (el backend envía datos, pero aún no música real).</p>');
                }).catch(error => {
                    visorCanvas.innerHTML = `<p style="color: orange;">XML Inválido para OSMD. Backend envió datos que el visor no entiende.</p>`;
                    console.error("Error al renderizar con OSMD:", error);
                });
            } catch (error) {
                visorCanvas.innerHTML = `<p style="color: red;">Error fatal al inicializar el visor: ${error.message}</p>`;
                console.error("Error fatal:", error);
            }

        } else {
            // Si no existe (el error que estás viendo), espera 100ms y reintenta
            visorCanvas.innerHTML = '<p>Cargando librería de visualización...</p>';
            console.warn("OpenSheetMusicDisplay no definida, reintentando en 100ms...");
            setTimeout(tryRender, 100); 
        }
    }
    
    // Inicia el proceso de renderizado/espera
    tryRender();
}
