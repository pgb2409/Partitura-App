document.addEventListener('DOMContentLoaded', () => {
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
        drawingParameters: "compact", // Dibujo compacto y limpio (ideal para principiantes)
        set: { drawTitle: false, drawComposer: false }, // Controlamos el dibujo de metadatos
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
            // Cargar y Renderizar la partitura profesional
            await osmd.load(musicXmlText);
            osmd.render();
            
            // Si el renderizado es exitoso, mostramos el botón de descarga
            downloadPdfButton.style.display = 'flex'; 

        } catch (error) {
            outputDiv.innerHTML = '<h2>Error: Archivo de partitura inválido o incompleto.</h2><p class="text-red-500">Asegúrate de que el nombre del archivo es correcto y el contenido es MusicXML válido.</p>';
            downloadPdfButton.style.display = 'none'; 
            console.error("Error al renderizar partitura con OSMD:", error);
        }
    };

    // ------------------------------------------------------------------
    // C. Lógica del Botón "Cargar Partitura" (Busca en la carpeta local)
    // ------------------------------------------------------------------

    loadButton.addEventListener('click', async () => {
        const fileName = fileNameInput.value.trim();
        
        if (!fileName || !fileName.endsWith('.xml')) {
            // Utilizamos una alerta simple ya que no hay confirm() ni alert() en el entorno
            outputDiv.innerHTML = '<h2 class="text-red-500">Error: Nombre de archivo inválido.</h2><p>Por favor, introduce un nombre de archivo que termine en ".xml".</p>';
            downloadPdfButton.style.display = 'none';
            return; 
        }

        outputDiv.innerHTML = '<h2>Cargando partitura desde /partituras/...</h2>';
        
        try {
            // Hacemos una solicitud HTTP para obtener el archivo MusicXML de su propia carpeta /partituras/
            const url = `./partituras/${fileName}`;
            const response = await fetch(url); 
            
            if (!response.ok) {
                 // Si el archivo no se encuentra (error 404)
                throw new Error(`Error ${response.status}: Archivo no encontrado.`);
            }

            const musicXmlContent = await response.text();
            
            // Dibujamos la partitura descargada
            renderMusic(musicXmlContent);
        } catch (error) {
            outputDiv.innerHTML = `<h2>¡Error al cargar!</h2><p class="text-red-500">No se pudo encontrar o cargar el archivo <strong>"${fileName}"</strong>. Asegúrate de que existe en la carpeta /partituras/.</p>`;
            downloadPdfButton.style.display = 'none';
            console.error("Error al cargar el archivo:", error);
        }
    });

    // ------------------------------------------------------------------
    // D. Lógica para la Descarga del PDF
    // ------------------------------------------------------------------
    
    downloadPdfButton.addEventListener('click', () => {
        // Obtenemos el SVG que OSMD ha dibujado
        const svgElement = outputDiv.querySelector('svg');
        if (!svgElement) {
             console.error("No se encontró el SVG para descargar.");
             return;
        }

        // Serializamos el SVG a una cadena de texto para el PDF
        const svgData = new XMLSerializer().serializeToString(svgElement);
        
        // Creamos el documento PDF
        const doc = new window.jsPDF.jsPDF({ 
            orientation: 'landscape', 
            unit: 'mm', 
            format: 'a4' 
        });

        // Usamos el plugin doc.svg para agregar el SVG al PDF con el tamaño adecuado
        doc.svg(svgData, { x: 5, y: 5, width: 287, height: 200 })
           .then(() => {
            
            // Usamos el título de la partitura para nombrar el archivo (si OSMD lo extrajo)
            const title = osmd.sheet?.TitleString || fileNameInput.value.replace('.xml', '') || 'Partitura_Descargada';
            // Limpiamos el nombre para que sea seguro
            const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
            
            doc.save(filename);
        });
    });
});
