// CÓDIGO JAVASCRIPT COMPLETO CON LA FUNCIÓN DE DIBUJO DE PARTITURA
document.addEventListener('DOMContentLoaded', () => {
    
    // --- FUNCIÓN PRINCIPAL DE DIBUJO DE PARTITURA ---
    function dibujarPartituraDePrueba(contenedorId) {
        
        // 1. Limpiar el área donde estaba el mensaje de "cargando"
        const div = document.getElementById(contenedorId);
        div.innerHTML = ''; 
        
        // 2. Definir las herramientas de VexFlow
        // Usamos el objeto global Vex que se cargó desde el HTML
        const { Renderer, Stave, Clef, StaveNote, Voice, Formatter } = Vex.Flow;
        
        // 3. Crear el lienzo de dibujo (en formato SVG)
        const renderer = new Renderer(div, Renderer.Backends.SVG);
        renderer.resize(500, 200); // Define el tamaño del área de dibujo
        const context = renderer.getContext();
        context.setFont('Arial', 10);

        // 4. Crear el pentagrama (Stave)
        const stave = new Stave(10, 0, 480); // Posición inicial y ancho
        stave.addClef('percussion').addTimeSignature('4/4'); // ¡Esto lo define como pentagrama de percusión!
        stave.setContext(context).draw();

        // 5. Definir las notas (4 Negras: Kick, Snare, Kick, Snare)
        const notes = [
            // Nota 1 (Negra): Bombo (Kick) en F4
            new StaveNote({ keys: ['f/4'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Kick")),
            // Nota 2 (Negra): Caja (Snare) en C5
            new StaveNote({ keys: ['c/5'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Snare")),
            // Nota 3 (Negra): Bombo (Kick)
            new StaveNote({ keys: ['f/4'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Kick")),
            // Nota 4 (Negra): Caja (Snare)
            new StaveNote({ keys: ['c/5'], duration: 'q', clef: 'percussion' }).addAnnotation(0, new Vex.Flow.Annotation("Snare")),
        ];

        // 6. Crear la voz (agrupación de notas)
        const voice = new Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes);
        
        // 7. Formatear y dibujar la partitura
        new Formatter().joinVoices([voice]).format([voice], 450);
        voice.draw(context, stave);
        
        // Mensaje de éxito debajo del dibujo
        div.innerHTML += '<p class="mt-3 text-success text-center">✅ ¡Partitura de prueba dibujada con éxito!</p>';
    }
    // --- FIN DE LA FUNCIÓN DE DIBUJO ---


    // 8. Lógica de la aplicación (Botón y Archivo)
    const botonConvertir = document.getElementById('convertirButton'); 
    const inputArchivo = document.getElementById('mp3File'); 
    const areaPartitura = document.getElementById('partituraGenerada'); 
    const displayNombreArchivo = document.getElementById('fileNameDisplay');

    // Lógica para actualizar el nombre del archivo
    if (inputArchivo && displayNombreArchivo) {
        inputArchivo.addEventListener('change', () => {
            if (inputArchivo.files.length > 0) {
                displayNombreArchivo.innerHTML = `Archivo seleccionado: <strong>${inputArchivo.files[0].name}</strong>`;
            } else {
                displayNombreArchivo.innerHTML = 'Esperando archivo...';
            }
        });
    }

    // Lógica para el botón de "Convertir"
    if (botonConvertir && inputArchivo && areaPartitura) {
        
        botonConvertir.addEventListener('click', (e) => {
            e.preventDefault(); 

            if (!inputArchivo.files[0]) {
                areaPartitura.innerHTML = '⚠️ **ERROR:** Primero debes seleccionar un archivo MP3.';
                return; 
            }
            
            // Inicio de Conversión
            areaPartitura.innerHTML = '🎵 **Convirtiendo...** Generando partitura en 4 segundos...';
            
            // SIMULACIÓN DE PROCESO
            setTimeout(() => {
                
                // *** ¡ACCIÓN FINAL! Llamar a la función que dibuja la partitura ***
                dibujarPartituraDePrueba('partituraGenerada');

            }, 4000); // 4 segundos de espera simulada
        });
    }
});
