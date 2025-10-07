// **CORRECCIÓN CLAVE:** La variable para el visor (OSMD) debe ser global.
let openSheetMusicDisplay; 


// **********************************************
// 1. FUNCIÓN loadScore() - PUESTA EN EL ÁMBITO GLOBAL
// El botón la encuentra y la ejecuta al hacer clic.
// **********************************************
function loadScore() {
    console.log("loadScore() ejecutada por el clic.");

    // Define la ruta del archivo MusicXML de prueba
    // Verifica que 'partituras/sample.musicxml' exista
    const scorePath = "partituras/sample.musicxml"; 
    
    if (!openSheetMusicDisplay) {
        console.error("Error: OSMD aún no está listo. La página no ha cargado completamente.");
        return;
    }

    // Carga la partitura
    openSheetMusicDisplay.load(scorePath).then(
        () => {
            console.log("Partitura cargada y renderizada exitosamente:", scorePath);
            openSheetMusicDisplay.render(); 
        },
        (error) => {
            console.error("Error al cargar la partitura:", error);
        }
    );
}


// **********************************************
// 2. FUNCIÓN window.onload - SE EJECUTA UNA VEZ AL CARGAR LA PÁGINA
// Solo se encarga de inicializar la librería OSMD.
// **********************************************
window.onload = function() {
    console.log("window.onload ejecutado. Iniciando OSMD.");
    
    try {
        // Inicializa OSMD en el contenedor 'osmdCanvas'
        openSheetMusicDisplay = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas", {
            // Opciones de configuración recomendadas
            backend: "svg", 
            drawingParameters: "compact", 
            drawTitle: true,
        });
        
        console.log("Visor de partituras (OSMD) listo.");
        
    } catch (e) {
        console.error("Fallo al inicializar OpenSheetMusicDisplay. ¿Está bien la ruta de la librería en el index.html?", e);
    }
};
