window.onload = () => {
  const inputPDF = document.getElementById("inputPDF");
  const cuerpoTablaArchivos = document.getElementById("cuerpoTablaArchivos");
  const btnSubir = document.getElementById("btnSubir");
  const txtConfirmAlert = document.getElementById("txtConfirmAlert");

  let archivosSeleccionados = [];

  function actualizarTabla() {
    cuerpoTablaArchivos.innerHTML = "";

    if (archivosSeleccionados.length === 0) {
      cuerpoTablaArchivos.innerHTML = '<tr><td colspan="5">No se han seleccionado archivos.</td></tr>';
      return;
    }

    archivosSeleccionados.forEach((archivo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${archivo.name}</td>
        <td>${(archivo.size / 1024).toFixed(2)} KB</td>
        <td>${archivo.fechaIngreso}</td>
        <td><button data-index="${index}" class="btnEliminar">Eliminar</button></td>
      `;
      cuerpoTablaArchivos.appendChild(fila);
    });

    // Asignar evento a cada botón de eliminar
    const botonesEliminar = document.querySelectorAll(".btnEliminar");
    botonesEliminar.forEach((boton) => {
      boton.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        archivosSeleccionados.splice(index, 1);
        actualizarTabla();
      });
    });
  }

  inputPDF.addEventListener("change", function () {
    const nuevosArchivos = Array.from(inputPDF.files);

    nuevosArchivos.forEach((archivo) => {
      if (archivo.type !== "application/pdf") {
        alert(`"${archivo.name}" no es un archivo PDF.`);
        return;
      }

      const yaExiste = archivosSeleccionados.some((a) => a.name === archivo.name);
      if (yaExiste) {
        alert(`"${archivo.name}" ya fue agregado.`);
        return;
      }

      archivosSeleccionados.push({
        archivo,
        name: archivo.name,
        size: archivo.size,
        fechaIngreso: new Date().toLocaleString()
      });
    });

    inputPDF.value = ""; // Limpiar para permitir volver a seleccionar
    actualizarTabla();
  });

  btnSubir.onclick = async function () {
    txtConfirmAlert.textContent = "";

    if (archivosSeleccionados.length === 0) {
      txtConfirmAlert.textContent = "Por favor, adjunta al menos un archivo PDF.";
      return;
    }

    for (const item of archivosSeleccionados) {
      const archivo = item.archivo;
      const tamanioEnKB = (archivo.size / 1024).toFixed(2);
      const formData = new FormData();

      formData.append("nombre", archivo.name);
      formData.append("tamanio", tamanioEnKB);
      formData.append("fechaIngreso", new Date().toISOString().split("T")[0]);
      formData.append("contenido", archivo);

      try {
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/archivos/", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Error al subir: ${archivo.name}`);
        const data = await response.json();
        console.log("Archivo subido:", data);
      } catch (error) {
        console.error("Error:", error);
        txtConfirmAlert.textContent = `Error al subir: ${archivo.name}`;
        return;
      }
    }

    alert("Todos los archivos se han subido correctamente.");
    window.location.reload();
  };
};
