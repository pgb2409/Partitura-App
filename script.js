document.addEventListener('DOMContentLoaded', () => {
    // ESTE ARCHIVO AHORA SOLO MANEJA LA DESCARGA DE PDF Y EL DIBUJO DE LA PARTITURA.

    const abcTextarea = document.getElementById('abcTextarea');
    const outputDiv = document.getElementById('output');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // ------------------------------------------------------------------
    // A. Lógica para Dibujar la Partitura y Controlar el Botón de Descarga
    // ------------------------------------------------------------------

    const renderMusic = () => {
        const abc = abcTextarea.value;
        
        // Limpiamos el contenedor y dibujamos la partitura
        outputDiv.innerHTML = '';
        const notation = window.ABCJS.renderAbc('output', abc, { 
            staffwidth: 800,
            responsive: 'resize'
        });
        
        // Controlamos la visibilidad del botón de descarga (ESTO DEBE FUNCIONAR)
        if (notation && notation.length > 0) {
            downloadPdfButton.style.display = 'block'; 
        } else {
            downloadPdfButton.style.display = 'none'; 
        }
    };

    // Al escribir, se redibuja la partitura
    abcTextarea.addEventListener('input', renderMusic);
    renderMusic(); // Dibuja la música inicial

    // ------------------------------------------------------------------
    // B. Lógica para la Descarga del PDF
    // ------------------------------------------------------------------
    
    downloadPdfButton.addEventListener('click', () => {
        const svgElement = outputDiv.querySelector('svg');
        if (!svgElement) {
            alert('Error: No se encontró la partitura para descargar.');
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBase64 = btoa(svgData);
        const svgUrl = 'data:image/svg+xml;base64,' + svgBase64;
        
        const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.addImage(svgUrl, 'SVG', 10, 10, 277, 190); 

        let filename = 'Partitura.pdf';
        const abc = abcTextarea.value;
        const titleMatch = abc.match(/^T:\s*(.*)/m);
        if (titleMatch && titleMatch[1]) {
            filename = titleMatch[1].replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
        }
        
        doc.save(filename);
    });
});
