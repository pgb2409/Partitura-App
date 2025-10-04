// --- SECCIÓN DE GESTIÓN DE CARGA (Para HABILITAR el botón) ---

// Cuando se selecciona un archivo, actualiza el estado
fileInput.addEventListener('change', (event) => {
    // Si hay archivos seleccionados, toma el primero
    if (event.target.files.length > 0) {
        selectedFile = event.target.files[0];
        fileNameDisplay.textContent = `Archivo seleccionado: ${selectedFile.name}`;
        // LÍNEA CLAVE: HABILITAR el botón de conversión
        convertButton.disabled = false; 
    } else {
        selectedFile = null;
        fileNameDisplay.textContent = 'Esperando archivo...';
        convertButton.disabled = true;
    }
});


// --- SECCIÓN DE LÓGICA DE CONVERSIÓN (Para que el botón haga algo) ---

// LÍNEA CLAVE: Asignar el evento 'click' al botón de conversión
convertButton.addEventListener('click', () => {
    if (selectedFile) {
        // Llama a la función principal para enviar la petición
        convertToMusicXml(); 
    } else {
        alert("Por favor, selecciona un archivo MP3 primero.");
    }
});
