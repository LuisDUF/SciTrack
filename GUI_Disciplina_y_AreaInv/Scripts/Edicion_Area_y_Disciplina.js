window.onload = function(){
    listar_Areas()
    listar_Disciplinas()

    const inputNombreArea = document.getElementById("inputNombreArea");
    const inputNombreDis = document.getElementById("inputNombreDis");
    const inputNombreSubdis = document.getElementById("inputNombreSubdis");
    const inputIdArea = document.getElementById("inputIdArea");
    const inputIdAreaEd = document.getElementById("inputIdAreaEd");
    const inputIdDisciplina = document.getElementById("inputIdDisciplina");
    const btnConfirmArea = document.getElementById("btnConfirmArea");
    const btnConfirmDis = document.getElementById("btnConfirmDis");
    
  
    btnConfirmArea.onclick = function () {
        
        // Validar campos
        if (
            inputNombreArea.value === "" || inputIdAreaEd.value === ""
        ) {
            alert("Ingrese la información en todos los campos");
            return;
        }
  
        // Enviar datos
        fetch("https://scitrackapi-production.up.railway.app/api/areaDeConocimientoInv/"+inputIdAreaEd.value, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: inputNombreArea.value, 
            }),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

    btnConfirmDis.onclick = function () {
        
        // Validar campos
        if (
            inputNombreDis.value === "" ||
            inputNombreSubdis.value === ""||
            inputIdArea.value === "" ||
            inputIdDisciplina.value === "" 
        ) {
            alert("Ingrese la información en todos los campos");
            return;
        }
  
        // Enviar datos
        fetch("https://scitrackapi-production.up.railway.app/api/disciplina/"+inputIdDisciplina.value, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: inputNombreDis.value,
                subdisciplina: inputNombreSubdis.value,
                AreaDeConocimientoInv_idAreaDeConocimientoInv: inputIdArea.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
            })
            .catch((error) => console.error("Error:", error));
    };

}


function listar_Areas() {
    fetch("https://scitrackapi-production.up.railway.app/api/areaDeConocimientoInv/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const cuerpoTabla = document.querySelector("#tabla-Areas tbody");
        cuerpoTabla.innerHTML = ""; // Limpiar contenido previo

        data.forEach(areaDeConocimientoInv => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${areaDeConocimientoInv.idAreaDeConocimientoInv}</td>
                <td>${areaDeConocimientoInv.nombre}</td>
                <td style="border: none;"><button id="btn_delete_${areaDeConocimientoInv.idAreaDeConocimientoInv}" onclick="btnEliminarAreaInv(${areaDeConocimientoInv.idAreaDeConocimientoInv})">Eliminar</button></td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Areas cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar las Areas:", error));
}

function listar_Disciplinas() {
    fetch("https://scitrackapi-production.up.railway.app/api/disciplina/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        const cuerpoTabla = document.querySelector("#tabla-Disciplinas tbody");
        cuerpoTabla.innerHTML = ""; // Limpiar contenido previo

        data.forEach(disciplina => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${disciplina.idDisciplina}</td>
                <td>${disciplina.nombre}</td>
                <td>${disciplina.subdisciplina}</td>
                <td>${disciplina.AreaDeConocimientoInv_idAreaDeConocimientoInv}</td>
                <td style="border: none;"><button id="btn_delete_${disciplina.idDisciplina}" onclick="btnEliminarDisciplina(${disciplina.idDisciplina})">Eliminar</button></td>
            `;
            cuerpoTabla.appendChild(fila);
        });

        console.log("Areas cargadas:", data);
    })
    .catch((error) => console.error("Error al cargar las Areas:", error));
}

function btnEliminarDisciplina(idDisciplina) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta Área de Conocimiento?")) {
        return;
    }

    console.log("Botón 'Eliminar' presionado para la Área con id:", idDisciplina);

    fetch(`https://scitrackapi-production.up.railway.app/api/disciplina/${idDisciplina}`, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        console.log("Disciplina eliminada:", data);
        window.location.reload();
    })
    .catch(error => {
        console.error("Error al eliminar:", error);

/*        if (error.message.toLowerCase().includes("disciplina")) {
            alert("Primero elimina la disciplina");
        } else {
            alert("Error al eliminar el Área de Conocimiento");
        }*/
        window.location.reload();
    });
}

function btnEliminarAreaInv(idAreaDeConocimientoInv) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta Área de Conocimiento?")) {
        return;
    }

    console.log("Botón 'Eliminar' presionado para la Área con id:", idAreaDeConocimientoInv);

    fetch(`https://scitrackapi-production.up.railway.app/api/areaDeConocimientoInv/${idAreaDeConocimientoInv}`, {
        method: "DELETE",
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
    })
    .then(data => {
        console.log("Área de Conocimiento eliminada:", data);
        window.location.reload();
    })
    .catch(error => {
        console.error("Error al eliminar:", error);

/*        if (error.message.toLowerCase().includes("disciplina")) {
            alert("Primero elimina la disciplina");
        } else {
            alert("Error al eliminar el Área de Conocimiento");
        }*/
        window.location.reload();
    });
}