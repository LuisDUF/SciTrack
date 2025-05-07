let CALIFICACIONES = [];
let PROYECTOS = [];
let CRITERIOS = [];

window.onload = async function () {
  await cargarDatos();
  mostrarCalificaciones();
  document.getElementById("filtroProyecto").addEventListener("input", mostrarCalificaciones);
};

async function cargarDatos() {
  // Calificaciones
  await fetch("http://localhost:3000/api/calificacion")
    .then(response => response.json())
    .then(data => {
      CALIFICACIONES = data;
    })
    .catch(error => console.error("Error al obtener calificaciones:", error));

  // Proyectos
  await fetch("http://localhost:3000/api/proyecto")
    .then(response => response.json())
    .then(data => {
      PROYECTOS = data;
    })
    .catch(error => console.error("Error al obtener proyectos:", error));

  // Criterios
  await fetch("http://localhost:3000/api/criterio")
    .then(response => response.json())
    .then(data => {
      CRITERIOS = data;
    })
    .catch(error => console.error("Error al obtener criterios:", error));
}

function mostrarCalificaciones(filtrados = CALIFICACIONES) {
  const table = document.querySelector("table");
  const tbodyExistente = table.querySelector("tbody");
  if (tbodyExistente) tbodyExistente.remove();

  const tbody = document.createElement("tbody");

  filtrados.forEach(calificacion => {
    const proyecto = PROYECTOS.find(p => p.idProyecto === calificacion.Proyecto_idProyecto);
    const criterio = CRITERIOS.find(c => c.idCriterios === calificacion.idCriterio);

    tbody.innerHTML += `
      <tr>
        <td>${proyecto ? proyecto.nombre : 'Desconocido'}</td>
        <td>${criterio ? criterio.descripcion : 'Desconocido'}</td>
        <td>${calificacion.calificacion}</td>
        <td>${calificacion.idFase}</td>
        
        <td>
        <button class="edit" onclick="modificar(${calificacion.idCalificacion},${calificacion.idFase},${calificacion.Proyecto_idProyecto})">Modificar</button>
        <button class="btnEliminar" data-id="${calificacion.idCalificacion}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  table.appendChild(tbody);

  // Asociar eventos a botones eliminar
  document.querySelectorAll(".btnEliminar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const confirmar = confirm("¿Estás seguro de que deseas eliminar esta calificación?");
      if (confirmar) {
        await eliminarCalificacion(id);
      }
    });
  });
}

async function eliminarCalificacion(id) {
  await fetch(`http://localhost:3000/api/calificacion/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        CALIFICACIONES = CALIFICACIONES.filter(cal => cal.idCalificacion != id);
        mostrarCalificaciones();
        alert("Calificación eliminada correctamente.");
      } else {
        throw new Error("No se pudo eliminar");
      }
    })
    .catch(err => {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar la calificación.");
    });
}

// Función para modificar administrador
function modificar(idCalificacion,idFase,idProyecto) {
  // Almacenar el ID del admin en sesion y el cual se va a modificar en sessionStorage para acceder en la página de modificación
  sessionStorage.setItem('sci:evaluacion_a_editar', idCalificacion);
  sessionStorage.setItem('sci:calificacion_idFase', idFase);
  sessionStorage.setItem('sci:calificacion_idProyecto', idProyecto);
  // Redirigir a la página de modificación
  window.location.href = "main.html";
}
