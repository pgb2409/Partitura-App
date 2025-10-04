// CÓDIGO DE PRUEBA: BORRA TODO LO ANTERIOR EN SCRIPT.JS Y PEGA ESTO

document.addEventListener('DOMContentLoaded', () => {
    
    // Intenta encontrar el botón de descarga
    const botonDePrueba = document.getElementById('descargarPDFButton');
    
    // Si el botón existe en la página, lo hacemos visible y cambiamos su texto
    if (botonDePrueba) {
        botonDePrueba.style.display = 'block'; 
        botonDePrueba.innerHTML = "✅ ¡BOTÓN DE PRUEBA ENCONTRADO!";
    } else {
        // Si no lo encuentra, mostrará un mensaje de error en el área de la partitura.
        const areaError = document.getElementById('partituraGenerada');
        if (areaError) {
             areaError.innerHTML = '❌ **ERROR CRÍTICO:** El JavaScript no puede encontrar el botón de PDF. Verifica el ID en el index.html.';
        }
    }
});
