window.onload = () => {
    const inputPDF = document.getElementById("inputPDF");
    const nombreArchivoSpan = document.getElementById("nombreArchivo");
    const tamanioArchivoSpan = document.getElementById("tamanoArchivo");
    const fechaIngresoSpan = document.getElementById("fechaIngreso");
    const btnSubir = document.getElementById("btnSubir");
    const txtConfirmAlert = document.getElementById("txtConfirmAlert");
  
    let archivoSeleccionado = null;
  
    inputPDF.addEventListener("change", function () {
      const archivo = inputPDF.files[0];
  
      if (archivo && archivo.type === "application/pdf") {
        archivoSeleccionado = archivo;
  
        nombreArchivoSpan.textContent = archivo.name;
        tamanioArchivoSpan.textContent = `${(archivo.size / 1024).toFixed(2)} KB`;
        const fecha = new Date();
        fechaIngresoSpan.textContent = fecha.toLocaleString();
      } else {
        alert("Por favor, selecciona un archivo PDF válido.");
        inputPDF.value = "";
        archivoSeleccionado = null;
        nombreArchivoSpan.textContent = "--";
        tamanioArchivoSpan.textContent = "--";
        fechaIngresoSpan.textContent = "--";
      }
    });
  
    btnSubir.onclick = function () {
      alert("Intentando subir archivo...");
      txtConfirmAlert.textContent = "";
    
      if (!archivoSeleccionado) {
          txtConfirmAlert.textContent = "Por favor, selecciona un archivo PDF antes de subir.";
          return;
      }
  
      const tamanioEnKB = (archivoSeleccionado.size / 1024).toFixed(2); // Tamaño en KB, como número (sin "KB")
      
      const formData = new FormData();
      formData.append("nombre", archivoSeleccionado.name);  // Nombre del archivo
      formData.append("tamanio", tamanioEnKB);  // Tamaño como número (en kilobytes)
      formData.append("fechaIngreso", new Date().toISOString().split("T")[0]);  // Fecha en formato YYYY-MM-DD
      formData.append("contenido", archivoSeleccionado);  // El archivo binario
      
      for (let pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
      }
  
      fetch("https://scitrackapi-production.up.railway.app/api/archivos/", {
          method: "POST",
          body: formData,
      })
      .then((response) => {
          if (!response.ok) throw new Error("Error en la respuesta de la API");
          return response.json();
      })
      .then((data) => {
          alert("Archivo y datos enviados correctamente.");
          console.log("Respuesta de la API:", data);
          window.location.reload();
      })
      .catch((error) => {
          console.error("Error al enviar a la API:", error);
          txtConfirmAlert.textContent = "Hubo un error al subir el archivo.";
      });
  };
  
};
