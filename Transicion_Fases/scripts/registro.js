let phaseCounter = 0;
const phases = [];
const conv_to_edit = sessionStorage.getItem('sci:conv_to_edit');

window.onload = function () {
    const inputNombre = document.getElementById("inputNombre");
    const inputModalidad = document.getElementById("inputModalidad");
    const inputDescripcion = document.getElementById("inputDescripcion");
    const inputIdUbicacion = document.getElementById("inputIdUbicacion");
    const btnAddPhase = document.getElementById("btnAddPhase");
    const btnConfirmPhases = document.getElementById('btnConfirmPhases');
    const inputCalificacion = document.getElementById("inputCalificacion");
    const containerPhases = document.getElementById('phasesAdded');

    if (conv_to_edit == undefined)
    {
        alert('ERROR: No se ha especificado una convocatoria a editar. Este mensaje nunca se tendría que ver');
        window.location.href = '../../GUI_Convocatorias/listar_convocatorias.html';
    }

    btnAddPhase.onclick = function () {
        const anioIn = document.getElementById('anioIn').value;
        const mesIn = document.getElementById('mesIn').value.padStart(2, '0');
        const diaIn = document.getElementById('diaIn').value.padStart(2, '0');
        const inputFechaInicio = `${anioIn}-${mesIn}-${diaIn}`;

        const anioFn = document.getElementById('anioFn').value;
        const mesFn = document.getElementById('mesFn').value.padStart(2, '0');
        const diaFn = document.getElementById('diaFn').value.padStart(2, '0');
        const inputFechaFin = `${anioFn}-${mesFn}-${diaFn}`;

        if (
            inputNombre.value === "" ||
            inputModalidad.value === "" ||
            anioIn === "" || mesIn === "" || diaIn === "" ||
            anioFn === "" || mesFn === "" || diaFn === "" ||
            inputDescripcion.value === ""
        ) {
            alert("Ingrese la información en todos los campos");
            return;
        }

        phaseCounter++;
        const phaseId = `phase-${phaseCounter}`;
        const div = document.createElement("div");
        div.id = phaseId;
        div.innerHTML = `
            <h2>${inputNombre.value}</h2>
            <p>Descripción: ${inputDescripcion.value}</p>
            <p>Modalidad: ${inputModalidad.value}</p>
            <p>Fecha de inicio: ${inputFechaInicio}</p>
            <p>Fecha de cierre: ${inputFechaFin}</p>
            <p>Calificación mínima: ${inputCalificacion.value}</p>
            <p>Ubicación: ${inputIdUbicacion.value || 'Sin ubicación'}</p>
            <button class="move-up">Subir</button>
            <button class="move-down">Bajar</button>
        `;

        div.querySelector('.move-up').onclick = function () {
            const prev = div.previousElementSibling;
            if (prev) {
                containerPhases.insertBefore(div, prev);
            }
        };

        div.querySelector('.move-down').onclick = function () {
            const next = div.nextElementSibling;
            if (next) {
                containerPhases.insertBefore(next, div);
            }
        };

        containerPhases.appendChild(div);

        {
            inputNombre.value = "";
            inputModalidad.value = "";
            inputDescripcion.value = "";
            inputIdUbicacion.value = "";
            inputCalificacion.value = "";
            containerPhases.value = "";
            document.getElementById('anioIn').value = "";
            document.getElementById('mesIn').value = "";
            document.getElementById('diaIn').value = "";

            document.getElementById('anioFn').value = "";
            document.getElementById('mesFn').value = "";
            document.getElementById('diaFn').value = "";
        }
    };

    btnConfirmPhases.onclick = function () {
        
        const phaseElements = containerPhases.children;
    
        for (let i = 0; i < phaseElements.length; i++) {
            const phaseDiv = phaseElements[i];
    

            //PARA POSTERIDAD Y NO OLVIDAR
            //Query selector sirve para obtener un elemento con base a su etiqueta, si agregas un . se busca con base a su nombre de clase
            //nth of type sirve para obtener varios elementos con la misma etiqueta, con base al orden en el que aparecen
            const nombre = phaseDiv.querySelector("h2")?.textContent || "";
            const descripcion = phaseDiv.querySelector("p:nth-of-type(1)")?.textContent.replace("Descripción: ", "") || "";
            const modalidad = phaseDiv.querySelector("p:nth-of-type(2)")?.textContent.replace("Modalidad: ", "") || "";
            const fechaInicio = phaseDiv.querySelector("p:nth-of-type(3)")?.textContent.replace("Fecha de inicio: ", "") || "";
            const fechaFin = phaseDiv.querySelector("p:nth-of-type(4)")?.textContent.replace("Fecha de cierre: ", "") || "";
            const calificacion = phaseDiv.querySelector("p:nth-of-type(5)")?.textContent.replace("Calificación mínima: ", "") || "";
            const ubicacion = phaseDiv.querySelector("p:nth-of-type(6)")?.textContent.replace("Ubicación: ", "") || "";
            
            phases.push({
                nombre,
                descripcion,
                modalidad,
                fechaInicio,
                fechaFin,
                calificacion,
                ubicacion
            });
        }
    
        console.log(phases);

        if (phaseElements.length > 0) printFiles();

    };
};

async function printFiles () {
    let i = 0;
    for (const phase of phases) {
        if (typeof phase.ubicacion != "number")
        {
            fetch("https://scitrackapi-production.up.railway.app/api/fase/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: phase.nombre,
                    modalidad: phase.modalidad,
                    fechaInicio: phase.fechaInicio,
                    fechaFin: phase.fechaFin,
                    descripcion: phase.descripcion,
                    calificacion_minima: phase.calificacion,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                i++;
                if (i == phases.length)
                {
                    window.location.reload();
                    alert('Se han registrado las fases correctamente')
                }
            })
            .catch((error) => console.error("Error:", error));
        }
        else
        {
            fetch("https://scitrackapi-production.up.railway.app/api/fase/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: phase.nombre,
                    modalidad: phase.modalidad,
                    fechaInicio: phase.fechaInicio,
                    fechaFin: phase.fechaFin,
                    descripcion: phase.descripcion,
                    calificacion_minima: phase.calificacion,
                    Ubicacion_idUbicacion: phase.ubicacion 
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                i++;
                if (i == phases.length)
                {
                    window.location.reload();
                    alert('Se han registrado las fases correctamente')
                }
            })
            .catch((error) => console.error("Error:", error));
        }
      
    }
  }