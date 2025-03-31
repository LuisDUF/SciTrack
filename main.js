
       
   window.onload = function () {
    const inputInstitucion = document.getElementById("inputInstitucion");
    const inputDependencia = document.getElementById("inputDependencia");
    const btnEnviarInstitucion = document.getElementById("btnEnviarInstitucion");
    const btnEnviarDependencia = document.getElementById("btnEnviarDependencia");
    const btnBuscarDependencias = document.getElementById("btnBuscarDependencias");
    const inputIdInstitucion = document.getElementById("inputIdInstitucion");
    const inputIdInstitucionBusqueda = document.getElementById("inputBusquedaDependencias");

    const idListaDependencias = document.getElementById("lista-dependencias");
    

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

        if (inputIdInstitucion.value.trim() === "") {
            alert("Ingrese la id de la institucion a asignar");
            return;
        }

        fetch("https://scitrackapi-production.up.railway.app/api/dependencia/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: inputDependencia.value, Institucion_idInstitucion: inputIdInstitucion.value })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Dependencia registrada:", data);
            alert("Dependencia registrada exitosamente");
        })
        .catch(error => console.error("Error:", error));
    };

    btnBuscarDependencias.onclick = function () {

        vaciarLista(idListaDependencias.id)

        if (inputIdInstitucionBusqueda.value.trim() === "") {
            alert("Ingrese la ID a buscar de la institucion correspondiente a la dependencia");
            return;
        }

        fetch("https://scitrackapi-production.up.railway.app/api/dependencia/"+inputIdInstitucionBusqueda.value, {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            const result = document.getElementById("lista-dependencias");
            
            data.forEach(dependencia => {
                let fila = document.createElement("li");
                fila.innerHTML = `
    
                    ${dependencia.idDependencia}
    
                    ${dependencia.nombre} 
                    
                    <button id="btn_delete_${dependencia.idDependencia}" onclick="btnEliminarDependencia(${dependencia.idDependencia})">Eliminar</button>
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

                ${institucion.idInstitucion}

                ${institucion.nombre} 
                
                <button id="btn_delete_${institucion.idInstitucion}" onclick="btnEliminarInstitucion(${institucion.idInstitucion})">Eliminar</button>
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

function btnEliminarInstitucion(idInstitucion) {
    console.log("Botón 'Eliminar' presionado para la institución con id:", idInstitucion);

    fetch(`https://scitrackapi-production.up.railway.app/api/institucion/${idInstitucion}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log("Institución eliminada:", data);
        
        // Encontrar y eliminar el <li> que contiene el botón de eliminar
        const item = document.getElementById(`item_${idInstitucion}`);
        if (item) {
            item.remove();
        } else {
            console.error("No se encontró el elemento a eliminar en el DOM.");
        }
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function btnEliminarDependencia(idDependencia) {
    console.log("Botón 'Eliminar' presionado para la institución con id:", idDependencia);

    fetch(`https://scitrackapi-production.up.railway.app/api/institucion/${idDependencia}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log("Institución eliminada:", data);
        
        // Encontrar y eliminar el <li> que contiene el botón de eliminar
        const item = document.getElementById(`item_${idDependencia}`);
        if (item) {
            item.remove();
        } else {
            console.error("No se encontró el elemento a eliminar en el DOM.");
        }
    })
    .catch(error => console.error("Error al eliminar:", error));
}

function vaciarLista(idLista) {
    const lista = document.getElementById(idLista);
    if (lista) {
        lista.innerHTML = ""; // Elimina todos los elementos dentro de la lista
        console.log("Lista vaciada correctamente.");
    } else {
        console.error("No se encontró la lista con el ID proporcionado.");
    }
}