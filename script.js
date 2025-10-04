// CÓDIGO JAVASCRIPT COMPLETO CON DESCARGA DE PDF
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Encontrar los elementos clave de la página
    const botonConvertir = document.getElementById('convertirButton'); 
    const inputArchivo = document.getElementById('mp3File'); 
    const areaPartitura = document.getElementById('partituraGenerada'); 
    const displayNombreArchivo = document.getElementById('fileNameDisplay');
    const descargarPDFButton = document.getElementById('descargarPDFButton'); // ¡Nuevo!

    // --- FUNCIÓN DE DIBUJO DE PARTITURA (MISMA QUE ANTES) ---
    function dibujarPartituraDePrueba(contenedorId) {
        // ... (código VexFlow para dibujar la partitura) ...

        const div = document.getElementById(contenedorId);
        div.innerHTML = ''; 
        const { Renderer, Stave, Clef, StaveNote, Voice, Formatter } = Vex.Flow;
        const renderer = new Renderer(div, Renderer.Backends.SVG);
        renderer.resize(500, 200); 
        const context = renderer.getContext();
        context.setFont('Arial', 10);

        const stave = new Stave(10, 0, 480); 
        stave.addClef('percussion').addTimeSignature('4/4'); 
        stave.setContext(context).draw();

        const notes = [
            new StaveNote({ keys: ['f/4'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Kick")),
            new StaveNote({ keys: ['c/5'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Snare")),
            new StaveNote({ keys: ['f/4'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Kick")),
            new StaveNote({ keys: ['c/5'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Snare")),
        ];

        const voice = new Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes);
        new Formatter().joinVoices([voice]).format([voice], 450);
        voice.draw(context, stave);
        
        div.innerHTML += '<p class="mt-3 text-success text-center">✅ ¡Partitura de prueba dibujada con éxito!</p>';
    }
    // ----------------------------------------------------


    // --- NUEVA FUNCIÓN: DESCARGAR PDF ---
    function descargarPartituraPDF() {
        // 1. Ocultar el botón temporalmente para que NO salga en la captura del PDF
        descargarPDFButton.style.display = 'none';

        // 2. Localizar el área que queremos capturar
        const partituraElement = document.getElementById('partituraGenerada');

        // 3. Capturar el DIV con la partitura usando html2canvas
        html2canvas(partituraElement, { 
            scale: 2, // Aumenta la resolución para mejor calidad en PDF
            backgroundColor: '#ffffff' // Fondo blanco para el PDF
        }).then(canvas => {
            // 4. Crear el objeto jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            
            // 5. Convertir la captura (canvas) a una imagen base64
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // Ancho A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // 6. Añadir la imagen al documento PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // 7. Descargar el archivo
            pdf.save('partitura_bateria_transcrita.pdf');
            
            // 8. Volver a mostrar el botón
            descargarPDFButton.style.display = 'block'; 
        });
    }
    // ----------------------------------------------------


    // 9. Lógica de la aplicación (Botón y Archivo)
    
    // Lógica para actualizar el nombre del archivo
    if (inputArchivo && displayNombreArchivo) {
        inputArchivo.addEventListener('change', () => {
            if (inputArchivo.files.length > 0) {
                displayNombreArchivo.innerHTML = `Archivo seleccionado: <strong>${inputArchivo.files[0].name}</strong>`;
            } else {
                displayNombreArchivo.innerHTML = 'Esperando archivo...';
            }
            // Ocultar el botón de descarga si se selecciona un nuevo archivo
            descargarPDFButton.style.display = 'none'; 
        });
    }

    // AÑADIR LA FUNCIÓN DE DESCARGA AL NUEVO BOTÓN
    if (descargarPDFButton) {
        descargarPDFButton.addEventListener('click', descargarPartituraPDF);
    }


    // Lógica para el botón de "Convertir"
    if (botonConvertir && inputArchivo && areaPartitura) {
        
        botonConvertir.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            if (!inputArchivo.files[0]) {
                areaPartitura.innerHTML = '⚠️ **ERROR:** Primero debes seleccionar un archivo MP3.';
                return; 
            }
            
            // Ocultar el botón de PDF mientras se convierte
            descargarPDFButton.style.display = 'none'; 
            
            // Inicio de Conversión
            areaPartitura.innerHTML = '🎵 **Convirtiendo...** Generando partitura en 4 segundos...';
            
            // SIMULACIÓN DE PROCESO
            setTimeout(() => {
                
                // 1. Dibujar la partitura
                dibujarPartituraDePrueba('partituraGenerada');

                // 2. Mostrar el botón de PDF para descargar
                descargarPDFButton.style.display = 'block'; 

            }, 4000); // 4 segundos de espera simulada
        });
    }
});
