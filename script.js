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

document.getElementById("convertirBtn").onclick = () => {
  document.getElementById("mp3Input").click();
};

document.getElementById("mp3Input").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("archivo", file);

  try {
    const res = await fetch("https://backend-conversor.onrender.com/convertir", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error en la conversión");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    cargarPartituraDesdeURL(url);
  } catch (err) {
    alert("Hubo un problema al convertir el archivo.");
    console.error(err);
  }
};
