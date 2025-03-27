const ASESOR = [
    { id: 1, nombre: "Juan Castillo" },
    { id: 2, nombre: "Raul Román" },
    { id: 3, nombre: "Ana Martínez" }
];

let equipos = JSON.parse(localStorage.getItem("equipos")) || [
    { id: 1, nombre: "Equipo Alfa", participantes: ["Pedro", "Luis", "María"], asesor: "Juan Castillo" },
    { id: 2, nombre: "Equipo Beta", participantes: ["Carlos", "Ana"], asesor: "Raul Román" },
    { id: 3, nombre: "Equipo Gamma", participantes: ["Jorge", "Fernanda", "Sofía"], asesor: "Ana Martínez" }
];

// Obtener ID del equipo desde la URL
const params = new URLSearchParams(window.location.search);
const equipoId = parseInt(params.get("id"));
const equipo = equipos.find(e => e.id === equipoId);

if (!equipo) {
    alert("Equipo no encontrado");
    window.location.href = "index.html";
}

// Cargar datos en el formulario
document.getElementById("nombreEquipo").value = equipo.nombre;

// Cargar asesores en el select
const selectAsesor = document.getElementById("asesor");
ASESOR.forEach(asesor => {
    const option = document.createElement("option");
    option.value = asesor.nombre;
    option.textContent = asesor.nombre;
    if (asesor.nombre === equipo.asesor) {
        option.selected = true;
    }
    selectAsesor.appendChild(option);
});

// Cargar lista de participantes
function cargarParticipantes() {
    const tablaParticipantes = document.getElementById("tablaParticipantes");
    tablaParticipantes.innerHTML = "";

    equipo.participantes.forEach((participante, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${participante}</td>
            <td><button class="eliminar" onclick="eliminarParticipante(${index})">Eliminar</button></td>
        `;
        tablaParticipantes.appendChild(fila);
    });
}

// Eliminar participante del equipo
function eliminarParticipante(index) {
    if (confirm("¿Seguro que deseas eliminar a este participante?")) {
        equipo.participantes.splice(index, 1);
        cargarParticipantes();
    }
}

// Guardar cambios
document.getElementById("formModificarEquipo").addEventListener("submit", function(event) {
    event.preventDefault();

    equipo.nombre = document.getElementById("nombreEquipo").value;
    equipo.asesor = document.getElementById("asesor").value;

    localStorage.setItem("equipos", JSON.stringify(equipos));

    alert("Equipo modificado correctamente");
    window.location.href = "index.html";
});

// Regresar sin modificar
function regresar() {
    window.location.href = "index.html";
}

// Cargar participantes al inicio
cargarParticipantes();
