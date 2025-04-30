window.onload = function () {
  const inputNombre = document.getElementById("inputNombre");
  const inputModalidad = document.getElementById("inputModalidad");
  const inputDescripcion = document.getElementById("inputDescripcion");
  const inputIdUbicacion = document.getElementById("inputIdUbicacion");
  const btnConfirm = document.getElementById("btnConfirm");
  const inputCalificacion = document.getElementById("inputCalificacion");

  btnConfirm.onclick = function () {
      const anioIn = document.getElementById('anioIn').value;
      const mesIn = document.getElementById('mesIn').value.padStart(2, '0');
      const diaIn = document.getElementById('diaIn').value.padStart(2, '0');
      const inputFechaInicio = `${anioIn}-${mesIn}-${diaIn}`;

      const anioFn = document.getElementById('anioFn').value;
      const mesFn = document.getElementById('mesFn').value.padStart(2, '0');
      const diaFn = document.getElementById('diaFn').value.padStart(2, '0');
      const inputFechaFin = `${anioFn}-${mesFn}-${diaFn}`;

      // Validar campos
      if (
          inputNombre.value === "" ||
          inputModalidad.value === "" ||
          anioIn === "" || mesIn === "" || diaIn === "" ||
          anioFn === "" || mesFn === "" || diaFn === "" ||
          inputDescripcion.value === ""      ) {
          alert("Ingrese la información en todos los campos");
          return;
      }

      // Enviar datos
      fetch("https://scitrackapi-production.up.railway.app/api/fase/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              nombre: inputNombre.value,
              modalidad: inputModalidad.value,
              fechaInicio: inputFechaInicio,
              fechaFin: inputFechaFin,
              descripcion: inputDescripcion.value,
              califcacion_minima: inputCalificacion.value,
              Ubicacion_idUbicacion: inputIdUbicacion.value
          }),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          alert('Se ha registrado la fase.');
          window.location.reload();
      })
      .catch((error) => console.error("Error:", error));
  };
};
