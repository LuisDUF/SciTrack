window.onload = function () {
  
    const idDinamica = 2;

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

  const ESTADOS = [
    {numero: 1 ,estado:'Pendiente'},
    {numero: 2 ,estado:'Aceptado'},
    {numero: 3 ,estado:'Rechazado'},
    {numero: 4 ,estado:'Descalificado'},
    {numero: 5 ,estado:'Concluido'}
  
  ]

  let participantesCargados = [];
  let equiposCargados = [];
  let categoriasCargadas = [];
  let investigadoresCargados = [];
  let fasesCargadas = [];

  obtener_investigadores()
  obtener_categorias()
  obtener_participantes()
  obtener_fases()
  obtener_equipos()
  
  
  


  listar_proyectos()
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function obtener_participantes() {
    fetch("https://scitrackapi-production.up.railway.app/api/participante/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo previo
        participantesCargados = [];

        // Llenar el arreglo con los proyectos obtenidos
        data.forEach(participante => {
            participantesCargados.push({
                idParticipante: participante.idParticipante,
                nombre: participante.nombre,
                
            });
        });

        console.log("Participantes cargados en el arreglo:", participantesCargados);
    })
    .catch((error) => console.error("Error al cargar los equipos:", error));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function obtener_equipos() {
    fetch("https://scitrackapi-production.up.railway.app/api/equipo/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo previo
        equiposCargados = [];

        // Llenar el arreglo con los proyectos obtenidos
        data.forEach(equipo => {
            equiposCargados.push({
                idEquipo: equipo.idEquipo,
                liderIdLider: equipo.Participante_idLider,
                asesor: equipo.Asesor_idAsesor
            });
        });

        console.log("Equipos cargados en el arreglo:", equiposCargados);
    })
    .catch((error) => console.error("Error al cargar los equipos:", error));
}

function asignacion_Equipo(idABuscar) {
    for (let i = 0; i < equiposCargados.length; i++) {
        if (equiposCargados[i].idEquipo === idABuscar) {
            let nombre = reemplazo_equipo(equiposCargados[i].liderIdLider);
            return nombre;
        }
    }
    return "Equipo no encontrado";
}

function reemplazo_equipo(idABuscar){
    for (let i = 0; i < participantesCargados.length; i++) {
        if (participantesCargados[i].idParticipante === idABuscar) {
            return `${participantesCargados[i].nombre}`;
        }
    }
    return "Participate no encontrado";
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function asignacion_estado(idABuscar){
   for (let i = 0; i < ESTADOS.length; i++) {
        if (ESTADOS[i].numero === idABuscar) {
            
            return ESTADOS[i].estado;
        }
    }
    return "Estado no encontrado"; 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_categorias() {
    fetch("https://scitrackapi-production.up.railway.app/api/categoria/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo previo
        categoriasCargadas = [];

        // Llenar el arreglo con los proyectos obtenidos
        data.forEach(categoria => {
            categoriasCargadas.push({
                idCategoria: categoria.idCategoria,
                nombre: categoria.nombre,
                descripcion: categoria.descripcion
            });
        });

        console.log("Categorias cargadss en el arreglo:", categoriasCargadas);
    })
    .catch((error) => console.error("Error al cargar los equipos:", error));
}

function asignacion_categoria(idABuscar){
   for (let i = 0; i < categoriasCargadas.length; i++) {
        if (categoriasCargadas[i].idCategoria === idABuscar) {
            
            return categoriasCargadas[i].nombre;
        }
    }
    return "Categoria no encontrado"; 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_investigadores() {
    fetch("https://scitrackapi-production.up.railway.app/api/investigador/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo previo
        investigadoresCargados = [];

        // Llenar el arreglo con los proyectos obtenidos
        data.forEach(investigador => {
            investigadoresCargados.push({
                idInvestigador: investigador.idInvestigador,
                nombre: investigador.nombre,
            });
        });

        console.log("Investigadores cargados en el arreglo:", investigadoresCargados);
    })
    .catch((error) => console.error("Error al cargar los invetigadores:", error));
}

function asignacion_investigador(idABuscar){
   for (let i = 0; i < investigadoresCargados.length; i++) {
        if (investigadoresCargados[i].idInvestigador === idABuscar) {
            
            return investigadoresCargados[i].nombre;
        }
    }
    return "Investigador no encontrado"; 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_fases() {
    fetch("https://scitrackapi-production.up.railway.app/api/fase/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo previo
        fasesCargadas = [];

        data.forEach(fase => {
            fasesCargadas.push({
                idFase: fase.idFase,
                nombre: fase.nombre,
            });
        });

        console.log("Fases cargadas en el arreglo:", fasesCargadas);
    })
    .catch((error) => console.error("Error al cargar las fases:", error));
}

function asignacion_fase(idABuscar){
   for (let i = 0; i < fasesCargadas.length; i++) {
        if (fasesCargadas[i].idFase === idABuscar) {
            
            return fasesCargadas[i].nombre;
        }
    }
    return "Fase no encontrada"; 
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                <td>${proyecto.promedio}</td>
                <td>${asignacion_Equipo(proyecto.Equipo_idEquipo)}</td>
                <td>${asignacion_categoria(proyecto.Categoria_idCategoria)}</td>
                <td>${asignacion_investigador(proyecto.Investigador_idInvestigador)}</td>
                <td>${proyecto.Archivos_idArchivos}</td>
                <td>${asignacion_fase(proyecto.Fase_idFase)}</td>
                <td>${asignacion_estado(proyecto.EstadosProyecto_idEstadosProyecto)}</td>
                <td>${proyecto.Calificacion_idCalificacion}</td>
                

            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Proyectos cargados:", data);
    })
    .catch((error) => console.error("Error al cargar los proyectos:", error));
}






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

