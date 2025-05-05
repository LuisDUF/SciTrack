//Constantes que se usarán temporalmente, mientras no se tiene conexion a la BD
//import { TEAMS,PROJECTS,CONTESTS } from "./database_connection"


let CONVOCATORIAS =
[
   
]

//Los objetos anteriores siguen la misma estructura que las entidades correspondientes en la base de datos,
//Por lo que en teoria, se pueden eventualmente reemplazar con un query real sin conflictos.

window.onload = function () 
{

    fetch("http://localhost:3000/api/convocatoria/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
          
        data.forEach(d => {
            console.log(d.nombre);
        });
        console.log(data);
        CONVOCATORIAS = data;
        showConvocatorias();
        setUpButtons();
    })
    .catch((error) => console.error("Error:", error));

}

function setUpButtons()
{
    const deleteButtons = document.getElementsByClassName('deleteBtn');
    for (let btn of deleteButtons) {
        btn.onclick = function (){
            deleteConvocatoria(btn.id);
        }
    };

    const editButtons = document.getElementsByClassName('editBtn');
    for (let btn of editButtons) {
        btn.onclick = function (){
         
            editConvocatoria(btn.id);
        }
    }
}

function deleteConvocatoria(id)
{
    fetch(`http://localhost:3000/api/convocatoria/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('La convocatoria ha sido eliminada');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function editConvocatoria(id)
{
    sessionStorage.setItem('sci:convocatoria_to_edit',id);
    window.location = "editar_convocatoria.html";

    /*
    const elemento = ARREGLO.filter(e => {
        return e.atributo == valor
    });

    */
    /*
    fetch(`http://localhost:3000/api/participante/${id}`, {
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

function showConvocatorias()
{
   
    const listaConvocatorias = document.getElementById('listConvocatorias');


    listaConvocatorias.innerHTML="";
    if (true)
    {
        CONVOCATORIAS.forEach(p => {
            
            
            listaConvocatorias.innerHTML = listaConvocatorias.innerHTML + `
            <div class="studentDiv">
                <p>Nombre: ${p.nombre}</p>
                <p>Estado: ${p.estado}</p>
                <button class="editBtn" id="${p.idConvocatoria}">Editar</button>
                <button class="deleteBtn" id="${p.idConvocatoria}">Eliminar</button>
                <button class="phaseBtn" id="phase${p.idConvocatoria}">Definir Fases</button>
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