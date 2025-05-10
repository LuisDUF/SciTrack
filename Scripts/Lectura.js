window.onload=function(){
    listar_proyectos()

    const inputIdProyecto = document.getElementById("inputIdProyecto");
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

  let proyecto;

  btnConfirm.onclick = function () {
    const anio = document.getElementById('anio').value;
    const mes = document.getElementById('mes').value.padStart(2, '0');
    const dia = document.getElementById('dia').value.padStart(2, '0');
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
        inputIdCalificacion.value === "" ||
        inputIdProyecto.value === ""
              ) {
        alert("Ingrese la información en todos los campos");
        return;
    }

    // Enviar datos
    fetch("https://scitrackapi-production.up.railway.app/api/proyecto/"+inputIdProyecto.value, {
        method: "PUT",
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
}


function listar_proyectos() {
    fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const cuerpoTabla = document.querySelector("#tabla-proyectos tbody");
        cuerpoTabla.innerHTML = ""; // Limpiar contenido previo

        data.forEach(proyecto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proyecto.idProyecto}</td>
                <td>${proyecto.nombre}</td>
                <td>${proyecto.fechaRegistro}</td>
                <td>${proyecto.Equipo_idEquipo}</td>
                <td>${proyecto.Categoria_idCategoria}</td>
                <td>${proyecto.Investigador_idInvestigador}</td>
                <td>${proyecto.Archivos_idArchivos}</td>
                <td>${proyecto.Fase_idFase}</td>
                <td>${proyecto.EstadosProyecto_idEstadosProyecto}</td>
                <td>${proyecto.Calificacion_idCalificacion}</td>
                

            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Fases cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar los proyectos:", error));
}





