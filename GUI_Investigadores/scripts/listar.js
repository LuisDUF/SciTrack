let INVES = [];
let INSTITUCIONES = [];
let ARCHIVOS = [];
let DISCIPLINA = [];
let GRADO = [];
let GENEROS = [];
let ESTADOS = [];

window.onload = async function () {
    try {
        startLoad();

        const invesResponse = await fetch("https://scitrackapi-production.up.railway.app/api/investigador/");
        INVES = await invesResponse.json();

        const archivosResponse = await fetch("https://scitrackapi-production.up.railway.app/api/archivos/");
        ARCHIVOS = await archivosResponse.json();

        const gradoResponse = await fetch("https://scitrackapi-production.up.railway.app/api/gradodeestudios/");
        GRADO = await gradoResponse.json();

        const generoResponse = await fetch("https://scitrackapi-production.up.railway.app/api/genero/");
        GENEROS = await generoResponse.json();

        const institucionResponse = await fetch("https://scitrackapi-production.up.railway.app/api/institucion/");
        INSTITUCIONES = await institucionResponse.json();

        const disciplinaResponse = await fetch("https://scitrackapi-production.up.railway.app/api/disciplina/");
        DISCIPLINA = await disciplinaResponse.json();

        const estadoResponse = await fetch("https://scitrackapi-production.up.railway.app/api/estadopersona/");
        ESTADOS = await estadoResponse.json();

        showInvestigadores();
        setUpButtons();
        endLoad();

    } catch (error) {
        console.error("Error:", error);
    }
};


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
            const cuArchivos = ARCHIVOS.filter(obj => {return obj.Investigador_idInvestigador == p.idInvestigador});
            const cuEstado = ESTADOS.find(obj => {return obj.idEstadoPersona == p.EstadoPersona_idEstadoPersona});
            let archivoString = '';
            
            cuArchivos.forEach(c => {
                archivoString += `<button class="boton-con-imagen" onclick="mostrarPdf(${c.idArchivos})">${c.nombre}</button> <br>`
            });

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
                    <p>Archivos: </p>
                    ${archivoString}
                    <p>Estado: ${cuEstado.nombre}</p>
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

function mostrarPdf(id) {
    const archivo = ARCHIVOS.find(a => a.idArchivos === id);

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