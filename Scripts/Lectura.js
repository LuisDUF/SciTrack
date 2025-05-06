function listar_fases() {
    fetch("https://scitrackapi-production.up.railway.app/api/proyecto/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const cuerpoTabla = document.querySelector("#tabla-proyectos tbody");
        cuerpoTabla.innerHTML = ""; // Limpiar contenido previo

        data.forEach(proyecto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proyecto.idProyecto}</td>
                <td>${proyecto.nombre}</td>
                <td>${proyecto.fechaRegistro}</td>
                <td>${proyecto.Equipo_idEquipo}</td>
                <td>${proyecto.Categoria_idCategoria}</td>
                <td>${proyecto.Investigador_idInvestigador}</td>
                <td>${proyecto.Archivos_idArchivos}</td>
                <td>${proyecto.Fase_idFase}</td>
                <td>${proyecto.EstadosProyecto_idEstadosProyecto}</td>
                <td>${proyecto.Calificacion_idCalificacion}</td>
                
            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Fases cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar los proyectos:", error));
}





// Ejecutar al cargar la página
window.onload = listar_fases;