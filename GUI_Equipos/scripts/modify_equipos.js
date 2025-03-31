const API_URL = "https://scitrackapi-production.up.railway.app/api/";
let ASESOR = [];
let PARTICIPANTE = [];
let equipo = null;

const equipoId = sessionStorage.getItem('sci:equipo_to_edit');
window.onload = async function () {
    await cargarAsesores();
    try {
        // Obtener participantes desde la API
        const resParticipantes = await fetch(`${API_URL}participante/`, {
            method: "GET",
        });
        PARTICIPANTE = await resParticipantes.json();
        
        // Obtener equipo específico desde la API
        const resEquipo = await fetch(`${API_URL}equipo/${equipoId}`);
        equipo = await resEquipo.json();
        
        if (!equipo) {
            alert("Equipo no encontrado");
            window.location.href = "index.html";
            return;
        }
        
        // Cargar lista de participantes
        cargarParticipantes();
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
};

async function cargarAsesores() {
    const selectAsesor = document.getElementById("asesor");
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

// Cargar lista de participantes
function cargarParticipantes() {
    const tablaParticipantes = document.getElementById("tablaParticipantes");
    tablaParticipantes.innerHTML = "";
    
    equipo.participantes.forEach((participante, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${participante.nombre} ${participante.apellidoPaterno}</td>
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
document.getElementById("formModificarEquipo").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    // Obtener el ID del asesor del formulario
    let idAsesor = document.getElementById("asesor").value;

    // Verificar el valor de idAsesor
    console.log("ID Asesor seleccionado:", idAsesor); // Depuración: Verifica el valor de idAsesor
    
    // Validar si el idAsesor es un número
    if (!idAsesor || isNaN(idAsesor)) {
        alert("Debe seleccionar un asesor válido.");
        return; // Detener la ejecución si no se seleccionó un asesor válido
    }
    
    try {
        fetch(`https://scitrackapi-production.up.railway.app/api/equipo/${equipoId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            // Se construye un objeto con los datos actualizados del equipo
            body: JSON.stringify({
                Asesor_idAsesor: idAsesor,
                participantes: equipo.participantes,  // Mantén la lista de participantes tal cual
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se han modificado los datos del equipo.');
            console.log(data);
            window.location = "admin.html";
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
        console.error("Error al modificar equipo:", error);
        alert("Ocurrió un error inesperado al modificar el equipo");
    }
});

// Regresar sin modificar
function regresar() {
    window.location.href = "admin.html";
}
