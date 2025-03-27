const equipos = [
    { id: 1, nombre: "Equipo Alfa", participantes: 5, maxParticipantes: 10, asesor: "Juan Castillo" },
    { id: 2, nombre: "Equipo Beta", participantes: 3, maxParticipantes: 10, asesor: "Raul Román" },
    { id: 3, nombre: "Equipo Gamma", participantes: 8, maxParticipantes: 10, asesor: "Ana Martínez" }
];

function cargarEquipos() {
    const tablaEquipos = document.getElementById("tablaEquipos");
    tablaEquipos.innerHTML = "";
    
    equipos.forEach((equipo, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${equipo.nombre}</td>
            <td>${equipo.participantes}/${equipo.maxParticipantes}</td>
            <td>${equipo.asesor}</td>
            <td>
                <button class="edit" onclick="modificarEquipo(${equipo.id})">Modificar</button>
                <button class="delete" onclick="eliminarEquipo(${index})">Eliminar</button>
                
            </td>
        `;
        tablaEquipos.appendChild(fila);
    });
}

function eliminarEquipo(index) {
    if (confirm("¿Seguro que deseas eliminar este equipo?")) {
        equipos.splice(index, 1);
        cargarEquipos();
    }
}

function modificarEquipo(id) {
    window.location.href = `modify_equipos.html?id=${id}`;
}

window.onload = cargarEquipos;

