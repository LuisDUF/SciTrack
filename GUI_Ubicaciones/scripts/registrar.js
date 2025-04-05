let ESTADOS = [];
let COLONIAS = [];
let MUNICIPIOS = [];

window.onload = function (){
    document.getElementsByTagName('body')[0].className = "loading"
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
        fetch("https://scitrackapi-production.up.railway.app/api/municipio/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        .then((data) => {
            MUNICIPIOS = data;
            ///////////////////////////
            fetch("https://scitrackapi-production.up.railway.app/api/colonia/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => response.json())
            .then((data) => {
                COLONIAS = data;
                setUpEstados();
                document.getElementsByTagName('body')[0].className = "";
                const button = document.getElementById('btnConfirm');
                button.onclick = function ()
                {
                    confirmRegister();
                }
            })
            .catch((error) => console.error("Error:", error));
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}

function setUpEstados()
{
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
    const selectMunicipio = document.getElementById('selectMunicipio');

    selectMunicipio.innerHTML = `<option value="none">---</option>`;
   
    const filtered = MUNICIPIOS.filter(m=> m.Estado_idEstado == idEstado)
    
    filtered.forEach(e => {
        selectMunicipio.innerHTML += `<option value="${e.idMunicipio}">${e.nombre}</option>`;
    });

    selectMunicipio.onchange = function ()
    {
        const idMunicipio = selectMunicipio.value;
        if (idMunicipio != "none") setUpColonias(idMunicipio);   
    }
}

function setUpColonias(idMunicipio)
{
    const selectColonia = document.getElementById('selectColonia');

    selectColonia.innerHTML = `<option value="none">---</option>`;
   
    const filtered = COLONIAS.filter(m=> m.Municipio_idMunicipio == idMunicipio)
    
    filtered.forEach(e => {
        selectColonia.innerHTML += `<option value="${e.idMunicipio}">${e.nombre}</option>`;
    });
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
            alert('Faltan datos brothercito');
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

        
    }
}