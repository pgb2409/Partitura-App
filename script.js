const canvas = document.getElementById("visorCanvas");
const ctx = canvas.getContext("2d");

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

document.getElementById("convertirBtn").onclick = async () => {
  const file = document.getElementById("mp3Input").files[0];
  if (!file) {
    alert("No se ha seleccionado ningún archivo MP3");
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

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    cargarPartituraDesdeURL(url);
  } catch (err) {
    alert("Error al convertir el archivo MP3:\n" + err.message);
    console.error("Error completo:", err);
  }
};
