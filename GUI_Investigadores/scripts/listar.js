let PARTICIPANTS = [];

window.onload = function () 
{
    startLoad();
    fetch("https://scitrackapi-production.up.railway.app/api/ubicacion/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
          
        data.forEach(d => {
            console.log(d.nombre);
        });
        console.log(data);
        PARTICIPANTS = data;
        showUbicaciones();
        setUpButtons();
        endLoad();
    })
    .catch((error) => console.error("Error:", error));

}

function setUpButtons()
{
    const deleteButtons = document.getElementsByClassName('deleteBtn');
    for (let btn of deleteButtons) {
        btn.onclick = function (){
            deleteUbicacion(btn.id);
        }
    };

    const editButtons = document.getElementsByClassName('editBtn');
    for (let btn of editButtons) {
        btn.onclick = function (){
            editUbicacion(btn.id);
        }
    }
}

function deleteUbicacion(id)
{
    fetch(`https://scitrackapi-production.up.railway.app/api/ubicacion/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El ubicacion ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function editUbicacion(id)
{
    sessionStorage.setItem('sci:ubicacion_edit',id);
    window.location = "editar.html";
}

function showUbicaciones()
{
   
    const ubicacionesList = document.getElementById('listUbicaciones');


    ubicacionesList.innerHTML="";
    if (true)
    {
        PARTICIPANTS.forEach(p => {
            ubicacionesList.innerHTML = ubicacionesList.innerHTML + `
            <div class="studentDiv">
                <p>
                    Estado: ${p.estado} |
                    Municipio: ${p.ciudad} |
                    Colonia: ${p.colonia} |
                    Calle: ${p.calle} |
                    Numero: ${p.numero} |
                    Codigo Postal: ${p.codigoPostal}
                </p>
                <button class="editBtn" id="${p.idUbicacion}">Editar</button>
                <button class="deleteBtn" id="${p.idUbicacion}">Eliminar</button>
            </div>
            `;               
        });
    }
}


function startLoad()
{
    document.getElementsByTagName('block_by_loading')[0].className = "loading";
    document.getElementById('loading_gif').style.opacity = 1;
}

function endLoad()
{
    document.getElementsByTagName('block_by_loading')[0].className = "";
    document.getElementById('loading_gif').style.opacity = 0;
}