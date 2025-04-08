function listar_fases() {
    fetch("https://scitrackapi-production.up.railway.app/api/fase/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const cuerpoTabla = document.querySelector("#tabla-fases tbody");
        cuerpoTabla.innerHTML = ""; // Limpiar contenido previo

        data.forEach(fase => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${fase.nombre}</td>
                <td>${fase.modalidad}</td>
                <td>${fase.fechaInicio}</td>
                <td>${fase.fechaFin}</td>
                <td>${fase.descripcion}</td>
                <td>${fase.Ubicacion_idUbicacion}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Fases cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar las fases:", error));
}

// Ejecutar al cargar la página
window.onload = listar_fases;
