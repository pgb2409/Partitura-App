document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los elementos clave de la página
    const fileInput = document.getElementById('fileInput');
    const convertButton = document.getElementById('convertButton');
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
        
        // Controlamos la visibilidad del botón de descarga (LO QUE QUERÍAMOS SOLUCIONAR)
        if (notation && notation.length > 0) {
            downloadPdfButton.style.display = 'block'; // Mostrar el botón
        } else {
            downloadPdfButton.style.display = 'none'; // Ocultar si hay errores o está vacío
        }
    };

    // Al escribir en el área de texto, se redibuja la partitura
    abcTextarea.addEventListener('input', renderMusic);
    // Dibuja la música inicial al cargar la página
    renderMusic();

    // ------------------------------------------------------------------
    // B. Lógica de Conversión de Archivos (Necesita ser restaurada)
    // ------------------------------------------------------------------
    
    // Esta es la lógica que debe existir en tu proyecto para que el botón "Convertir" funcione.
    // **NOTA CRÍTICA:** La función real de transcripción (de MP3 a ABC)
    // requiere librerías externas que no están en este código.
    // Este código RESTAURA el "escuchador" de eventos del botón.

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Archivo seleccionado:", file.name);
            // Aquí iría la lógica para pre-procesar el archivo antes de la conversión.
        }
    });

    convertButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        
        if (!file) {
            alert("Por favor, selecciona un archivo primero.");
            return;
        }

        // --- PUNTO DONDE DEBE OCURRIR LA MAGIA DE CONVERSIÓN ---
        
        // Si tienes la librería de conversión (como MusicXML u otra) cargada,
        // la función para convertir el archivo a código ABC debe ir aquí.
        
        // Si el archivo es MusicXML, la lógica podría ser:
        // if (file.name.endsWith('.xml') || file.name.endsWith('.mxl')) {
        //    // CÓDIGO QUE LEE EL XML y lo transforma en ABC
        //    // abcTextarea.value = resultadoABC;
        //    // renderMusic();
        // } else if (file.name.endsWith('.mp3')) {
        //    // CÓDIGO COMPLEJO PARA TRANSCRIBIR EL AUDIO A ABC
        //    // ...
        // }

        // Si la conversión falla o la lógica está incompleta, el botón no funcionará.
        alert("Intentando conversión de " + file.name + ". Revisa la Consola (F12) por si hay errores de la librería de conversión.");
        
        // Ejecutamos renderMusic por si se actualizó el área de texto con código ABC
        renderMusic(); 
    });


    // ------------------------------------------------------------------
    // C. Lógica para la Descarga del PDF (Funciona)
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
