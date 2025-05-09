//Constantes que se usarán temporalmente, mientras no se tiene conexion a la BD
//import { TEAMS,PROJECTS,CONTESTS } from "./database_connection"


let RUBRICAS =
[
   
]
var criterios = [];

//Los objetos anteriores siguen la misma estructura que las entidades correspondientes en la base de datos,
//Por lo que en teoria, se pueden eventualmente reemplazar con un query real sin conflictos.

window.onload = function () 
{
    
    document.getElementById("crearRubrica_div").hidden = true;
    fetch("https://scitrackapi-production.up.railway.app/api/rubrica/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
          
        data.forEach(d => {
            console.log(d.descripcion);
        });
        console.log(data);
        RUBRICAS = data;
        fetch("https://scitrackapi-production.up.railway.app/api/criterio/",{
            method: "GET",
        })
            .then((response) => response.json())
            .then((data2) => {
            console.log(data2);
            criterios = data2;
            showRubricas();
            setUpButtons();
            })
            .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}

function setUpButtons()
{
    const deleteButtons = document.getElementsByClassName('deleteBtn');
    for (let btn of deleteButtons) {
        btn.onclick = function (){
            deleteRubrica(btn.id);
        }
    };

    const editButtons = document.getElementsByClassName('editBtn');
    for (let btn of editButtons) {
        btn.onclick = function (){
         
            editRubrica(btn.id);
        }
    }
}

function deleteRubrica(id)
{
    fetch(`https://scitrackapi-production.up.railway.app/api/rubrica/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('La rubrica ha sido eliminada');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function editRubrica(id)
{
    sessionStorage.setItem('sci:rubrica_to_edit',id);
    window.location = "editar_rubrica.html";
}

function showRubricas()
{
   
    const listaRubricas = document.getElementById('listRubricas');


    listaRubricas.innerHTML="";
    if (true)
    {
        RUBRICAS.forEach(p => {
            
            
            listaRubricas.innerHTML = listaRubricas.innerHTML + `
            <div class="studentDiv">
                <p>Descripcion: ${p.descripcion}</p>
                <ol id="listaCriterios${p.idRubrica}"></ol>
                <button class="editBtn" id="${p.idRubrica}">Editar</button>
                <button class="deleteBtn" id="${p.idRubrica}">Eliminar</button>
                <br>
                
            </div>
            `;
            
            
            criterios.forEach(criterio => {
                if(p.idRubrica==criterio.Rubrica_idRubrica){
                var listaCriterios= document.getElementById("listaCriterios"+p.idRubrica)
                let fila = document.createElement("li");
                    fila.innerHTML= `
                        ${criterio.descripcion}:     ${criterio.ponderacion}%
                    `;
                    listaCriterios.appendChild(fila);
                }
            });


        });
    }

    

    
}


function crearRubrica(){
    document.getElementById("crearRubrica_div").hidden = false;
    let listaAreas= document.getElementById("listaAreas");
    fetch("https://scitrackapi-production.up.railway.app/api/areadeconocimientocat/",{
        method: "GET",
    })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
            data.forEach(area => {
                listaAreas.innerHTML += `
                <option value="${area.idAreaDeConocimientoCat}">${area.nombre}</option>
            `;
            });
            
        })
        .catch((error) => console.error("Error:", error));
}
var criteriosNew = [];
function agregarCriterio(){
    let descripcionC = document.getElementById("inputDescripcion_criterio");
    let ponderacion = document.getElementById("inputPonderacion");
    criteriosNew.push(
        {
            descripcion:descripcionC.value,
            ponderacion: Number(ponderacion.value)
        }
    );
    descripcionC.value = null;
    ponderacion.value = null;
    alert("Guardado con éxito");
}

function guardarRubrica(){
    let descripcion = document.getElementById("inputDescripcion");
    let listaAreas= document.getElementById("listaAreas");
    
    fetch("https://scitrackapi-production.up.railway.app/api/rubrica/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            descripcion: descripcion.value,
            AreaDeConocimientoCat_idAreaDeConocimientoCat: Number(listaAreas.value),
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        criteriosNew.forEach(criterio => {
          
            fetch("https://scitrackapi-production.up.railway.app/api/criterio/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                
                body: JSON.stringify({
                    descripcion: criterio.descripcion,
                    ponderacion: criterio.ponderacion,
                    Rubrica_idRubrica: data.idRubrica,
                }),
            })
                .then((response) => response.json())
                .then((data2) => {
                console.log(data2);
                location.reload();
                })
                .catch((error) => console.error("Error:", error));
        });
        
        })
        .catch((error) => console.error("Error:", error));
        
}