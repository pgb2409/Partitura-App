document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los elementos clave de la página
    const abcTextarea = document.getElementById('abcTextarea');
    const outputDiv = document.getElementById('output');
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    
    // Función para dibujar la partitura y controlar la visibilidad del botón
    const renderMusic = () => {
        const abc = abcTextarea.value;
        
        // Renderiza la partitura usando ABCJS (la librería de música)
        const notation = window.ABCJS.renderAbc('output', abc, { 
            staffwidth: 800,
            responsive: 'resize'
        });
        
        // Si la partitura se dibujó sin errores (la matriz notation tiene contenido),
        // hacemos el botón de descarga visible.
        if (notation && notation.length > 0) {
            downloadPdfButton.style.display = 'block'; // Mostrar el botón
        } else {
            downloadPdfButton.style.display = 'none'; // Ocultar si hay errores o está vacío
        }
    };

    // Cada vez que el usuario escribe o cambia el texto, se redibuja la partitura
    abcTextarea.addEventListener('input', renderMusic);

    // Dibuja la música inicial al cargar la página por primera vez
    renderMusic();
    
    // --- 2. Lógica para la Descarga del PDF ---
    
    // Cuando el usuario hace clic en el botón
    downloadPdfButton.addEventListener('click', () => {
        // Obtenemos la imagen de la partitura (está en formato SVG)
        const svgElement = outputDiv.querySelector('svg');
        
        if (!svgElement) {
            alert('Error: No se encontró la partitura para descargar.');
            return;
        }

        // Convertir el SVG a un formato que el PDF pueda leer
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBase64 = btoa(svgData);
        const svgUrl = 'data:image/svg+xml;base64,' + svgBase64;
        
        // Inicializar el objeto PDF (usando la librería jsPDF)
        const doc = new window.jspdf.jsPDF({
            orientation: 'landscape', // Formato Horizontal (A4 apaisado)
            unit: 'mm',
            format: 'a4'
        });

        // Añadir la partitura (SVG) al documento PDF
        // Los números ajustan el tamaño para que quepa bien en el documento
        doc.addImage(svgUrl, 'SVG', 10, 10, 277, 190); 

        // Definir el nombre del archivo de descarga
        let filename = 'Partitura.pdf';
        
        // Intentar usar el título de la partitura (T:) como nombre de archivo
        const abc = abcTextarea.value;
        const titleMatch = abc.match(/^T:\s*(.*)/m);
        if (titleMatch && titleMatch[1]) {
            // Limpiar el título para que sea un nombre de archivo válido
            filename = titleMatch[1].replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
        }
        
        // Ejecutar la descarga
        doc.save(filename);
    });
});
