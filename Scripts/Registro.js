window.onload = async function () {
  
  const idDinamica = 3; //Este es el parametro a cambiar en base al inicio de sesion
  const idDinamicaEquipos = 4; //Esta es la idEquipo del Usuario

  const inputNombre = document.getElementById("inputNombre");
  
  const selectEquipos = document.getElementById("comboEquipos");
  const selectCategorias = document.getElementById("comboCategorias");
  const selectConvocatorias = document.getElementById("comboConvocatorias");
  const inputArchivo = document.getElementById("inputPDF");

  const btnConfirm = document.getElementById("btnConfirm");

  const ESTADOS = [
    {numero: 1 ,estado:'Pendiente'},
    {numero: 2 ,estado:'Aceptado'},
    {numero: 3 ,estado:'Rechazado'},
    {numero: 4 ,estado:'Descalificado'},
    {numero: 5 ,estado:'Concluido'}
  
  ]

  let idsCargados = [];
  let convocatoriasCargadas = [];
  let itemsCargados = [];
  let participantesCargados = [];
  let equiposCargados = [];
  let categoriasCargadas = [];
  let investigadoresCargados = [];
  let fasesCargadas = [];
  let proyectosCargados = [];

  await obtenerIdArchivo()
  await obtener_convocatorias()
  await obtener_items()
  await obtener_investigadores()
  await obtener_categorias()
  await obtener_participantes()
  await obtener_fases()
  await obtener_equipos()
  await cargar_proyectos()

  
  setTimeout(mostrar_proyectos_filtrados(),2000)
  


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
        // Limpiar el arreglo y el combo
        equiposCargados = [];

        const combo = document.getElementById("comboEquipos");
        combo.innerHTML = "";

        // Opción por defecto
        const opcionDefault = document.createElement("option");
        opcionDefault.text = "Seleccione un equipo";
        opcionDefault.disabled = true;
        opcionDefault.selected = true;
        combo.appendChild(opcionDefault);

        // Filtrar y cargar solo el equipo que coincide con idDinamica
        data.forEach(equipo => {
            if (equipo.idEquipo === idDinamicaEquipos) {
                const obj = {
                    idEquipo: equipo.idEquipo,
                    liderIdLider: equipo.Participante_idLider,
                    asesor: equipo.Asesor_idAsesor
                };
                equiposCargados.push(obj);

                const opcion = document.createElement("option");
                opcion.value = obj.idEquipo;
                opcion.text = `Equipo ${obj.idEquipo}`;
                combo.appendChild(opcion);
            }
        });

        // Inicializar Select2
        $('#comboEquipos').select2({
            placeholder: "Seleccione un equipo"
        });

        console.log("Equipos filtrados y cargados:", equiposCargados);
    })
    .catch((error) => console.error("Error al cargar los equipos:", error));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
