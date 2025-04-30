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
                <td>${fase.calificacion_minima}</td>

                <td>${fase.Ubicacion_idUbicacion}</td>
                <td style="border: none;"><button id="btn_delete_${fase.idFase}" onclick="btnEliminarFase(${fase.idFase})">Eliminar</button></td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Fases cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar las fases:", error));
}

function btnEliminarFase(idFase) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta fase?")) {
        return;
    }

    console.log("Botón 'Eliminar' presionado para la fase con id:", idFase);

    fetch(`https://scitrackapi-production.up.railway.app/api/fase/${idFase}`, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo eliminar la fase");
        }
        return response.json();
    })
    .then(data => {
        console.log("Fase eliminada:", data);
        window.location.reload();
    })
    .catch(error => {
        console.error("Error al eliminar:", error);
        window.location.reload();  
    });
    

    
}



// Ejecutar al cargar la página
window.onload = listar_fases;
