let AREAS = [];
let DISCIPLINAS = [];
let GRADOS = [];

window.onload = function (){
    startLoad()
    fetch("https://scitrackapi-production.up.railway.app/api/areadeconocimientoinv/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        AREAS = data;
        fetch("https://scitrackapi-production.up.railway.app/api/disciplina/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => response.json())
        .then((data) => {
            DISCIPLINAS = data;
            fetch("https://scitrackapi-production.up.railway.app/api/gradodeestudios/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => response.json())
            .then((data) => {
                GRADOS = data;
                //////////////////////////////////
                //setUpGrados();
                endLoad();
                const btnConfirmDelGrd = document.getElementById('btnConfirmDelGrd');
                const btnConfirmGrd = document.getElementById('btnConfirmGrd');
                const btnAddGrd = document.getElementById('btnAddGrd');

                const btnConfirmDelAre = document.getElementById('btnConfirmDelAre');
                const btnConfirmAre = document.getElementById('btnConfirmAre');
                const btnAddAre = document.getElementById('btnAddAre');
              
                const selectGrado = document.getElementById('selectGrado');
                const selectArea = document.getElementById('selectArea');

                setUpValuesAre();
                setUpValuesGrd();

                btnConfirmGrd.onclick = function ()
                {
                    editGrado();
                }

                btnConfirmDelGrd.onclick = function ()
                {
                    deleteGrado();
                }
                btnAddGrd.onclick = function ()
                {
                    addGrado();
                }

                btnConfirmAre.onclick = function ()
                {
                    editArea();
                }

                btnConfirmDelAre.onclick = function ()
                {
                    deleteArea();
                }

                btnAddAre.onclick = function ()
                {
                    addArea();
                }

                selectGrado.onchange = function ()
                {
                    setUpGrdInputs();
                }

                selectArea.onchange = function ()
                {
                    setUpAreInputs();
                }
            })
            .catch((error) => console.error("Error:", error));
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}

function setUpGrdInputs()
{
    const btnConfirmDelGrd = document.getElementById('btnConfirmDelGrd');
    const btnConfirmGrd = document.getElementById('btnConfirmGrd');
    const btnAddGrd = document.getElementById('btnAddGrd');
    btnConfirmGrd.style.display = "none";
    btnConfirmDelGrd.style.display = "none";

    const inputGrado = document.getElementById('inputGrado');
    const selectGrado = document.getElementById('selectGrado');

    if (selectGrado.value == "none")
        {
            
            btnAddGrd.style.display = "inline";
            btnConfirmGrd.style.display = "none";
            btnConfirmDelGrd.style.display = "none";
            inputGrado.value = "";

        }
        else
        {

            btnAddGrd.style.display="none";
            btnConfirmDelGrd.style.display = "inline";
            btnConfirmGrd.style.display = "inline";
            inputGrado.value = selectGrado.options[selectGrado.selectedIndex].text;
        }
}

function setUpAreInputs()
{
    const btnConfirmDelAre = document.getElementById('btnConfirmDelAre');
    const btnConfirmAre = document.getElementById('btnConfirmAre');
    const btnAddAre = document.getElementById('btnAddAre');
    btnConfirmAre.style.display = "none";
    btnConfirmDelAre.style.display = "none";

    const inputArea = document.getElementById('inputArea');
    const selectArea = document.getElementById('selectArea');

    if (selectArea.value == "none")
        {
            
            btnAddAre.style.display = "inline";
            btnConfirmAre.style.display = "none";
            btnConfirmDelAre.style.display = "none";
            inputArea.value = "";

        }
        else
        {

            btnAddAre.style.display="none";
            btnConfirmDelAre.style.display = "inline";
            btnConfirmAre.style.display = "inline";
            inputArea.value = selectArea.options[selectArea.selectedIndex].text;
        }
}
function setUpValuesAre()
{
    startLoad();

    fetch("https://scitrackapi-production.up.railway.app/api/areadeconocimientoinv/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        AREAS = data;
        const selectArea = document.getElementById('selectArea');

        selectArea.innerHTML = `<option value="none">---</option>`;
    
        AREAS.forEach(e => {
            selectArea.innerHTML += `<option value="${e.idAreaDeConocimientoInv}">${e.nombre}</option>`;
        });
        setUpAreInputs();

        endLoad();

    })
    .catch((error) => console.error("Error:", error));    
    
}

function setUpValuesGrd()
{
    startLoad();

    fetch("https://scitrackapi-production.up.railway.app/api/gradodeestudios/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => response.json())
    .then((data) => {
        GRADOS = data;
        const selectGrado = document.getElementById('selectGrado');

        selectGrado.innerHTML = `<option value="none">---</option>`;
    
        GRADOS.forEach(e => {
            selectGrado.innerHTML += `<option value="${e.idGradoDeEstudios}">${e.nombre}</option>`;
        });
        setUpGrdInputs();

        endLoad();

    })
    .catch((error) => console.error("Error:", error));    


    
}

function editGrado()
{
    const input = document.getElementById('inputGrado');
    const selectGrado = document.getElementById('selectGrado');

    if (input.value.length < 4)
    {
        alert("El grado debe tener al menos 4 caracteres");
    }
    else if (input.value == selectGrado.options[selectGrado.selectedIndex].text)
    {
        alert("El nombre del grado debe ser diferente");
    }
    else
    {
        const grado = selectGrado.value;
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/gradodeestudios/${grado}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            //Se construye un objeto de participante con los datos que se introducen en la página
            body: JSON.stringify({
                nombre:text
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se ha modificado la información');
            input.value="";
            setUpValuesGrd();
            

        })
        .catch((error) => console.error("Error:", error));
    }
}

function deleteGrado()
{
    const input = document.getElementById('inputGrado');
    const selectGrado = document.getElementById('selectGrado');

    {
        const grado = selectGrado.value;
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/gradodeestudios/${grado}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
        })
        .then((data) => {
            alert('Se ha borrado la información');
            input.value="";
            setUpValuesGrd();
            

        })
        .catch((error) => console.error("Error:", error));
    }
}

function addGrado()
{
    const input = document.getElementById('inputGrado');
    const selectGrado = document.getElementById('selectGrado');
    let coincidence = false;
    for (let i = 0; i < selectGrado.options.length; i++)
    {
        if (selectGrado.options[i].text == input.value)
        {
            coincidence = true;
        }
    }

    if (input.value.length < 4)
    {
        alert("El grado debe tener al menos 4 caracteres");
    }
    else
    if (coincidence)
    {
        alert("Ya hay un grado registrado con el mismo nombre");
    }
    else
    {
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/gradodeestudios/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //Se construye un objeto de participante con los datos que se introducen en la página
            body: JSON.stringify({
                nombre:text
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se ha agregado la información');
            input.value="";
            setUpValuesAre();
        })
        .catch((error) => console.error("Error:", error));
    }
}

function editArea()
{
    const input = document.getElementById('inputArea');
    const selectArea = document.getElementById('selectArea');

    if (input.value.length < 4)
    {
        alert("El area debe tener al menos 4 caracteres");
    }
    else if (input.value == selectArea.options[selectArea.selectedIndex].text)
    {
        alert("El nombre del area debe ser diferente");
    }
    else
    {
        const area = selectArea.value;
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/areadeconocimientoinv/${area}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            //Se construye un objeto de participante con los datos que se introducen en la página
            body: JSON.stringify({
                nombre:text
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se ha modificado la información');
            input.value="";
            setUpValuesAre();
            

        })
        .catch((error) => console.error("Error:", error));
    }
}

function deleteArea()
{
    const input = document.getElementById('inputArea');
    const selectArea = document.getElementById('selectArea');

    {
        const area = selectArea.value;
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/areadeconocimientoinv/${area}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
        })
        .then((data) => {
            alert('Se ha borrado la información');
            input.value="";
            setUpValuesAre();
            

        })
        .catch((error) => console.error("Error:", error));
    }
}

function addArea()
{
    const input = document.getElementById('inputArea');
    const selectArea = document.getElementById('selectArea');
    let coincidence = false;
    for (let i = 0; i < selectArea.options.length; i++)
    {
        if (selectArea.options[i].text == input.value)
        {
            coincidence = true;
        }
    }

    if (input.value.length < 4)
    {
        alert("El area debe tener al menos 4 caracteres");
    }
    else
    if (coincidence)
    {
        alert("Ya hay un area registrado con el mismo nombre");
    }
    else
    {
        const text = input.value;
        startLoad();

        fetch(`https://scitrackapi-production.up.railway.app/api/areadeconocimientoinv/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //Se construye un objeto de participante con los datos que se introducen en la página
            body: JSON.stringify({
                nombre:text
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Se ha agregado la información');
            input.value="";
            setUpValuesAre();
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