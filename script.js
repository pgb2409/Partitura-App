const canvas = document.getElementById("visorCanvas");
const ctx = canvas.getContext("2d");

let archivoMP3 = null;

function cargarPartituraDesdeURL(url) {
  fetch(url)
    .then((res) => res.text())
    .then((xml) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "16px Arial";
      ctx.fillText("Partitura cargada correctamente", 20, 40);
    });
}

document.getElementById("musicxmlInput").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  cargarPartituraDesdeURL(url);
};

document.getElementById("mp3Input").onchange = (e) => {
  archivoMP3 = e.target.files[0];
};

document.getElementById("convertirBtn").onclick = async () => {
  if (!archivoMP3) {
    alert("Primero selecciona un archivo MP3");
    return;
  }

  const formData = new FormData();
  formData.append("archivo", archivoMP3);

  try {
    const res = await fetch("https://backend-conversor.onrender.com/convertir", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    cargarPartituraDesdeURL(url);
  } catch (err) {
    alert("Error al convertir el archivo MP3:\n" + err.message);
    console.error("Error completo:", err);
  }
};
