const MAX_PARTICIPANTES = 3;
let EQUIPOS = [];
let ASESOR = [];
let PARTICIPANTE = [];
const PARTICIPANTE_SESION = JSON.parse(localStorage.getItem("usuarioActual")) || null; 

window.onload = async function () {
    await cargarAsesores();
    await cargarParticipantes();
    await cargarEquipos();
};

// Cargar asesores desde la API
async function cargarAsesores() {
    const selectAsesor = document.getElementById("selectAsesor");
    try {
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/asesor/");
        ASESOR = await response.json();
        ASESOR.forEach(asesor => {
            selectAsesor.innerHTML += `
                <option value="${asesor.idAsesor}">${asesor.nombre} ${asesor.apellidoPaterno} ${asesor.apellidoMaterno}</option>
            `;
        });
    } catch (error) {
        console.error("Error al obtener asesores:", error);
    }
}

// Cargar participantes desde la API
async function cargarParticipantes() {
    try {
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/participante/");
        PARTICIPANTE = await response.json();
    } catch (error) {
        console.error("Error al obtener participantes:", error);
    }
}

// Cargar equipos desde la API
async function cargarEquipos() {
    try {
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/equipo/");
        EQUIPOS = await response.json();
        mostrarEquipos();
    } catch (error) {
        console.error("Error al obtener equipos:", error);
    }
}

// Mostrar equipos en la tabla
function mostrarEquipos() {
    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");

    EQUIPOS.forEach(equipo => {
        equipo.participantes = PARTICIPANTE.filter(p => p.idEquipo === equipo.idEquipo).length;
        const asesor = ASESOR.find(a => a.idAsesor === equipo.Asesor_idAsesor);
        const lider = PARTICIPANTE.find(p => p.idParticipante === equipo.Participante_idLider);
        
        tbody.innerHTML += `
            <tr>
                <td>${lider ? `${lider.nombre} ${lider.apellidoPaterno}` : "Sin asignar"}</td>
                <td>${equipo.participantes} / ${MAX_PARTICIPANTES}</td>
                <td>${asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}` : "Sin asignar"}</td>
                <td><button onclick="unirseEquipo('${equipo.idEquipo}')">Unirse</button></td>
            </tr>
        `;
    });

    table.appendChild(tbody);
}

// Crear equipo
document.getElementById("formCrearEquipo").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    if (!PARTICIPANTE_SESION) {
        alert("Debe iniciar sesión para crear un equipo.");
        return;
    }

    const selectAsesor = document.getElementById("selectAsesor");
    const idAsesor = selectAsesor.value;

    if (idAsesor === "none") {
        alert("Seleccione un asesor.");
        return;
    }

    const nuevoEquipo = {
        Asesor_idAsesor: parseInt(idAsesor),
        Participante_idLider: PARTICIPANTE_SESION.idParticipante
    };

    try {
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/equipo/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoEquipo)
        });

        if (!response.ok) throw new Error("Error al crear el equipo.");
        
        const equipoCreado = await response.json();
        EQUIPOS.push(equipoCreado);
        mostrarEquipos();
        alert("Equipo creado con éxito.");
    } catch (error) {
        console.error("Error al crear equipo:", error);
        alert("Hubo un problema al crear el equipo.");
    }
});

// Unirse a un equipo
async function unirseEquipo(idEquipo) {
    if (!PARTICIPANTE_SESION) {
        alert("Debe iniciar sesión para unirse a un equipo.");
        return;
    }

    const equipo = EQUIPOS.find(e => e.idEquipo == idEquipo);
    if (!equipo) {
        alert("El equipo no existe.");
        return;
    }

    // Verificar si el equipo está lleno
    const participantesEquipo = PARTICIPANTE.filter(p => p.idEquipo === equipo.idEquipo).length;
    if (participantesEquipo >= MAX_PARTICIPANTES) {
        alert("Este equipo ya está lleno.");
        return;
    }

    // Actualizar participante con el ID del equipo
    try {
        const response = await fetch(`https://scitrackapi-production.up.railway.app/api/participante/${PARTICIPANTE_SESION.idParticipante}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idEquipo: equipo.idEquipo })
        });

        if (!response.ok) throw new Error("Error al unirse al equipo.");
        
        PARTICIPANTE_SESION.idEquipo = equipo.idEquipo;
        localStorage.setItem("usuarioActual", JSON.stringify(PARTICIPANTE_SESION));
        
        await cargarParticipantes();
        mostrarEquipos();
        alert("Te has unido al equipo con éxito.");
    } catch (error) {
        console.error("Error al unirse al equipo:", error);
        alert("No se pudo unir al equipo.");
    }
}
