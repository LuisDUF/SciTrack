//Constantes que se usarán temporalmente, mientras no se tiene conexion a la BD
//import { TEAMS,PROJECTS,CONTESTS } from "./database_connection"


let PARTICIPANTS =
[
   
]

//Los objetos anteriores siguen la misma estructura que las entidades correspondientes en la base de datos,
//Por lo que en teoria, se pueden eventualmente reemplazar con un query real sin conflictos.

window.onload = function () 
{

    fetch("https://scitrackapi-production.up.railway.app/api/participante/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
          
        data.forEach(d => {
            console.log(d.nombre);
        });
        console.log(data);
        PARTICIPANTS = data;
        showParticipants();
        setUpButtons();
    })
    .catch((error) => console.error("Error:", error));

}

function setUpButtons()
{
    const deleteButtons = document.getElementsByClassName('deleteBtn');
    for (let btn of deleteButtons) {
        btn.onclick = function (){
            deleteParticipant(btn.id);
        }
    };

    const editButtons = document.getElementsByClassName('editBtn');
    for (let btn of editButtons) {
        btn.onclick = function (){
            editParticipant(btn.id);
        }
    }
}

function deleteParticipant(id)
{
    fetch(`https://scitrackapi-production.up.railway.app/api/participante/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El participante ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function editParticipant(id)
{
    sessionStorage.setItem('sci:participant_to_edit',id);
    window.location = "editar_participante.html";

    /*
    const elemento = ARREGLO.filter(e => {
        return e.atributo == valor
    });

    */
    /*
    fetch(`https://scitrackapi-production.up.railway.app/api/participante/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: "Alonzo Jesus",
          apellidoPaterno: "Hernandez",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.error("Error:", error));
    */
}

function showParticipants()
{
   
    const participantsList = document.getElementById('listParticipants');


    participantsList.innerHTML="";
    if (true)
    {
        PARTICIPANTS.forEach(p => {
            participantsList.innerHTML = participantsList.innerHTML + `
            <div class="studentDiv">
                <p>Nombre: ${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}</p>
                <button class="editBtn" id="${p.idParticipante}">Editar</button>
                <button class="deleteBtn" id="${p.idParticipante}">Eliminar</button>
            </div>
            `;               
        });
    }
}


function returnNewBody(p)
{
    const par = p[0];
    const newBody = `
    
    <p>Nombre(s):</p>
    <input type="text" id="inputNombre" placeholder="Ingrese su nombre o nombres..." value="${par.nombre}"/>

    <p>Apellido paterno:</p>
    <input type="text" id="inputApellidoP" placeholder="Ingrese su apellido paterno..." value="${par.apellidoPaterno}"/>

    <p>Apellido materno:</p>
    <input type="text" id="inputApellidoM" placeholder="Ingrese su apellido materno..." value="${par.apellidoMaterno}"/>

    <p>Correo electrónico:</p>
    <input type="text" id="inputEmail" placeholder="Ingrese su correo..." value="${par.correo}"/>
    <p id="txtEmailAlert"></p>

    <p>Contraseña:</p>
    <input type="password" id="inputPassword" placeholder="..." />
    <p id="txtPasswordAlert"></p>

    <p>Confirmar contraseña:</p>
    <input type="password" id="inputConfirmPassword" placeholder="..." />
    <p id="txtConfirmPasswordAlert"></p>

    <p>Teléfono:</p>
    <input type="number" id="inputPhone" placeholder="..." value="${par.telefono}" onkeydown="javascript: return event.keyCode == 69 ? false : true" />
    
    <br><br>
    <p>Genero:</p>
    <select id="selectGender">
        <option value="none">---</option>
    </select>

    <br><br>
    <p>Seleccione su institución:</p>
    <select id="selectInstitution">
        <option value="none">---</option>
    </select>

    <section id="dependencySection">
        <br><br>
        <p>Seleccione su dependencia:</p>
        <select id="selectDependency">
            <option value="none">---</option>
        </select>
    </section>
    
    <br><br>
    <button id="btnConfirm">Confirmar</button>
    <p id="txtConfirmAlert"></p>

    `;

    document.getElementById('scriptTag').src="scripts/registrar_participante.js";
    return newBody;
}