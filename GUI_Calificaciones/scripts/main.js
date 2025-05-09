let CALIFICACIONES = [];
let CATEGORIAS = [];
let AREAS = [];
let RUBRICAS = [];
let CRITERIOS = [];
let PROYECTOS =[];
let HISTORIALES = [];

const aInSession = sessionStorage.getItem('sci:project_in_evaluation')
//const idProyecto = 14; 
const idProyecto = parseInt(aInSession);



// Se usan cuando se edita una calificacion

const calificacionIdFase = parseInt(sessionStorage.getItem('sci:calificacion_idFase'));


window.onload = async function () {
    await cargarRubricas();
    await cargarCriterios();
    await cargarCategorias();
    await cargarAreas();
    await cargarProyectos();
    
    
    
    if(calificacionIdFase != null){
      await cargarCalificacionesPrevias();
      await cargarHistoriales();
      editCriterios(calificacionIdFase,idProyecto);
      editCriteriosConInputs(calificacionIdFase,idProyecto);
    }
    else{
      mostrarCriterios(idProyecto);
      mostrarCriteriosConInputs(idProyecto);
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
    .catch(error => console.error("Error al obtener calificaciones:", error));
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


async function editCriterios(calificacionIdFase,idProyecto) {
  const table = document.getElementById("criteriosTable").querySelector("tbody");
  table.innerHTML = "";

  const proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
  
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
  const filasEmoji = document.querySelectorAll("#criteriosTable tbody tr");
  const filasInput = document.querySelectorAll("#criteriosTableInput tbody tr");

  // Detecta si hay al menos una calificación vía input
  const usoInputs = Array.from(filasInput).some(fila => {
    const input = fila.querySelector(".input-calif");
    return input && input.value !== "";
  });

  if (usoInputs) {
    await enviarEvaluacionConInputs();
  } else {
    await enviarEvaluacionConEmojis();
  }
});


//INPUTS
async function mostrarCriteriosConInputs(idProyecto) {
  const table = document.getElementById("criteriosTableInput").querySelector("tbody");
  table.innerHTML = "";

  const proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
  if (!proyecto) return;

  const idCat = proyecto.Categoria_idCategoria;
  document.getElementById("tituloCriteriosInput").textContent = `Criterios con Inputs: ${proyecto.nombre}`;

  const categoria = CATEGORIAS.find(c => c.idCategoria === idCat);
  const idArea = categoria ? categoria.AreaDeConocimientoCat_idAreaDeConocimientoCat : null;
  const rubrica = RUBRICAS.find(r => r.AreaDeConocimientoCat_idAreaDeConocimientoCat === idArea);
  if (!rubrica) return;

  const criterios = CRITERIOS.filter(c => c.Rubrica_idRubrica === rubrica.idRubrica);

  criterios.forEach(criterio => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${criterio.descripcion}</td>
      <td><input type="number" class="input-calif" min="0" max="100" step="0.1" style="width: 80px;"></td>
    `;
    row.dataset.idCriterios = criterio.idCriterios;
    row.dataset.ponderacion = criterio.ponderacion;
    table.appendChild(row);
  });
}

async function editCriteriosConInputs(calificacionIdFase, idProyecto) {
  const table = document.getElementById("criteriosTableInput").querySelector("tbody");
  table.innerHTML = "";

  const proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
  if (!proyecto) return;

  document.getElementById("tituloCriterios").textContent = `Editar Evaluación del Proyecto: ${proyecto.nombre}`;

  const categoria = CATEGORIAS.find(c => c.idCategoria === proyecto.Categoria_idCategoria);
  const idArea = categoria ? categoria.AreaDeConocimientoCat_idAreaDeConocimientoCat : null;

  const rubrica = RUBRICAS.find(r => r.AreaDeConocimientoCat_idAreaDeConocimientoCat === idArea);
  if (!rubrica) return;

  const criterios = CRITERIOS.filter(cr => cr.Rubrica_idRubrica === rubrica.idRubrica);
  const califProyecto = CALIFICACIONES.filter(c =>
    c.Proyecto_idProyecto === parseInt(idProyecto) &&
    c.idFase === parseInt(calificacionIdFase)
  );

  criterios.forEach(criterio => {
    const califExistente = califProyecto.find(c => c.idCriterio === criterio.idCriterios);
    let valor = califExistente ? (parseFloat(califExistente.calificacion) / criterio.ponderacion) * 100 : "";


    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${criterio.descripcion}</td>
      <td>
        <input 
          class="input-calif" 
          type="number" 
          min="0" 
          max="100" 
          step="0.1" 
          value="${valor}" 
          style="width: 60px"
        />
      </td>
    `;
    row.dataset.idCriterios = criterio.idCriterios;
    row.dataset.ponderacion = criterio.ponderacion;
    table.appendChild(row);
  });
}

