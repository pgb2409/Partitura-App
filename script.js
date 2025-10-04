// --- Función convertToMusicXml COMPLETA y CORREGIDA ---

async function convertToMusicXml() {
    convertButton.disabled = true;
    convertButton.textContent = 'Convirtiendo...';
    visorCanvas.innerHTML = '<p>Enviando archivo al backend y esperando análisis...</p>';

    const formData = new FormData();
    // AQUI ES DONDE SE DEFINE LA CLAVE QUE EL BACKEND ESPERA
    // ¡Debe ser 'mp3File'!
    formData.append('mp3File', selectedFile); 

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData,
        });

        // Este bloque maneja si el backend devuelve 4xx o 5xx
        if (!response.ok) {
            // Lee el mensaje de error del backend (si existe)
            let errorMessage = await response.text();
            throw new Error(`Error HTTP: ${response.status}. Mensaje del servidor: ${errorMessage.substring(0, 100)}...`);
        }

        // El backend responde con el contenido del archivo .musicxml como texto
        const xmlText = await response.text();
        
        // Renderizado del XML (OSMD)
        renderMusicXml(xmlText);

    } catch (error) {
        visorCanvas.innerHTML = `<p style="color: red;">Error en la conversión o comunicación: ${error.message}</p>`;
        console.error("Error en la conversión:", error);
    } finally {
        convertButton.disabled = false;
        convertButton.textContent = 'Convertir a Partitura';
    }
}
// --- FIN de la función ---
