const canvas = document.getElementById("visorCanvas");
const ctx = canvas.getContext("2d");

function cargarPartituraDesdeXML(xmlText) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";

  if (xmlText.includes("<note>")) {
    ctx.fillText("🎶 Partitura detectada y cargada", 20, 40);
  } else {
    ctx.fillText("⚠️ El archivo MusicXML no contiene notas visibles", 20, 40);
  }
}

document.getElementById("convertirBtn").onclick = async () => {
  const file = document.getElementById("mp3Input").files[0];
  if (!file) {
    alert("Selecciona un archivo MP3 antes de convertir");
    return;
  }

  const formData = new FormData();
  formData.append("archivo", file);

  try {
    const res = await fetch("https://backend-conversor-51sa.onrender.com/convertir", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const xmlText = await res.text();
    cargarPartituraDesdeXML(xmlText);
  } catch (err) {
    alert("Error al convertir el archivo MP3:\n" + err.message);
    console.error("Error completo:", err);
  }
};
