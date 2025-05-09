
let ADMINISTRADOR = [];

let aInSession =1; //Uso temporal
window.onload = async function () {
    
    //const aInSession = sessionStorage.getItem('sci:administrador_in_session')
    
    alert("Id de sesion:"+aInSession);
    /*if ( aInSession == undefined)
    {
        window.location = 'listar_participantes.html';
    }*/

    // Obtener admins de la API (suponiendo que haya un endpoint)
    await fetch("https://scitrackapi-production.up.railway.app/api/administrador/", {
        method: "GET",
      })
        .then(response => response.json())
        .then(data => {
            ADMINISTRADOR = data;
            mostrarAdministrador(); 
        })
        .catch(error => console.error("Error al obtener admins:", error));
};

// Función para mostrar admins en la tabla
function mostrarAdministrador(filtrados = ADMINISTRADOR) {


    const table = document.querySelector("table");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");

    tbody.innerHTML += `

            
           <tr>
                <th>ID del administrador</th>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                
                ${
                    aInSession === 1 
                        ? `
                        <th>Acción</th>`
                        : ''
                }
            </tr>
        `;

    filtrados.forEach(administrador => {

        tbody.innerHTML += `

            
            <tr>
                <td>${administrador.idAdministrador}</td>
                <td>${administrador.nombre} ${administrador.apellidoPaterno}</td>
                <td>${administrador.correo}</td>
                
                ${
                    aInSession === 1 
                        ? `<td>
                            <button class="edit" onclick="modificarAdministrador(${administrador.idAdministrador})">Modificar</button>
                            <button class="delete" onclick="eliminarAdmin(${administrador.idAdministrador})">Eliminar</button>
                           </td>`
                        : ''
                }
            </tr>
        `;
    });
    table.appendChild(tbody);
}



// Función para buscar admins
function buscarAdministrador() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const adminsFiltrados = ADMINISTRADOR.filter(administrador => {

        const id_admin = ADMINISTRADOR.find(a => a.idAdministrador === administrador.idAdministrador);
        const id_a= id_admin ? `${id_admin.idAdministrador}` : "";
        
        const nombre = id_admin ? `${id_admin.nombre} ${id_admin.apellidoPaterno}` : "";
        const correo = id_admin ? `${id_admin.correo}` : "";

        

        return id_a.toLowerCase().includes(searchInput) ||
               nombre.toLowerCase().includes(searchInput) ||
               correo.toLowerCase().includes(searchInput);
    });

    mostrarAdministrador(adminsFiltrados);
}

// Función para eliminar admins
async function eliminarAdmin(id) {
    fetch(`https://scitrackapi-production.up.railway.app/api/administrador/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El administrador ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}


// Función para modificar administrador
function modificarAdministrador(id) {
    // Almacenar el ID del admin en sesion y el cual se va a modificar en sessionStorage para acceder en la página de modificación
    sessionStorage.setItem('sci:administrador_to_edit', id);
    sessionStorage.setItem('sci:administrador_in_session', aInSession);
    // Redirigir a la página de modificación
    window.location.href = "edit_administrador.html";
}

