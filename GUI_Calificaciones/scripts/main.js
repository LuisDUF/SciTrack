let CALIFICACIONES = [];
let CATEGORIAS = [];
let AREAS = [];
let RUBRICAS = [];
let CRITERIOS = [];
let PROYECTOS =[];
let HISTORIALES = [];

const aInSession = sessionStorage.getItem('sci:project_in_evaluation')
const idProyecto = 14; //reemplazar 


// Se usan cuando se edita una calificacion
const calificacionEditarId = sessionStorage.getItem('sci:evaluacion_a_editar');
const calificacionIdFase = sessionStorage.getItem('sci:calificacion_idFase');
const calificacionIdProyecto = sessionStorage.getItem('sci:calificacion_idProyecto');

window.onload = async function () {
    await cargarRubricas();
    await cargarCriterios();
    await cargarCategorias();
    await cargarAreas();
    await cargarProyectos();
    
    
    
    if(calificacionEditarId != null){
      await cargarCalificacionesPrevias();
      await cargarHistoriales();
      editCriterios(calificacionIdFase,calificacionIdProyecto);
    }
    else{
      mostrarCriterios(idProyecto);
    }
  
    const tabla = document.getElementById("tablaRubrica");
    
  };

  
  async function cargarCalificacionesPrevias() {
    await fetch("http://localhost:3000/api/calificacion", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        CALIFICACIONES = data;
    })
    .catch(error => console.error("Error al obtener categorías:", error));
  }

  async function cargarHistoriales() {
    await fetch("http://localhost:3000/api/historialpromedio", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        HISTORIALES = data;
    })
    .catch(error => console.error("Error al obtener categorías:", error));
  }
  

  async function cargarProyectos() {
    await fetch("http://localhost:3000/api/proyecto", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        PROYECTOS = data;
    })
    .catch(error => console.error("Error al obtener categorías:", error));
}





  async function cargarCategorias() {
    await fetch("http://localhost:3000/api/categoria", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        CATEGORIAS = data;
    })
    .catch(error => console.error("Error al obtener categorías:", error));
}

async function cargarAreas() {
    await fetch("http://localhost:3000/api/areadeconocimientocat", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        AREAS = data;
    })
    .catch(error => console.error("Error al obtener áreas:", error));
}
async function cargarRubricas() {
  await fetch("http://localhost:3000/api/rubrica", {
    method: "GET",
  })
  .then(response => response.json())
  .then(data => {
    RUBRICAS = data;
  })
  .catch(error => console.error("Error al obtener rúbricas:", error));
}

async function cargarCriterios() {
  await fetch("http://localhost:3000/api/criterio", {
    method: "GET",
  })
  .then(response => response.json())
  .then(data => {
    CRITERIOS = data;
  })
  .catch(error => console.error("Error al obtener rúbricas:", error));
}


//editar
async function mostrarCriterios(idProyecto) {
  const table = document.getElementById("criteriosTable").querySelector("tbody");
  table.innerHTML = "";

  const proyecto = PROYECTOS.find(p => p.idProyecto === idProyecto);
  const idCat = proyecto ? proyecto.Categoria_idCategoria : null;
  document.getElementById("tituloCriterios").textContent = `Criterios de Evaluación del Proyecto: ${proyecto.nombre}`;

  const categoria = CATEGORIAS.find(c => c.idCategoria === idCat);
  const idArea = categoria ? categoria.AreaDeConocimientoCat_idAreaDeConocimientoCat : null;
  
  const rubrica = RUBRICAS.find(r => r.AreaDeConocimientoCat_idAreaDeConocimientoCat === idArea);
  if (!rubrica) return;
  
  const criterios = CRITERIOS.filter(cr => cr.Rubrica_idRubrica === rubrica.idRubrica);

  criterios.forEach(criterio => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${criterio.descripcion}</td>
      <td><span class="emoji" data-value="0">😞</span></td>
      <td><span class="emoji" data-value="0.25">😐</span></td>
      <td><span class="emoji" data-value="0.5">🙂</span></td>
      <td><span class="emoji" data-value="0.75">😊</span></td>
      <td><span class="emoji" data-value="1">🤩</span></td>
    `;
    row.dataset.idCriterios = criterio.idCriterios;
    row.dataset.ponderacion = criterio.ponderacion;
    table.appendChild(row);


  });

  // Agregar el evento de selección para los emojis
  table.querySelectorAll(".emoji").forEach(emoji => {
    emoji.addEventListener("click", () => {
      const row = emoji.closest("tr");
      row.querySelectorAll(".emoji").forEach(e => e.classList.remove("selected"));
      emoji.classList.add("selected");
    });
  });
}


async function editCriterios(calificacionIdFase,calificacionIdProyecto) {
  const table = document.getElementById("criteriosTable").querySelector("tbody");
  table.innerHTML = "";

  const proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(calificacionIdProyecto));
  
  const idCat = proyecto ? proyecto.Categoria_idCategoria : null;
  document.getElementById("tituloCriterios").textContent = `Criterios de Evaluación del Proyecto: ${proyecto.nombre}`;

  const categoria = CATEGORIAS.find(c => c.idCategoria === idCat);
  const idArea = categoria ? categoria.AreaDeConocimientoCat_idAreaDeConocimientoCat : null;
  
  const rubrica = RUBRICAS.find(r => r.AreaDeConocimientoCat_idAreaDeConocimientoCat === idArea);
  if (!rubrica) return;
  
  const criterios = CRITERIOS.filter(cr => cr.Rubrica_idRubrica === rubrica.idRubrica);

  criterios.forEach(criterio => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${criterio.descripcion}</td>
      <td><span class="emoji" data-value="0">😞</span></td>
      <td><span class="emoji" data-value="0.25">😐</span></td>
      <td><span class="emoji" data-value="0.5">🙂</span></td>
      <td><span class="emoji" data-value="0.75">😊</span></td>
      <td><span class="emoji" data-value="1">🤩</span></td>
    `;
    row.dataset.idCriterios = criterio.idCriterios;
    row.dataset.ponderacion = criterio.ponderacion;
    table.appendChild(row);

    
  });

  // Agregar el evento de selección para los emojis
  table.querySelectorAll(".emoji").forEach(emoji => {
    emoji.addEventListener("click", () => {
      const row = emoji.closest("tr");
      row.querySelectorAll(".emoji").forEach(e => e.classList.remove("selected"));
      emoji.classList.add("selected");
    });
  });
}


