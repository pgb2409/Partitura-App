// ====================================================================
// --- LÓGICA AGREGADA PARA LA VISIBILIDAD Y DESCARGA DEL BOTÓN PDF ---
// ====================================================================

// Asegúrate de que los elementos sean accesibles
const abcTextarea = document.getElementById('abcTextarea');
const outputDiv = document.getElementById('output');
const downloadPdfButton = document.getElementById('downloadPdfButton');

// 1. RE-DEFINICIÓN de la función de renderizado
// Necesitamos que esta función se ejecute SIEMPRE que se dibuje la partitura
// para controlar la visibilidad del botón de descarga.

const originalRenderMusic = window.renderMusic || function() {
    // Si la función ya existe en tu script_v2.js, la usamos. 
    // Si no, definimos una función básica para evitar errores.
    const abc = abcTextarea.value;
    const notation = window.ABCJS.renderAbc('output', abc, { 
        staffwidth: 800,
        responsive: 'resize'
    });
    return notation;
};

// Sobreescribimos la función de renderizado para añadir la lógica del botón
window.renderMusic = function() {
    const notation = originalRenderMusic();

    // Comprobación para hacer visible el botón
    if (notation && notation.length > 0) {
        downloadPdfButton.style.display = 'block'; 
    } else {
        downloadPdfButton.style.display = 'none'; 
    }
    return notation;
};

// Aseguramos que la partitura se redibuje al escribir
abcTextarea.addEventListener('input', window.renderMusic);
// También la dibujamos al inicio
window.renderMusic();


// 2. Lógica para la Descarga al hacer click
downloadPdfButton.addEventListener('click', () => {
    // Obtenemos la imagen de la partitura (SVG)
    const svgElement = outputDiv.querySelector('svg');
    
    if (!svgElement) {
        alert('Error: No se encontró la partitura para descargar.');
        return;
    }

    // Conversión del SVG a datos para el PDF
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBase64 = btoa(svgData);
    const svgUrl = 'data:image/svg+xml;base64,' + svgBase64;
    
    // Inicializar el objeto PDF
    const doc = new window.jspdf.jsPDF({
        orientation: 'landscape', 
        unit: 'mm',
        format: 'a4'
    });

    // Añadir el SVG al PDF
    doc.addImage(svgUrl, 'SVG', 10, 10, 277, 190); 
    
    // Usar el título de la partitura como nombre de archivo
    let filename = 'Partitura.pdf';
    const abc = abcTextarea.value;
    const titleMatch = abc.match(/^T:\s*(.*)/m);
    if (titleMatch && titleMatch[1]) {
        filename = titleMatch[1].replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
    }
    
    doc.save(filename);
});

// ====================================================================
