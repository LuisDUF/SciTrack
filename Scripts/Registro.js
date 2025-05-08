window.onload = function () {
  const inputNombre = document.getElementById("inputNombre");
  const inputPromedio = document.getElementById("inputPromedio");
  const inputIdEquipo = document.getElementById("inputIdEquipo");
  const inputIdCategoria = document.getElementById("inputIdCategoria");
  const inputIdInvestigador = document.getElementById("inputIdInvestigador");
  const inputIdArchivo = document.getElementById("inputIdArchivo");
  const inputIdFase = document.getElementById("inputIdFase");
  const inputIdEstado = document.getElementById("inputIdEstado");
  const inputIdCalificacion = document.getElementById("inputIdCalificacion");
  const btnConfirm = document.getElementById("btnConfirm");
  

  btnConfirm.onclick = function () {
      let fecha = new Date();
      const anio = fecha.getDate();
      const mes = fecha.getMonth()+1;
      const dia = fecha.getFullYear();
      const inputFecha = `${anio}-${mes}-${dia}`;

      

      // Validar campos
      if (
          inputNombre.value === "" ||
          inputPromedio.value === "" ||
          anio === "" || mes === "" || dia === "" ||
          inputIdEquipo.value === "" ||
          inputIdCategoria.value === ""||
          inputIdInvestigador.value === ""||
          inputIdArchivo.value === ""||
          inputIdFase.value === ""||
          inputIdEstado.value === ""||
          inputIdCalificacion.value === ""
                ) {
          alert("Ingrese la información en todos los campos");
          return;
      }

      // Enviar datos
      fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              nombre: inputNombre.value,
              fechaRegistro: inputFecha,
              Equipo_idEquipo: inputIdEquipo,
              Categoria_idCategoria: inputIdCategoria,
              Ivestigador_idInvestigador: inputIdInvestigador,
              Archivos_idArchivos: inputIdArchivo,
              EstadosProyecto_idEstadosProyecto: inputIdEstado,
              Calificacion_idCalificacion: inputIdCalificacion
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