let ESTADOS = [];
let COLONIAS = [];
let MUNICIPIOS = [];
let currentUbicacion;


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
        const idUbicacion = sessionStorage.getItem('sci:ubicacion_edit');
        if (idUbicacion == undefined) window.location = "listar.html";
        //////////////////////////////////
        endLoad();
        
        setUpEstados(idUbicacion);
        const button = document.getElementById('btnConfirm');
        button.onclick = function ()
        {
            confirmRegister();
        }
    })
    .catch((error) => console.error("Error:", error));
}

function setUpEstados(idUbicacion)
{
    startLoad();

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

    fetch(`https://scitrackapi-production.up.railway.app/api/ubicacion/${idUbicacion}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        currentUbicacion = data[0];
        {
            const inputNumero = document.getElementById('inputNumero');
            const inputCalle = document.getElementById('inputCalle');
            const inputCodPos = document.getElementById('inputCodPos');

            inputNumero.value = currentUbicacion.numero;
            inputCalle.value = currentUbicacion.calle;
            inputCodPos.value = currentUbicacion.codigoPostal;
        }

        const currentEstado = ESTADOS.find(f => f.nombre == currentUbicacion.estado);
        selectEstado.value = currentEstado.idEstado;
        setUpMunicipios(currentEstado.idEstado);
    })

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
    
    
        selectMunicipio.onchange = function ()
        {
            const idMunicipio = selectMunicipio.value;
            if (idMunicipio != "none") setUpColonias(idMunicipio);   
        }

        const currentMunicipio = filtered.find(f => f.nombre == currentUbicacion.ciudad);
        if (currentMunicipio != undefined)
        {
            selectMunicipio.value = currentMunicipio.idMunicipio;
            setUpColonias(currentMunicipio.idMunicipio);
        }
        endLoad();
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

        const currentColonia = filtered.find(f => f.nombre == currentUbicacion.colonia);
        if (currentColonia != undefined)
        {
            selectColonia.value = currentColonia.idColonia;
        }

      
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

        fetch(`https://scitrackapi-production.up.railway.app/api/ubicacion/${currentUbicacion.idUbicacion}`, {
            method: "PUT",
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
            alert('Se ha modificado la ubicacion');
            window.location = "listar.html"

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