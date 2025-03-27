const ASESOR = [
    { idAsesor: 1, nombre: "Juan", apellidoPaterno: "Castillo", apellidoMaterno: "Martinez" },
    { idAsesor: 2, nombre: "Raul", apellidoPaterno: "Román", apellidoMaterno: "Murillo" },
];

let EQUIPOS = [
    { nombreEquipo: "Los Genios", participantes: 3, idAsesor: 1 },
    { nombreEquipo: "Innovadores", participantes: 1, idAsesor: 2 }
];
const MAX_PARTICIPANTES = 5;


window.onload = function () {
    const selectAsesor = document.getElementById('selectAsesor');
    const btnCrearEquipo = document.querySelector("form button");
    const inputNombre = document.getElementById("inputNombre");

    // Llenar el select de asesores
    ASESOR.forEach(asesor => {
        selectAsesor.innerHTML += `
            <option value="${asesor.idAsesor}">${asesor.nombre} ${asesor.apellidoPaterno} ${asesor.apellidoMaterno}</option>
        `;
    });

    // Mostrar lista inicial de equipos
    mostrarEquipos();

    // Función para crear un nuevo equipo
    btnCrearEquipo.addEventListener("click", function (e) {
        e.preventDefault();
        const nombreEquipo = inputNombre.value.trim();
        const idAsesor = parseInt(selectAsesor.value);

        if (nombreEquipo === "" || idAsesor === "none" || isNaN(idAsesor)) {
            alert("Por favor ingresa un nombre de equipo y selecciona un asesor.");
            return;
        }

        const nuevoEquipo = {
            nombreEquipo: nombreEquipo,
            participantes: 1, // el creador cuenta como primer participante
            idAsesor: idAsesor
        };

        EQUIPOS.push(nuevoEquipo);
        alert(`¡Equipo "${nombreEquipo}" creado exitosamente!`);

        // Limpiar campos
        inputNombre.value = "";
        selectAsesor.value = "none";

        // Actualizar tabla
        mostrarEquipos();
    });
};

// Función para mostrar equipos en la tabla
function mostrarEquipos() {
    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) {
        tbodyExistente.remove();
    }

    const tbody = document.createElement("tbody");
 
    EQUIPOS.forEach(equipo => {
        const asesor = ASESOR.find(a => a.idAsesor === equipo.idAsesor);
        const asesorNombre = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : "Sin asignar";
        tbody.innerHTML += `

            <tr>
                <td>${equipo.nombreEquipo}</td>
                <td>${equipo.participantes} / ${MAX_PARTICIPANTES}</td>
                <td>${asesorNombre}</td>
                <td><button onclick="unirseEquipo('${equipo.nombreEquipo}')">Unirse</button></td>
            </tr>
        `;
    });

    table.appendChild(tbody);
}

// Función para unirse a un equipo
function unirseEquipo(nombreEquipo) {
    const equipo = EQUIPOS.find(eq => eq.nombreEquipo === nombreEquipo);
    if (equipo.participantes < MAX_PARTICIPANTES) {
        equipo.participantes += 1;
        alert(`¡Te has unido al equipo "${nombreEquipo}"! Ahora tiene ${equipo.participantes} participantes.`);
        mostrarEquipos();
    }
    else {
        alert("Este equipo ya ha alcanzado el número máximo de participantes.");
    }
}