// ENVIAR EVALUACIONES
async function enviarEvaluacionConInputs() {
  const filas = document.querySelectorAll("#criteriosTableInput tbody tr");
  const evaluaciones = [];
  let proyecto = null;
  let historial = [];
  let calif = [];
  let sumaPonderada = 0;

  if (calificacionIdFase != null) {
    proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
    calif = CALIFICACIONES.filter(cal =>
      cal.Proyecto_idProyecto === parseInt(idProyecto) &&
      cal.idFase === parseInt(calificacionIdFase)
    );
    
    historial = HISTORIALES.find(h => h.Proyecto_idProyecto === parseInt(idProyecto));
  }else{
    proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
  }


  const idFase = calificacionIdFase != null ? parseInt(calificacionIdFase) : proyecto.Fase_idFase;


  for (const fila of filas) {
    const input = fila.querySelector(".input-calif");
    let valor = parseFloat(input.value);
    
    if (isNaN(valor) || valor < 0 || valor >100) {
      alert("Todas las calificaciones deben ser números entre 0 y 100.");
      return;
    }

    const ponderacion = parseFloat(fila.dataset.ponderacion || 0);
    const idCriterio = parseInt(fila.dataset.idCriterios);
    valor = valor/100;
    const valorPonderado = ponderacion * valor;
    sumaPonderada += valorPonderado;

    evaluaciones.push({
      calificacion: valorPonderado,
      idFase: idFase,
      idCriterio: idCriterio,
      Proyecto_idProyecto: proyecto.idProyecto
    });
  }
  
  if (evaluaciones.length !== filas.length) {
    alert("Por favor, evalúa todos los criterios antes de enviar.");
    return;
  }

  sumaPonderada = sumaPonderada / 10;

  if (calificacionIdFase != null) {
    for (const ev of evaluaciones) {
      const existente = calif.find(c =>
        c.idFase === ev.idFase &&
        c.idCriterio === ev.idCriterio &&
        c.Proyecto_idProyecto === ev.Proyecto_idProyecto
      );
      console.log(evaluaciones);

      if (existente) {
        await fetch(`http://localhost:3000/api/calificacion/${existente.idCalificacion}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ev)
        });
      }
    }

    await fetch(`http://localhost:3000/api/historialpromedio/${historial.idHistorialPromedio}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promedio: sumaPonderada })
    });
  }else{

    for (const ev of evaluaciones) {
      await fetch(`http://localhost:3000/api/calificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ev)
      });
    }

    await fetch(`http://localhost:3000/api/historialpromedio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Proyecto_idProyecto: proyecto.idProyecto,
        promedio: sumaPonderada,
        idFase: idFase
      })
    });
  }
  await fetch(`http://localhost:3000/api/proyecto/${proyecto.idProyecto}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promedio: sumaPonderada })
  });

  alert("Evaluación enviada correctamente");
  if(calificacionIdFase != null){
    window.location.href = "lista.html";
  }
}


async function enviarEvaluacionConEmojis() {
  const filas = document.querySelectorAll("#criteriosTable tbody tr");
  const evaluaciones = [];
  let proyecto = null;
  let historial = [];
  let calif = [];
  let sumaPonderada = 0;

  if (calificacionIdFase != null) {
    proyecto = PROYECTOS.find(p => p.idProyecto === parseInt(idProyecto));
    calif = CALIFICACIONES.filter(cal =>
      cal.Proyecto_idProyecto === parseInt(idProyecto) &&
      cal.idFase === parseInt(calificacionIdFase)
    );
    historial = HISTORIALES.find(h => h.Proyecto_idProyecto === parseInt(idProyecto));
  } else {
    proyecto = PROYECTOS.find(p => p.idProyecto === idProyecto);
  }

  const idFase = calificacionIdFase != null ? parseInt(calificacionIdFase) : proyecto.Fase_idFase;


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

  if (evaluaciones.length !== filas.length) {
    alert("Por favor, evalúa todos los criterios antes de enviar.");
    return;
  }

  sumaPonderada = sumaPonderada / 10;

  console.log("Evaluaciones:", evaluaciones);
  console.log("Total ponderado:", sumaPonderada);


  if (calificacionIdFase != null) {
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

    await fetch(`http://localhost:3000/api/historialpromedio/${historial.idHistorialPromedio}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promedio: sumaPonderada })
    });
  } else {
    for (const ev of evaluaciones) {
      await fetch(`http://localhost:3000/api/calificacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ev)
      });
    }

    await fetch(`http://localhost:3000/api/historialpromedio`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Proyecto_idProyecto: proyecto.idProyecto,
        promedio: sumaPonderada,
        idFase: idFase
      })
    });
  }

  await fetch(`http://localhost:3000/api/proyecto/${proyecto.idProyecto}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promedio: sumaPonderada })
  });

  alert("Evaluación enviada correctamente");
  if(calificacionIdFase != null){
    window.location.href = "lista.html";
  }

}

document.getElementById("btnResetSeleccion").addEventListener("click", () => {
  const emojis = document.querySelectorAll(".emoji.selected");
  emojis.forEach(e => e.classList.remove("selected"));
});
