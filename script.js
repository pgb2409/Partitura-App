document.addEventListener('DOMContentLoaded', () => {
    // Nombre del repositorio. ¡DEBE SER EXACTAMENTE IGUAL AL NOMBRE DE TU REPOSITORIO EN GITHUB!
    // **CAMBIA '/Partitura-App' por el nombre exacto de tu repositorio si es diferente.**
    const REPO_NAME = '/Partitura-App'; 
    
    // 1. Obtener los elementos del DOM
    const fileNameInput = document.getElementById('fileNameInput');
    const loadButton = document.getElementById('loadButton');
    const outputDiv = document.getElementById('output');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // ------------------------------------------------------------------
    // A. Inicialización del Motor de Partituras (OSMD)
    // ------------------------------------------------------------------
    
    // Configuramos el motor OSMD que leerá MusicXML
    const osmd = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(outputDiv, {
        backend: "svg", 
        drawingParameters: "compact", // Dibujo compacto y limpio
        set: { drawTitle: false, drawComposer: false }, 
        disableCursor: true, 
        autoResize: true, 
    });

    // ------------------------------------------------------------------
    // B. Función Central: Dibujar la Partitura desde Texto MusicXML
    // ------------------------------------------------------------------

    /**
     * Carga el texto XML en OSMD y lo renderiza.
     * @param {string} musicXmlText - Contenido del archivo MusicXML.
     */
    const renderMusic = async (musicXmlText) => {
        try {
            outputDiv.innerHTML = '<h2>Dibujando partitura...</h2>';
            // Cargar y Renderizar la partitura
            await osmd.load(musicXmlText);
            osmd.render();
            
            // Si el renderizado es exitoso, mostramos el botón de descarga
            downloadPdfButton.style.display = 'flex'; 

        } catch (error) {
            outputDiv.innerHTML = '<h2>Error: Archivo de partitura inválido o incompleto.</h2><p class="text-red-500">Asegúrate de que el contenido es MusicXML válido.</p>';
            downloadPdfButton.style.display = 'none'; 
            console.error("Error al renderizar partitura con OSMD:", error);
        }
    };

    // ------------------------------------------------------------------
    // C. Lógica del Botón "Cargar Partitura"
    // ------------------------------------------------------------------

    loadButton.addEventListener('click', async () => {
        const fileName = fileNameInput.value.trim();
        
        if (!fileName || !fileName.endsWith('.xml')) {
            outputDiv.innerHTML = '<h2 class="text-red-500">Error: Nombre de archivo inválido.</h2><p>Por favor, introduce un nombre de archivo que termine en ".xml".</p>';
            downloadPdfButton.style.display = 'none';
            return; 
        }

        outputDiv.innerHTML = '<h2>Cargando partitura desde /partituras/...</h2>';
        
        try {
            // Construye la ruta incluyendo el nombre del repositorio para GitHub Pages
            const url = `${REPO_NAME}/partituras/${fileName}`; 
            
            // Intentar cargar el archivo
            const response = await fetch(url); 
            
            if (!response.ok) {
                 // Si el archivo no se encuentra (error 404)
                throw new Error(`Error ${response.status}: Archivo no encontrado. URL: ${url}`);
            }

            const musicXmlContent = await response.text();
            
            // Dibujamos la partitura descargada
            renderMusic(musicXmlContent);
        } catch (error) {
            outputDiv.innerHTML = `<h2>¡Error al cargar!</h2><p class="text-red-500">No se pudo encontrar o cargar el archivo <strong>"${fileName}"</strong>. Revisa la consola (F12).</p>`;
            downloadPdfButton.style.display = 'none';
            console.error("Error al cargar el archivo:", error);
        }
    });

    // ------------------------------------------------------------------
    // D. Lógica para la Descarga del PDF
    // ------------------------------------------------------------------
    
    downloadPdfButton.addEventListener('click', () => {
        const svgElement = outputDiv.querySelector('svg');
        if (!svgElement) {
             console.error("No se encontró el SVG para descargar.");
             return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        
        const doc = new window.jsPDF.jsPDF({ 
            orientation: 'landscape', 
            unit: 'mm', 
            format: 'a4' 
        });

        doc.svg(svgData, { x: 5, y: 5, width: 287, height: 200 })
           .then(() => {
            
            const title = osmd.sheet?.TitleString || fileNameInput.value.replace('.xml', '') || 'Partitura_Descargada';
            const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
            
            doc.save(filename);
        });
    });
});
