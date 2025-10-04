// CÓDIGO JAVASCRIPT COMPLETO CON LÓGICA REFORZADA
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Encontrar los elementos clave de la página
    const botonConvertir = document.getElementById('convertirButton'); 
    const inputArchivo = document.getElementById('mp3File'); 
    const areaPartitura = document.getElementById('partituraGenerada'); 
    const displayNombreArchivo = document.getElementById('fileNameDisplay');
    const descargarPDFButton = document.getElementById('descargarPDFButton'); 

    // --- FUNCIÓN DE DIBUJO DE PARTITURA ---
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


    // --- FUNCIÓN DE DESCARGA PDF ---
    function descargarPartituraPDF() {
        // Oculta el botón para que no salga en la captura del PDF
        descargarPDFButton.style.display = 'none';

        const partituraElement = document.getElementById('partituraGenerada');

        html2canvas(partituraElement, { 
            scale: 2, 
            backgroundColor: '#ffffff'
        }).then(canvas => {
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); 
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            pdf.save('partitura_bateria_transcrita.pdf');
            
            // Vuelve a mostrar el botón
            descargarPDFButton.style.display = 'block'; 
        });
    }
    // ----------------------------------------------------


    // 2. Lógica para actualizar el nombre del archivo
    if (inputArchivo && displayNombreArchivo) {
        inputArchivo.addEventListener('change', () => {
            if (inputArchivo.files.length > 0) {
                displayNombreArchivo.innerHTML = `Archivo seleccionado: <strong>${inputArchivo.files[0].name}</strong>`;
            } else {
                displayNombreArchivo.innerHTML = 'Esperando archivo...';
            }
            
            // LIMPIAR Y OCULTAR:
            areaPartitura.innerHTML = 'Carga un archivo y haz clic en convertir para ver la partitura.'; 
            // Esto asegura que si el botón estaba visible de una conversión anterior, se oculte:
            descargarPDFButton.style.display = 'none'; 
        });
    }

    // 3. Asigna la función de descarga al botón de PDF
    if (descargarPDFButton) {
        descargarPDFButton.addEventListener('click', descargarPartituraPDF);
    }


    // 4. Lógica para el botón de "Convertir"
    if (botonConvertir && inputArchivo && areaPartitura) {
        
        botonConvertir.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            if (!inputArchivo.files[0]) {
                areaPartitura.innerHTML = '⚠️ **ERROR:** Primero debes seleccionar un archivo MP3.';
                return; 
            }
            
            // Oculta el botón de PDF mientras se convierte
            descargarPDFButton.style.display = 'none'; 
            
            // SIMULACIÓN
            areaPartitura.innerHTML = '🎵 **Convirtiendo...** Generando partitura en 4 segundos...';
            
            setTimeout(() => {
                
                // 1. Dibuja la partitura
                dibujarPartituraDePrueba('partituraGenerada');

                // 2. Muestra el botón de PDF
                descargarPDFButton.style.display = 'block'; 

            }, 4000); // 4 segundos de espera simulada
        });
    }
});
