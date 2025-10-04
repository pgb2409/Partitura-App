// CÓDIGO JAVASCRIPT COMPLETO Y ACTUALIZADO
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Encontrar los elementos clave de la página usando sus IDs
    const botonConvertir = document.getElementById('convertirButton'); 
    const inputArchivo = document.getElementById('mp3File'); 
    const areaPartitura = document.getElementById('partituraGenerada'); 
    const displayNombreArchivo = document.getElementById('fileNameDisplay'); // <-- Nuevo elemento añadido

    // 2. Lógica para actualizar el nombre del archivo (Paso 1 del usuario)
    if (inputArchivo && displayNombreArchivo) {
        // Ejecuta esta función CADA VEZ que el usuario selecciona un archivo diferente
        inputArchivo.addEventListener('change', () => {
            if (inputArchivo.files.length > 0) {
                // Muestra el nombre del archivo seleccionado
                displayNombreArchivo.innerHTML = `Archivo seleccionado: <strong>${inputArchivo.files[0].name}</strong>`;
            } else {
                displayNombreArchivo.innerHTML = 'Esperando archivo...';
            }
        });
    }

    // 3. Lógica para el botón de "Convertir a Partitura" (Simulación)
    if (botonConvertir && inputArchivo && areaPartitura) {
        
        botonConvertir.addEventListener('click', (e) => {
            // Evita que la página se recargue
            e.preventDefault(); 

            const archivo = inputArchivo.files[0];

            // A) VALIDACIÓN: Comprobar si hay un archivo seleccionado
            if (!archivo) {
                areaPartitura.innerHTML = '⚠️ **ERROR:** Primero debes seleccionar un archivo MP3.';
                return; 
            }
            
            // B) INICIO DE CONVERSIÓN: Mostrar un mensaje de "cargando"
            areaPartitura.innerHTML = '🎵 **Convirtiendo...** Esto simulará un proceso de 4 segundos. Por favor, espera...';
            
            // C) SIMULACIÓN DE PROCESO (El proceso real iría en un servidor)
            setTimeout(() => {
                
                // D) FIN DE CONVERSIÓN: Mostrar el resultado simulado
                areaPartitura.innerHTML = `
                    ✅ **¡Partitura Generada con Éxito!** (Resultado de Prueba)
                    <hr>
                    <p>El archivo <strong>${archivo.name}</strong> ha sido procesado con éxito en la simulación.</p>
                    
                    <div style="font-size: 1.2em; border: 1px dashed #007bff; padding: 15px; margin-top: 20px; background-color: #e9f5ff;">
                        <strong>¡Éxito!</strong> La conexión entre el botón, el archivo y la sección de resultados ¡está funcionando!
                    </div>
                `;

            }, 4000); // 4 segundos de espera simulada
        });
    } else {
         // Mensaje para el desarrollador si algo falta en el HTML
         console.error("Verifica el HTML: Faltan IDs clave para la aplicación.");
    }
});
