let INVES = [];
let INSTITUCIONES = [];
let ARCHIVOS = [];
let DISCIPLINA = [];
let GRADO = [];
let GENEROS = [];

window.onload = function () 
{
    startLoad();
    fetch("https://scitrackapi-production.up.railway.app/api/investigador/", {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        INVES = data;
        fetch("https://scitrackapi-production.up.railway.app/api/archivos/", {
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            ARCHIVOS = data;
            fetch("https://scitrackapi-production.up.railway.app/api/gradodeestudios/", {
                method: "GET",
            })
            .then((response) => response.json())
            .then((data) => {
                GRADO = data;
                fetch("https://scitrackapi-production.up.railway.app/api/genero/", {
                    method: "GET",
                })
                .then((response) => response.json())
                .then((data) => {
                    GENEROS = data;
                    fetch("https://scitrackapi-production.up.railway.app/api/institucion/", {
                        method: "GET",
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        INSTITUCIONES = data;
                        fetch("https://scitrackapi-production.up.railway.app/api/disciplina/", {
                            method: "GET",
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            DISCIPLINA = data;    
                            data.forEach(d => {
                                console.log(d.nombre);
                            });
                            console.log(data);
                            showInvestigadores();
                            setUpButtons();
                            endLoad();
                        })
                        .catch((error) => console.error("Error:", error));
                    })
                    .catch((error) => console.error("Error:", error));
                })
                .catch((error) => console.error("Error:", error));
            })
            .catch((error) => console.error("Error:", error));
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
            deleteInvestigador(btn.id);
        }
    };

    const editButtons = document.getElementsByClassName('editBtn');
    for (let btn of editButtons) {
        btn.onclick = function (){
            editInvestigador(btn.id);
        }
    }
}

function deleteInvestigador(id)
{
    fetch(`https://scitrackapi-production.up.railway.app/api/investigador/${id}`, {
        method: "DELETE",
    })
    .then((data) => {
        alert('El investigador ha sido eliminado');
        console.log("Data was deleted!");
        window.location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function editInvestigador(id)
{
    sessionStorage.setItem('sci:investigador_edit',id);
    window.location = "editar.html";
}

function showInvestigadores()
{
   
    const investigadoresList = document.getElementById('listInvestigadores');


    investigadoresList.innerHTML="";
    if (true)
    {
        INVES.forEach(p => {
    
            const cuGenero = GENEROS.find(obj => {return obj.idGenero == p.Genero_idGenero});
            const cuDisciplina = DISCIPLINA.find(obj => {return obj.idDisciplina == p.Disciplina_idDisciplina});
            const cuGrado = GRADO.find(obj => {return obj.idGradoDeEstudios == p.GradoDeEstudios_idGradoDeEstudios});
            const cuInstitucion = INSTITUCIONES.find(obj => {return obj.idInstitucion == p.Institucion_idInstitucion});

            investigadoresList.innerHTML = investigadoresList.innerHTML + `
            <details class="studentDiv">
            <summary>${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}</summary>
                <h3>Datos Generales</h3>
                    <p>Nombre: ${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}</p>
                    <p>Correo: ${p.correo}</p>
                    <p>Telefono: ${p.telefono}</p>
                    <p>Disciplina: ${cuDisciplina.nombre}</p>
                    <p>Grado de Estudios: ${cuGrado.nombre}</p>
                    <p>Institucion: ${cuInstitucion.nombre}</p>
                    <p>Edad: ${p.edad}</p>
                    <p>CURP: ${p.curp}</p>
                    <p>RFC: ${p.rfc}</p>
                <h3>Datos Personales</h3>
                    <p>Genero: ${cuGenero.nombre}</p>
                    <p>Estado Civil: ${p.estadoCivil}</p>
                    <p>Nacionalidad: ${p.nacionalidad}</p>
                    <p>Estado: ${p.estado}</p>
                    <p>Municipio: ${p.municipio}</p>
                    <p>Domicilio: ${p.domicilio}</p>
                    <p>Telefono: ${p.telefono}</p>
                <button class="editBtn" id="${p.idInvestigador}">Editar</button>
                <button class="deleteBtn" id="${p.idInvestigador}">Eliminar</button>
            </details>
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