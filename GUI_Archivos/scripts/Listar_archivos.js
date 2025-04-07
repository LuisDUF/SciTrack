
let ARCHIVO = [];

let aInSession =1; //Uso temporal
window.onload = async function () {
    
    //const aInSession = sessionStorage.getItem('sci:administrador_in_session')
    
    alert("Id de sesion:"+aInSession);
    /*if ( aInSession == undefined)
    {
        window.location = 'listar_participantes.html';
    }*/

    // Obtener admins de la API (suponiendo que haya un endpoint)
    await fetch("https://scitrackapi-production.up.railway.app/api/archivos/", {
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
            ARCHIVO = data;
            console.log(ARCHIVO);
            mostrarArchivo(); 
        })
        .catch(error => console.error("Error al obtener admins:", error));
};

// Función para mostrar admins en la tabla
function mostrarArchivo(filtrados = ARCHIVO) {
    const selectEntidad = document.getElementById("selectEntidad");

    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");

    tbody.innerHTML += `

            
           <tr>
                <th>ID del archivo</th>
                <th>Nombre</th>
                <th>Tamaño</th>
                <th>Fecha de ingreso</th>
                <th>Contenido</th>
                <th>Acción</th>
            </tr>
        `;

    filtrados.forEach(archivo => {

        tbody.innerHTML += `

            
            <tr>
                <td>${archivo.idArchivos}</td>
                <td>${archivo.nombre} </td>
                <td>${archivo.tamanio}</td>
                <td>${archivo.fechaIngreso}</td>
                <td>
                    <button class="boton-con-imagen" onclick="mostrarPdf(${archivo.idArchivos})">
                    <img src="logPdf.png" alt="Imagen" class="imagen-boton"></button>
                    
                </td>
                <td>
                    <button class="delete" onclick="eliminarArchivo(${archivo.idArchivos})">Eliminar</button>
                    
                </td>

            </tr>
        `;
    });
    table.appendChild(tbody);
}


// Función para buscar archivos
function buscarArchivo() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const archivosFiltrados = ARCHIVO.filter(archivo => {
        const id_archivo = `${archivo.idArchivos}`; // Aseguramos que el ID sea una cadena
        const nombre = archivo.nombre.toLowerCase();

        return id_archivo.includes(searchInput) || nombre.includes(searchInput);
    });

    mostrarArchivo(archivosFiltrados);
}

// Función para eliminar admins
async function eliminarArchivo(id) {
    fetch(`https://scitrackapi-production.up.railway.app/api/archivos/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El archivo ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function mostrarPdf(id) {
    const archivo = ARCHIVO.find(a => a.idArchivos === id);

    if (!archivo || !archivo.contenido || !archivo.contenido.data) {
        alert("El archivo no tiene contenido disponible o está mal formado.");
        return;
    }

    // Convertir el array de números a un Uint8Array
    const byteArray = new Uint8Array(archivo.contenido.data);

    // Crear un BLOB de tipo PDF
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crear una URL temporal para mostrar el PDF
    const objectURL = URL.createObjectURL(blob);

    // Abrir el PDF en una nueva pestaña con un iframe
    const pdfWindow = window.open("");
    pdfWindow.document.write(`
        <html>
            <head><title>Visualizador PDF</title></head>
            <body style="margin:0">
                <iframe width="100%" height="100%" src="${objectURL}" frameborder="0"></iframe>
            </body>
        </html>
    `);
}