document.getElementById("btnEnviarEvaluacion").addEventListener("click", async () => {
  const filas = document.querySelectorAll("#criteriosTable tbody tr");
  const evaluaciones = [];
  let proyecto = null; // Cambiado a `let` en lugar de `const`
  let historial = [];
  let calif = [];
  let sumaPonderada = 0;

  if (calificacionEditarId != null) {

    proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(calificacionIdProyecto)); // <-- AÑADE ESTA LÍNEA

    calif = CALIFICACIONES.filter(cal =>
      cal.Proyecto_idProyecto === parseInt(calificacionIdProyecto) &&
      cal.idFase === parseInt(calificacionIdFase)
    );
  
    historial = HISTORIALES.find(h => h.Proyecto_idProyecto === parseInt(calificacionIdProyecto));
  } else {
    proyecto = PROYECTOS.find(p => p.idProyecto === idProyecto);
  }

  const idFase = proyecto.Fase_idFase;

  filas.forEach(fila => {
    const idCriterios = parseInt(fila.dataset.idCriterios);
    const ponderacion = parseFloat(fila.dataset.ponderacion || 0);
    const emojiSeleccionado = fila.querySelector(".emoji.selected");

    if (emojiSeleccionado) {
      const porcentaje = parseFloat(emojiSeleccionado.dataset.value);
      const valorRecibido = ponderacion * porcentaje;

      sumaPonderada += valorRecibido;

      evaluaciones.push({
        calificacion: valorRecibido,
        idFase: idFase,
        idCriterio: idCriterios,
        Proyecto_idProyecto: proyecto.idProyecto
      });
    }
  });

  sumaPonderada = sumaPonderada / 10;

  console.log("Evaluaciones:", evaluaciones);
  console.log("Total ponderado:", sumaPonderada);

  if (calificacionEditarId != null) {
    //Actualiza las calificaciones de los criterios en la tabla Calificacion
    for (const ev of evaluaciones) {
      const existente = calif.find(c =>
        c.idFase === ev.idFase &&
        c.idCriterio === ev.idCriterio &&
        c.Proyecto_idProyecto === ev.Proyecto_idProyecto
      );

      if (existente) {
        await fetch(`http://localhost:3000/api/calificacion/${existente.idCalificacion}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ev)
        });
      }
    }
  //Actualiza el campo promedio en Historial
  await fetch(`http://localhost:3000/api/historialpromedio/${historial.idHistorialPromedio}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promedio: sumaPonderada })
  });


  } else {
    //Inserta en tabla calificaciones
    for (const ev of evaluaciones) {
      await fetch(`http://localhost:3000/api/calificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ev)
      });
    }
    //Inserta en tabla historial
    await fetch(`http://localhost:3000/api/historialpromedio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Proyecto_idProyecto: proyecto.idProyecto,
        promedio: sumaPonderada,
        idFase: idFase,
      })
    });

  }
  //Actualiza el campo promedio en Proyecto
  await fetch(`http://localhost:3000/api/proyecto/${proyecto.idProyecto}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promedio: sumaPonderada })
  });

  alert("Evaluación enviada correctamente");
  if(calificacionEditarId != null){
    window.location.href = "listar.html";
  }
});

document.getElementById("btnResetSeleccion").addEventListener("click", () => {
  const emojis = document.querySelectorAll(".emoji.selected");
  emojis.forEach(e => e.classList.remove("selected"));
});
