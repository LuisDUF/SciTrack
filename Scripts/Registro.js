window.onload = function () {
  
  const idDinamica = 4; //Este es el parametro a cambiar en base al inicio de sesion

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
  let proyectosCargados = [];

  obtener_investigadores()
  obtener_categorias()
  obtener_participantes()
  obtener_fases()
  obtener_equipos()
  obtener_proyectos()
  
  


  //listar_proyectos()
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
                idEquipo_Correspondiente: participante.Equipo_idEquipo
                
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

        // Limpiar el select
        const combo = document.getElementById("comboCategorias");
        combo.innerHTML = ""; // Eliminar opciones anteriores

        // Agregar una opción vacía para el placeholder
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = "Seleccione una categoría";
        combo.appendChild(placeholderOption);

        // Llenar el arreglo y el combo
        data.forEach(categoria => {
            const nuevaCategoria = {
                idCategoria: categoria.idCategoria,
                nombre: categoria.nombre,
                descripcion: categoria.descripcion
            };

            categoriasCargadas.push(nuevaCategoria);

            const opcion = document.createElement("option");
            opcion.value = nuevaCategoria.idCategoria;
            opcion.textContent = nuevaCategoria.nombre;
            combo.appendChild(opcion);
        });

        // Inicializar Select2 después de agregar opciones
        $('#comboCategorias').select2({
            placeholder: "Buscar categoría...",
            allowClear: true
        });

        console.log("Categorías cargadas en el arreglo:", categoriasCargadas);
    })
    .catch((error) => console.error("Error al cargar las categorías:", error));
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
        // Limpiar el arreglo
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
function obtener_convocatorias(){
    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_proyectos() {
    fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Obtener el ID de la categoría seleccionada
        

        // Limpiar el arreglo y la tabla
        proyectosCargados = [];
        const cuerpoTabla = document.querySelector("#tabla-proyectos tbody");
        cuerpoTabla.innerHTML = "";

        data.forEach(proyecto => {
            // Solo incluir si cumple con la condición
            if (proyecto.Categoria_idCategoria == idCategoriaSeleccionada) {
                const nuevoProyecto = {
                    idProyecto: proyecto.idProyecto,
                    nombre: proyecto.nombre,
                    fechaRegistro: proyecto.fechaRegistro,
                    promedio: proyecto.promedio,
                    Equipo_idEquipo: proyecto.Equipo_idEquipo,
                    Categoria_idCategoria: proyecto.Categoria_idCategoria,
                    Investigador_idInvestigador: proyecto.Investigador_idInvestigador,
                    Archivos_idArchivos: proyecto.Archivos_idArchivos,
                    Fase_IdFase: proyecto.Fase_idFase,
                    EstadosProyecto_idEstadosProyecto: proyecto.EstadosProyecto_idEstadosProyecto,
                    Calificacion_idCalificacion: proyecto.Calificacion_idCalificacion
                };
                proyectosCargados.push(nuevoProyecto);

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${nuevoProyecto.idProyecto}</td>
                    <td>${nuevoProyecto.nombre}</td>
                    <td>${nuevoProyecto.fechaRegistro}</td>
                    <td>${nuevoProyecto.promedio}</td>
                    <td>${asignacion_Equipo(nuevoProyecto.Equipo_idEquipo)}</td>
                    <td>${asignacion_categoria(nuevoProyecto.Categoria_idCategoria)}</td>
                    <td>${asignacion_investigador(nuevoProyecto.Investigador_idInvestigador)}</td>
                    <td>${nuevoProyecto.Archivos_idArchivos}</td>
                    <td>${asignacion_fase(nuevoProyecto.Fase_IdFase)}</td>
                    <td>${asignacion_estado(nuevoProyecto.EstadosProyecto_idEstadosProyecto)}</td>
                    <td>${nuevoProyecto.Calificacion_idCalificacion}</td>
                `;
                cuerpoTabla.appendChild(fila);
            }
        });

        console.log("Proyectos cargados en el arreglo:", proyectosCargados);
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
              EstadosProyecto_idEstadosProyecto: 1,
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

