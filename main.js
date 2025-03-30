
       
   window.onload = function () {
    const inputInstitucion = document.getElementById("inputInstitucion");
    const inputDependencia = document.getElementById("inputDependencia");
    const btnEnviarInstitucion = document.getElementById("btnEnviarInstitucion");
    const btnEnviarDependencia = document.getElementById("btnEnviarDependencia");

    listar_instituciones()

    btnEnviarInstitucion.onclick = function () {
        if (inputInstitucion.value.trim() === "") {
            alert("Ingrese el nombre de la institución");
            return;
        }

        fetch("https://scitrackapi-production.up.railway.app/api/institucion/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: inputInstitucion.value })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Institución registrada:", data);
            alert("Institución registrada exitosamente");
        })
        .catch(error => console.error("Error:", error));
    };

    btnEnviarDependencia.onclick = function () {
        if (inputDependencia.value.trim() === "") {
            alert("Ingrese el nombre de la dependencia");
            return;
        }

        fetch("https://scitrackapi-production.up.railway.app/api/dependencia/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: inputDependencia.value })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Dependencia registrada:", data);
            alert("Dependencia registrada exitosamente");
        })
        .catch(error => console.error("Error:", error));
    };


    
};
   
function listar_instituciones(){
    fetch("https://scitrackapi-production.up.railway.app/api/institucion/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const result = document.getElementById("lista-instituciones");
        
        data.forEach(institucion => {
            let fila = document.createElement("li");
            fila.innerHTML = `
                ${institucion.nombre} 
                <button id="btn_${institucion.idInstitucion}" onclick="btnAsignar(${institucion.idInstitucion})">Asignar</button>
                <button id="btn_delete_${institucion.idInstitucion}" onclick="btnEliminar(${institucion.idInstitucion})">Eliminar</button>
            `;
            result.appendChild(fila);
        });

        data.forEach(d => {
            console.log(d.nombre);
        });

        INSTITUCIONES = data;
        console.log(data);

    })
    .catch((error) => console.error("Error:", error));
}

// Función para manejar el click del botón
function btnAsignar(idInstitucion) {
    console.log("Botón presionado para la institución con id:", idInstitucion);
    // Aquí puedes agregar la lógica que desees cuando el botón sea presionado
}


function btnEliminar(idInstitucion) {
    console.log("Botón 'Eliminar' presionado para la institución con id:", idInstitucion);
    // Aquí puedes agregar la lógica que desees para eliminar la institución, por ejemplo:
    // Realizar una solicitud DELETE para eliminar la institución de la base de datos
    fetch(`https://scitrackapi-production.up.railway.app/api/institucion/${idInstitucion}`, {
        method: "DELETE",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Institución eliminada:", data);
        // Eliminar la institución de la lista en la interfaz de usuario
        document.getElementById(`btn_select_${idInstitucion}`).parentElement.remove();
    })
    .catch((error) => console.error("Error al eliminar:", error));
}


