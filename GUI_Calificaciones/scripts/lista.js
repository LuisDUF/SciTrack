let HISTORIAL = [];
let CALIFICACIONES = [];
let PROYECTOS = [];
let CRITERIOS = [];

window.onload = async function () {
    await cargarDatos();


    // Obtener historial de la API
    await fetch("http://localhost:3000/api/historialpromedio", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        HISTORIAL = data;
        mostrarHistorial(); // Mostrar historial al cargar la página
    })
    .catch(error => console.error("Error al obtener historial:", error));
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
  

// Función para mostrar el historial en la tabla
function mostrarHistorial(filtrados = HISTORIAL) {
    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");



    filtrados.forEach(h => {
        const proyecto = PROYECTOS.find(p => p.idProyecto === h.Proyecto_idProyecto);
        tbody.innerHTML += `
            <tr>
                <td>${h.Proyecto_idProyecto}</td>
                <td>${proyecto ? proyecto.nombre : 'Desconocido'}</td>
                <td>${h.promedio}</td>
                <td>${h.idFase}</td>

                <td>
                    <button class="edit" onclick="modificar(${h.Proyecto_idProyecto},${h.idFase})">Modificar</button>
                    <button class="btnEliminar" data-id="${h.idHistorialPromedio}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    table.appendChild(tbody);
}

// Función para buscar en el historial
function buscarHistorial() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const historialFiltrado = HISTORIAL.filter(h =>
        h.Proyecto_idProyecto.toString().toLowerCase().includes(searchInput) ||
        h.idFase.toString().toLowerCase().includes(searchInput)
    );
    mostrarHistorial(historialFiltrado);
}


// Función para modificar administrador
function modificar(idProyecto,idFase) {
    // Almacenar el ID del admin en sesion y el cual se va a modificar en sessionStorage para acceder en la página de modificación
    sessionStorage.setItem('sci:calificacion_idFase', idFase);
    sessionStorage.setItem('sci:project_in_evaluation', idProyecto);
    // Redirigir a la página de modificación
    window.location.href = "main.html";
}