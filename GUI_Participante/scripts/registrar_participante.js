//Variables para verificar que no haya ningún problema con las contraseñas o correo (que no sean validos).
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;
let institutionHasDependecy = false;

const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = [0,1,2,3,4,5,6,7,8,9];
//Dado que la base de datos aún no existe, y dado que Node.js retorna los query como objeto. 
//la siguiente constante fungira como placeholder, que eventualmente se reemplazará con un arreglo
//que contenga un select.

let DEPENDENCIES = [];

let INSTITUTIONS = [];

let GENDERS = [];

const insertParticipant = async (participante) => {
    fetch("https://scitrackapi-production.up.railway.app/api/participante/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({participante}),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Se han enviado sus datos.');
        window.location.reload();
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  
//Los objetos anteriores siguen la misma estructura que las entidades correspondientes en la base de datos,
//Por lo que en teoria, se pueden eventualmente reemplazar con un query real sin conflictos.

window.onload = function () {
     //Se obtienen todas las instituciones desde la API
    fetch("https://scitrackapi-production.up.railway.app/api/institucion/", {
        method: "GET",
    })
    //Imporante recordar que lo que sea queramos hacer con el resultado del SELECT se debe hacer dentro del THEN
    .then((response) => response.json())
    .then((data) => {  
        data.forEach(d => {
              console.log(d.nombre);
        });
        console.log(data);
        INSTITUTIONS = data;
        INSTITUTIONS.forEach(ins =>{
              selectInstitution.innerHTML = selectInstitution.innerHTML + `
                  <option value="${ins.idInstitucion}">${ins.nombre}</option>
              `
        });
    })
    .catch((error) => console.error("Error:", error));

    //Se obtiene los generos desde la tabla genero con la API
    fetch("https://scitrackapi-production.up.railway.app/api/genero/", {
        method: "GET",
    })
    //Imporante recordar que lo que sea queramos hacer con el resultado del SELECT se debe hacer dentro del THEN
    .then((response) => response.json())
    .then((data) => {  
        data.forEach(d => {
              console.log(d.nombre);
        });
        console.log(data);
        GENDERS = data;
        GENDERS.forEach(ins =>{
              selectGender.innerHTML = selectGender.innerHTML + `
                  <option value="${ins.idGenero}">${ins.nombre}</option>
              `
        });
    })
    .catch((error) => console.error("Error:", error));
    
    //Se obtienen todas las dependencias desde la API
    fetch("https://scitrackapi-production.up.railway.app/api/dependencia/", {
        method: "GET",
    })
    //Imporante recordar que lo que sea queramos hacer con el resultado del SELECT se debe hacer dentro del THEN
    .then((response) => response.json())
    .then((data) => {     
        data.forEach(d => {
            console.log(d.nombre);
        });
            console.log(data);
            DEPENDENCIES = data;
        })
    .catch((error) => console.error("Error:", error));

    const inputName = document.getElementById("inputNombre");
    const inputApellidoP = document.getElementById("inputApellidoP");
    const inputApellidoM = document.getElementById("inputApellidoM");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const inputConfirmPassword = document.getElementById("inputConfirmPassword");
    const inputPhone = document.getElementById("inputPhone");
    const txtPasswordAlert = document.getElementById('txtPasswordAlert');
    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
    const txtEmailAlert = document.getElementById('txtEmailAlert');
    const dependecySection = document.getElementById('dependencySection');
    const selectInstitution = document.getElementById('selectInstitution');
    const selectDependency = document.getElementById('selectDependency');
    const selectGender = document.getElementById('selectGender');
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputName,inputApellidoM,inputApellidoP,inputEmail,inputPassword,inputConfirmPassword,inputPhone];
    const btnConfirm = document.getElementById("btnConfirm");
    //Esconde las dependencias, antes de que se seleccione una institución
    dependecySection.style.visibility='hidden';

    //Agrega las instituciones disponibles al select de instituciones

    selectInstitution.onchange = function (){
   
        selectDependency.innerHTML = `<option value="none">---</option>`
        const selection = selectInstitution.value;
        let someFound = false;
        
        DEPENDENCIES.forEach(ins =>{
            if (ins.Institucion_idInstitucion == selection)
            {
                someFound = true;
                institutionHasDependecy = true;
                dependecySection.style.visibility = 'visible';
                selectDependency.innerHTML = selectDependency.innerHTML + `
                <option value="${ins.idDependencia}">${ins.nombre}</option>
                `
            }
        });
        if (!someFound)
        {
            dependecySection.style.visibility = 'hidden';
            institutionHasDependecy = false;
        }
    }
   
    //Segmento que verifica que la contraseña sea valida, que tenga minimo 8 caracteres, minimo un número, y contenga algún caracter especial,
    inputPassword.onkeyup = function () {
        //Funcion para simulteamente verificar si el input de "verficar contraseñas" coincide
        checkConfirm(inputConfirmPassword);
        let allCorrect = true;
        if (inputPassword.value.length < 8)
        {
            txtPasswordAlert.innerHTML = "* La contraseña debe tener al menos 8 digitos"; 
            passwordIssue = true;
            allCorrect = false;
        } 
        else
        if (!(includesFromArray(inputPassword.value,NUMBERS_PASSWORD) && includesFromArray(inputPassword.value,SPECIAL_CHARACTERS)))
        {
            txtPasswordAlert.innerHTML = "* La contraseña debe tener al menos un caracter especial (#,$,%,&,@) y un numero (0-9)";
            passwordIssue = true;
            allCorrect = false;
        }
        if (allCorrect)
        {
            txtPasswordAlert.innerHTML = "";
            passwordIssue = false;
        }
    };
8
    //Verfica que el email sea valido, revisando que tenga almenos una dirección (es decir, que sea un texto@algo.algo)
    inputEmail.onkeyup = function () {
        let noIssues = false;
        if (inputEmail.value.includes("@"))
        {   
            if (inputEmail.value.split('@')[1].includes('.'))
            {
                noIssues = true;
            }
        }

        if (noIssues)
        {
            emailIssue = false;
            txtEmailAlert.innerHTML=""
        }

        else
        {
            emailIssue = true;
            txtEmailAlert.innerHTML="* Ingrese un correo electrónico válido"
        }
    };
    
    //Funcion para simulteamente verificar si el input de "verficar contraseñas" coincide con el input de contraseña
    inputConfirmPassword.onkeyup = function () {     checkConfirm(inputConfirmPassword)    };

    //Verifica que no haya campos vacios, y que no haya problema con el correo o contraseña, si es así, es exitoso el registro y se envia a un administrador.
    btnConfirm.onclick = function()
    {
        let success = true;
        inputs.every(i => {
            if (i.value == "")
            {
                
                txtConfirmAlert.innerHTML = "¡Debe llenar todos los campos correctamente!";
                success = false;
                return false;
            }
        });

        if (selectInstitution.value != "none" && selectGender.value != "none")
        {
            let continueConfirm = true;
            if (institutionHasDependecy)
            {
                if (selectDependency.value == "none") {continueConfirm = false;
                    txtConfirmAlert.innerHTML = "¡Debe seleccionar una dependencia!";
                }
            }

            if (continueConfirm)
            {
                if (success) txtConfirmAlert.innerHTML = "";

                if (success && !passwordIssue && !passwordIssueConfirm && !emailIssue)
                {
            
                    //Se llama al metodo POST de la API en la tabla de participante, sirviendo basicamente como un insert
                    fetch("https://scitrackapi-production.up.railway.app/api/participante/", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        //Se construye un objeto de participante con los datos que se introducen en la página
                        body: JSON.stringify({
                            nombre:inputName.value,
                            apellidoPaterno:inputApellidoP.value,
                            apellidoMaterno:inputApellidoM.value,
                            correo:inputEmail.value,
                            contrasenia:inputPassword.value,
                            telefono:inputPhone.value,
                            Dependencia_idDependencia:selectDependency.value,
                            Genero_idGenero:selectGender.value,
                        }),
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        alert('Se han enviado sus datos.');
                        window.location.reload();
                        console.log(data);
                    })
                    .catch((error) => console.error("Error:", error));
                }
            }
           
        }
        else
        {
            txtConfirmAlert.innerHTML = "¡Debe seleccionar una institución!";
        }

        
    };

  };

  function checkConfirm(inputConfirmPassword)
  {
        const txtConfirmPasswordAlert = document.getElementById("txtConfirmPasswordAlert");

        if (inputConfirmPassword.value != inputPassword.value)
        {
            txtConfirmPasswordAlert.innerHTML = "* Las contraseñas no coinciden"; 
            passwordIssueConfirm = true;
        }
        else
        {
            txtConfirmPasswordAlert.innerHTML = "";    
            passwordIssueConfirm = false;
        }
  }

  function includesFromArray(stringToSearch,array)
  {
    try
    {
        let foundElement = false;
        array.forEach(e => {
            if (stringToSearch.includes(e)) foundElement = true;
        });
        return foundElement;
    }
    catch (ex)
    {
        alert(ex)
    }
   
  }