function obtener_items(){
    fetch("http://localhost:3000/api/itemconvocatoria_fase/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo
        itemsCargados = [];

        data.forEach(itemConvocatoria_Fase => {
            itemsCargados.push({
                idConvocatoria: itemConvocatoria_Fase.Convocatoria_idConvocatoria,
                idFase: itemConvocatoria_Fase.Fase_idFase,
            });
        });

        console.log("Items cargados en el arreglo:", itemsCargados);
    })
    .catch((error) => console.error("Error al cargar los items:", error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_convocatorias() {
    fetch("http://localhost:3000/api/convocatoria/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo y el combo
        convocatoriasCargadas = [];

        const combo = document.getElementById("comboConvocatorias");
        combo.innerHTML = ""; // Limpiar opciones previas

        // Agregar opción por defecto
        const opcionDefault = document.createElement("option");
        opcionDefault.text = "Seleccione la convocatoria";
        opcionDefault.disabled = true;
        opcionDefault.selected = true;
        combo.appendChild(opcionDefault);

        // Llenar arreglo y opciones del select
        data.forEach(convocatoria => {
            const obj = {
                idConvocatoria: convocatoria.idConvocatoria,
                nombre: convocatoria.nombre,
                estado: convocatoria.estado,
            };
            convocatoriasCargadas.push(obj);

            const opcion = document.createElement("option");
            opcion.value = obj.idConvocatoria;
            opcion.text = obj.nombre;
            combo.appendChild(opcion);
        });

        // Reinicializar Select2
        $('#comboConvocatorias').select2({
            placeholder: "Seleccione una convocatoria"
            
        });

        console.log("Convocatorias cargadas en el arreglo:", convocatoriasCargadas);
    })
    .catch((error) => console.error("Error al cargar los items:", error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cargar_proyectos() {
    fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        proyectosCargados = data.map(proyecto => ({
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
        }));

        console.log("Proyectos cargados desde la API:", proyectosCargados);
    })
    .catch((error) => console.error("Error al cargar los proyectos:", error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtenerIdArchivo(){
    fetch("http://localhost:3000/api/archivos/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        // Limpiar el arreglo
        idsCargados = [];

        data.forEach(archivos => {
            idsCargados.push({
                idArchivo: archivos.idArchivos,
                
            });
        });

        console.log("IdsItems cargados en el arreglo:", idsCargados);
    })
    .catch((error) => console.error("Error al cargar los items:", error));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function obtener_Fase(idABuscar){
    for(i=0;i<itemsCargados.length;i++){
        if(idABuscar===itemsCargados[i].idConvocatoria){
            return itemsCargados[i].idFase
        }
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrar_proyectos_filtrados() {
    const cuerpoTabla = document.querySelector("#tabla-proyectos tbody");
    cuerpoTabla.innerHTML = "";

    const proyectosFiltrados = proyectosCargados.filter(p => 
        p.Equipo_idEquipo == idDinamicaEquipos
    );

    proyectosFiltrados.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.idProyecto}</td>
            <td>${p.nombre}</td>
            <td>${p.fechaRegistro}</td>
            <td>${p.promedio}</td>
            <td>${asignacion_Equipo(p.Equipo_idEquipo)}</td>
            <td>${asignacion_categoria(p.Categoria_idCategoria)}</td>
            <td>${asignacion_investigador(p.Investigador_idInvestigador)}</td>
            <td>${p.Archivos_idArchivos}</td>
            <td>${asignacion_fase(p.Fase_IdFase)}</td>
            <td>${asignacion_estado(p.EstadosProyecto_idEstadosProyecto)}</td>
            <td>${p.Calificacion_idCalificacion}</td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    console.log("Proyectos filtrados por idDinamica:", idDinamica, proyectosFiltrados);
}
//Pendiente//




  btnConfirm.onclick = async function () {
      let fecha = new Date();
      const anio = fecha.getDate();
      const mes = fecha.getMonth()+1;
      const dia = fecha.getFullYear();
      const inputFecha = `${dia}-${mes}-${anio}`;

      

      // Validar campos
      if (
          inputNombre.value === "" ||//Se captura
          anio === "" || mes === "" || dia === "" ||//Se genera solo
          selectEquipos.value === "" ||//Se escoge del idDinamicaEquipo
          selectCategorias.value === ""||//Se escoge de combobox
          selectConvocatorias.value === ""||//Se escoge de combobox
          inputArchivo.files.length === 0
                ) {
          alert("Ingrese la información en todos los campos");
          return;
      }
      //enviar archivo
  const archivo = inputArchivo.files[0]; // solo un archivo

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

    alert("El archivo se ha subido correctamente.");
    window.location.reload();
  } catch (error) {
    console.error("Error:", error);
    txtConfirmAlert.textContent = `Error al subir: ${archivo.name}`;
  }


      // Enviar datos
      fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              nombre: inputNombre.value, // Capturado por el usuario //
              fechaRegistro: inputFecha, // Se captura automaticamente //
              promedio: 0,
              Equipo_idEquipo: selectEquipos.value, // Se obtiene de la comboBox del equipo en el que este y escoja el usuario //
              Categoria_idCategoria: selectCategorias.value, // Se captura del comboBox //
              Archivos_idArchivos: Math.max(idsCargados)+1, //Se obtiene a partir del id mas alto//
              Fase_idfase: obtener_Fase(selectConvocatorias.value), //Se obtiene de la convocatoria
              EstadosProyecto_idEstadosProyecto: 1,//Por defecto siempre es 1 al crearse
              
          }),
      })
      .then((response) => response.json())
      .then((data) => {
          console.log(data);
          alert('Se ha registrado el proyecto.');
          //window.location.reload();
      })
      .catch((error) => console.error("Error:", error));
  };
};

