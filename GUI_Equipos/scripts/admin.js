const MAX_PARTICIPANTES = 5;
let EQUIPOS = [];
let ASESOR = [];
let PARTICIPANTE = [];

window.onload = async function () {
    const selectAsesor = document.getElementById('selectAsesor');

    // Obtener asesores de la API
    await fetch("https://scitrackapi-production.up.railway.app/api/asesor/", {
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
            ASESOR = data;
            ASESOR.forEach(asesor => {
                selectAsesor.innerHTML += `
                    <option value="${asesor.idAsesor}">${asesor.nombre} ${asesor.apellidoPaterno} ${asesor.apellidoMaterno}</option>
                `;
            });
        })
        .catch(error => console.error("Error al obtener asesores:", error));

    // Obtener participantes de la API
    await fetch("https://scitrackapi-production.up.railway.app/api/participante/", {
        method: "GET",
      })
    .then(response => response.json())
    .then(data => {
        PARTICIPANTE = data;
    })
    .catch(error => console.error("Error al obtener participantes:", error));

    // Obtener equipos de la API (suponiendo que haya un endpoint)
    await fetch("https://scitrackapi-production.up.railway.app/api/equipo/", {
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
            EQUIPOS = data;
            mostrarEquipos(); // Mostrar equipos al cargar la página
        })
        .catch(error => console.error("Error al obtener equipos:", error));
};

// Función para mostrar equipos en la tabla
function mostrarEquipos(filtrados = EQUIPOS) {
    // Recalcular la cantidad de participantes por equipo
    filtrados.forEach(equipo => {
        equipo.participantes = PARTICIPANTE.filter(p => p.idEquipo === equipo.idEquipo).length;
    });

    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");

    filtrados.forEach(equipo => {
        const asesor = ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);
        const asesorNombre = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : "Sin asignar";
        
        const lider = PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
        const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}` : "Sin asignar";
        tbody.innerHTML += `
            <tr>
                <td>${equipo.idEquipo}</td>
                <td>${nombreLider}</td>
                <td>${equipo.participantes} / ${MAX_PARTICIPANTES}</td>
                <td>${asesorNombre}</td>
                <td>
                    <button class="edit" onclick="modificarEquipo(${equipo.idEquipo})">Modificar</button>
                    <button class="delete" onclick="eliminarEquipo(${equipo.idEquipo})">Eliminar</button>
                </td>
            </tr>
        `;
    });
    table.appendChild(tbody);
}

// Función para buscar equipos
function buscarEquipos() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const equiposFiltrados = EQUIPOS.filter(equipo => {
        // Filtrar por nombre del líder, nombre del equipo o asesor
        const asesor = ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);
        const lider = PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
        const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}` : "";
        const asesorNombre = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : "";

        return nombreLider.toLowerCase().includes(searchInput) ||
               asesorNombre.toLowerCase().includes(searchInput);
    });

    mostrarEquipos(equiposFiltrados);
}

// Función para buscar equipos
function buscarEquipos() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const equiposFiltrados = EQUIPOS.filter(equipo => {
        // Filtrar por nombre del líder, nombre del equipo o asesor
        const asesor = ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);
        const lider = PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
        const id_equipo = EQUIPOS.find(e => e.idEquipo === equipo.idEquipo);
        const id = id_equipo ? `${id_equipo.idEquipo}` : "";
        const nombreLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}` : "";
        const asesorNombre = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : "";

        return id.toLowerCase().includes(searchInput) ||
               nombreLider.toLowerCase().includes(searchInput) ||
               asesorNombre.toLowerCase().includes(searchInput);
    });

    mostrarEquipos(equiposFiltrados);
}

// Función para eliminar equipo
async function eliminarEquipo(id) {
    fetch(`https://scitrackapi-production.up.railway.app/api/equipo/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El equipo ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}


// Función para modificar equipo
function modificarEquipo(id) {
    // Almacenar el ID del equipo en sessionStorage para acceder en la página de modificación
    sessionStorage.setItem('sci:equipo_to_edit', id);
    
    // Redirigir a la página de modificación
    window.location.href = "modify_equipos.html";
}




