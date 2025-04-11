let INVES = [];
let INSTITUCIONES = [];
let ARCHIVOS = [];
let DISCIPLINA = [];
let GRADO = [];
let GENEROS = [];
let ESTADOSP= [];
let PAISES = [];
let ESTADOS = [];
let COLONIAS = [];
let MUNICIPIOS = [];

const specialCharacters = ["#","$","%","&"];
const neededNumbers = [0,1,2,3,4,5,6,7,8,9];

window.onload = async function (){
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

        const estadoPResponse = await fetch("https://scitrackapi-production.up.railway.app/api/estadopersona/");
        ESTADOSP = await estadoPResponse.json();

        const estadoResponse = await fetch("https://scitrackapi-production.up.railway.app/api/estado/");
        ESTADOS = await estadoResponse.json();

        const paisResponse = await fetch("https://scitrackapi-production.up.railway.app/api/pais/");
        PAISES = await paisResponse.json();

        const municipioResponse = await fetch("https://scitrackapi-production.up.railway.app/api/municipio/");
        MUNICIPIOS = await municipioResponse.json();
        const btnConfirm = document.getElementById('btnConfirm');
        btnConfirm.onclick = function ()
        {
            sendData();
        }

        loadData();
        endLoad();

    } catch (error) {
        console.error("Error:", error);
    }
}

function loadData()
{
    const inputNombre = document.getElementById('inputNombre');
    const inputApellidoPaterno = document.getElementById('inputApellidoPaterno');
    const inputApellidoMaterno = document.getElementById('inputApellidoMaterno');
    const inputCorreo = document.getElementById('inputCorreo');
    const inputNumbers = document.getElementById('inputNumbers');
    const inputEdad = document.getElementById('inputEdad');
    const selectPais = document.getElementById('selectPais');
    const selectEstado = document.getElementById('selectEstado');
    const selectMunicipio = document.getElementById('selectMunicipio');
    const inputDomicilio = document.getElementById('inputDomicilio');
    const inputCurp = document.getElementById('inputCurp');
    const inputRfc = document.getElementById('inputRfc');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const selectDisciplina = document.getElementById('selectDisciplina');
    const selectInstitucion = document.getElementById('selectInstitucion');
    const selectGrado = document.getElementById('selectGrado');
    const selectGenero = document.getElementById('selectGenero');
    const btnConfirm = document.getElementById('btnConfirm');
    const txtConfirmAlert = document.getElementById('txtConfirmAlert');

    //Fill selects
    {
        selectPais.innerHTML = `<option value="none">---</option>`;
        PAISES.forEach(a =>{
            selectPais.innerHTML += `<option value="${a.idPais}">${a.nombre}</option>`;
        })

        /*
        selectEstado.innerHTML = `<option value="none">---</option>`;
        ESTADOS.forEach(a =>{
            selectEstado.innerHTML += `<option value="${a.idEstado}">${a.nombre}</option>`;
        })
          
        selectMunicipio.innerHTML = `<option value="none">---</option>`;
        MUNICIPIOS.forEach(a =>{
            selectMunicipio.innerHTML += `<option value="${a.idMunicipio}">${a.nombre}</option>`;
        })
        */

        selectDisciplina.innerHTML = `<option value="none">---</option>`;
        DISCIPLINA.forEach(a =>{
            selectDisciplina.innerHTML += `<option value="${a.idDisciplina}">${a.nombre}</option>`;
        })

        selectInstitucion.innerHTML = `<option value="none">---</option>`;
        INSTITUCIONES.forEach(a =>{
            selectInstitucion.innerHTML += `<option value="${a.idInstitucion}">${a.nombre}</option>`;
        })

        selectGrado.innerHTML = `<option value="none">---</option>`;
        GRADO.forEach(a =>{
            selectGrado.innerHTML += `<option value="${a.idGrado}">${a.nombre}</option>`;
        })

        selectGenero.innerHTML = `<option value="none">---</option>`;
        GENEROS.forEach(a =>{
            selectGenero.innerHTML += `<option value="${a.idGenero}">${a.nombre}</option>`;
        })

      
    }

}

function sendData()
{
    const inputNombre = document.getElementById('inputNombre');
    const inputApellidoPaterno = document.getElementById('inputApellidoPaterno');
    const inputApellidoMaterno = document.getElementById('inputApellidoMaterno');
    const inputCorreo = document.getElementById('inputCorreo');
    const inputNumbers = document.getElementById('inputNumbers');
    const inputEdad = document.getElementById('inputEdad');
    const selectPais = document.getElementById('selectPais');
    const selectEstado = document.getElementById('selectEstado');
    const selectMunicipio = document.getElementById('selectMunicipio');
    const inputDomicilio = document.getElementById('inputDomicilio');
    const inputCurp = document.getElementById('inputCurp');
    const inputRfc = document.getElementById('inputRfc');
    const inputPassword = document.getElementById('inputPassword');
    const inputConfirmPassword = document.getElementById('inputConfirmPassword');
    const selectDisciplina = document.getElementById('selectDisciplina');
    const selectInstitucion = document.getElementById('selectInstitucion');
    const selectGrado = document.getElementById('selectGrado');
    const selectGenero = document.getElementById('selectGenero');

    const inputElements = [
        inputNombre,
        inputApellidoPaterno,
        inputApellidoMaterno,
        inputCorreo,
        inputNumbers,
        inputEdad,
        inputDomicilio,
        inputCurp,
        inputRfc,
        inputPassword,
        inputConfirmPassword,
        selectPais,
        selectEstado,
        selectMunicipio,
        selectDisciplina,
        selectInstitucion,
        selectGrado,
        selectGenero
    ];
    let haltOperation = false;

    for (let e in inputElements)
    {
        const element = inputElements[e];
        if (element.value == "" || element.value == "none") 
        {
            sendTxtAlert('Necesita llenar todos los campos para continuar');
            e = inputElements.length;
            haltOperation = true;
        }
    }
    
    const passwordValue = inputPassword.value;
    let passwordCorrect;
    passwordCorrect = specialCharacters.some(r => passwordValue.includes(r)) && neededNumbers.some(r => passwordValue.includes(r)) && passwordValue.length >= 8;


    if (!passwordCorrect) 
    {
        sendTxtAlert('Las contraseña debe contener por lo menos un numero, un caracter especial (#,$,%,&), y tener por lo menos 8 caracteres');
        haltOperation = true;
    }

    if (inputPassword.value != inputConfirmPassword.value) 
    {
        sendTxtAlert('Las contraseñas no coinciden');
        haltOperation = true;
    }

    if (!haltOperation)
    {
        
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

async function sendTxtAlert(text)
{
    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
    txtConfirmAlert.innerHTML = text;
    setTimeout(()=>{
        txtConfirmAlert.innerHTML = "";
    },3000);
}