let ESTADOS = [];
let COLONIAS = [];
let MUNICIPIOS = [];

window.onload = function (){
    startLoad()
    fetch("https://scitrackapi-production.up.railway.app/api/estado/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        ESTADOS = data;
        //////////////////////////////////
        setUpEstados();
        endLoad();
        const button = document.getElementById('btnConfirm');
        button.onclick = function ()
        {
            confirmRegister();
        }
    })
    .catch((error) => console.error("Error:", error));
}

function setUpEstados()
{
    startLoad()

    const selectEstado = document.getElementById('selectEstado');

    selectEstado.innerHTML = `<option value="none">---</option>`;
   
    ESTADOS.forEach(e => {
        selectEstado.innerHTML += `<option value="${e.idEstado}">${e.nombre}</option>`;
    });

    selectEstado.onchange = function ()
    {
        const idEstado = selectEstado.value;
        if (idEstado != "none") setUpMunicipios(idEstado);   
    }
}

function setUpMunicipios(idEstado)
{
    startLoad()

    const selectMunicipio = document.getElementById('selectMunicipio');
    const selectColonia = document.getElementById('selectColonia');

    selectMunicipio.innerHTML = `<option value="none">---</option>`;
    selectMunicipio.selectedIndex=0;

    selectColonia.innerHTML = `<option value="none">---</option>`;
    selectColonia.selectedIndex=0;
   
    let filtered = [];

    fetch(`https://scitrackapi-production.up.railway.app/api/municipio/${idEstado}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        filtered = data;
        filtered.forEach(e => {
            selectMunicipio.innerHTML += `<option value="${e.idMunicipio}">${e.nombre}</option>`;
        });
    
        endLoad();
    
        selectMunicipio.onchange = function ()
        {
            const idMunicipio = selectMunicipio.value;
            if (idMunicipio != "none") setUpColonias(idMunicipio);   
        }
    })
    .catch((error) => console.error("Error:", error));
}

function setUpColonias(idMunicipio)
{
    startLoad()

    const selectColonia = document.getElementById('selectColonia');

    selectColonia.innerHTML = `<option value="none">---</option>`;
    selectColonia.selectedIndex=0;

    let filtered = [];

    fetch(`https://scitrackapi-production.up.railway.app/api/colonia/${idMunicipio}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        filtered = data;
        filtered.forEach(e => {
            selectColonia.innerHTML += `<option value="${e.idColonia}">${e.nombre}</option>`;
        });
    
        endLoad();
    })
    .catch((error) => console.error("Error:", error));
}

function confirmRegister()
{
    const selectMunicipio = document.getElementById('selectMunicipio');
    const selectEstado = document.getElementById('selectEstado');
    const selectColonia = document.getElementById('selectColonia');
    const inputNumero = document.getElementById('inputNumero');
    const inputCalle = document.getElementById('inputCalle');
    const inputCodPos = document.getElementById('inputCodPos');

    const verifyArray = [selectColonia,selectEstado,selectMunicipio,inputCalle,inputCodPos,inputNumero];

    let missingData = false;

    verifyArray.every(v =>{
        if (v.value == undefined || v.value == "none" || v.value == "")
        {
            alert('Por favor, rellene todos los campos para registrar la ubicación');
            missingData = true;
            return false;
        }
        else return true;
    });

    if (missingData) return;
    else
    {
        const ubicacion = {
            colonia:selectColonia.options[selectColonia.selectedIndex].text,
            calle:inputCalle.value,
            ciudad:selectMunicipio.options[selectMunicipio.selectedIndex].text,
            numero:inputNumero.value,
            codigoPostal:inputCodPos.value,
            estado:selectEstado.options[selectEstado.selectedIndex].text,
        }
        fetch("https://scitrackapi-production.up.railway.app/api/ubicacion/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //Se construye un objeto de participante con los datos que se introducen en la página
            body: JSON.stringify({
                colonia:selectColonia.options[selectColonia.selectedIndex].text,
                calle:inputCalle.value,
                ciudad:selectMunicipio.options[selectMunicipio.selectedIndex].text,
                numero:inputNumero.value,
                codigoPostal:inputCodPos.value,
                estado:selectEstado.options[selectEstado.selectedIndex].text,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se ha registrado la ubicacion');
            window.location.reload();

        })
        .catch((error) => console.error("Error:", error));
        
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