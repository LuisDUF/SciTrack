
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;
let institutionHasDependecy = false;

const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = [0,1,2,3,4,5,6,7,8,9];



let ADMIN = [];


const aInSession = sessionStorage.getItem('sci:administrador_in_session')
const aToEdit = sessionStorage.getItem('sci:administrador_to_edit')

const insertAdministrador = async (administrador) => {
    fetch("https://scitrackapi-production.up.railway.app/api/administrador/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({administrador}),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Se han enviado sus datos.');
        window.location.reload();
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };

window.onload = function () {
    const aInSession = sessionStorage.getItem('sci:administrador_in_session')
    const aToEdit = sessionStorage.getItem('sci:administrador_to_edit')

    alert("Id de sesion:"+aInSession);
    alert("Id de admin a modificar:"+aToEdit);
    /*if ( aToEdit == undefined)
    {
        window.location = 'listar_participantes.html';
    }*/


    fetch(`https://scitrackapi-production.up.railway.app/api/administrador/${aToEdit}`, {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {     
        ADMIN = data[0];  
        {
            inputName.value = ADMIN.nombre;
            inputApellidoP.value = ADMIN.apellidoPaterno;
            inputApellidoM.value = ADMIN.apellidoMaterno;
            inputEmail.value = ADMIN.correo;
            
            inputPassword.value = ADMIN.contrasenia;
            inputConfirmPassword.value = ADMIN.contrasenia;
        }
    })
    .catch((error) => console.error("Error:", error));
                
    
    const inputName = document.getElementById("inputNombre");
    const inputApellidoP = document.getElementById("inputApellidoP");
    const inputApellidoM = document.getElementById("inputApellidoM");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const inputConfirmPassword = document.getElementById("inputConfirmPassword");
    
    const txtPasswordAlert = document.getElementById('txtPasswordAlert');
    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
    const txtEmailAlert = document.getElementById('txtEmailAlert');
    
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores posteriormente.
    const inputs = [inputName,inputApellidoM,inputApellidoP,inputEmail,inputPassword,inputConfirmPassword];
    const btnConfirm = document.getElementById("btnConfirm");
    const btnEliminar = document.getElementById("btnEliminar");
    

    //Segmento que verifica que la contraseña sea valida, que tenga minimo 8 caracteres, minimo un número, y contenga algún caracter especial,
    inputPassword.onkeyup = function () {
        //Funcion para simulteamente verificar si el input de "verficar contraseñas" coincide
        checkConfirm(inputConfirmPassword);
        let allCorrect = true;
        if (inputPassword.value.length < 8)
        {
            txtPasswordAlert.innerHTML = "La contraseña debe tener al menos 8 digitos."; 
            passwordIssue = true;
            allCorrect = false;
        } 
        else
        if (!(includesFromArray(inputPassword.value,NUMBERS_PASSWORD) && includesFromArray(inputPassword.value,SPECIAL_CHARACTERS)))
        {
            txtPasswordAlert.innerHTML = "La contraseña debe tener al menos un caracter especial (#,$,%,&,@) y un numero (0-9).";
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
    //Verfica que el email sea valido
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
            txtEmailAlert.innerHTML="Ingrese un correo electrónico válido."
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

        
        if (success) txtConfirmAlert.innerHTML = "";

        if (success && !passwordIssue && !passwordIssueConfirm && !emailIssue)
        {
    
            //Se llama al metodo POST de la API en la tabla de administradores, sirviendo basicamente como un insert
            fetch(`https://scitrackapi-production.up.railway.app/api/administrador/${aToEdit}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre:inputName.value,
                    apellidoPaterno:inputApellidoP.value,
                    apellidoMaterno:inputApellidoM.value,
                    correo:inputEmail.value,
                    contrasenia:inputPassword.value,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                alert('Se han modificado los datos.');
                console.log(data);

                if(aInSession == 1){
                    sessionStorage.setItem('sci:administrador_in_session', aInSession);
                    window.location = "listar_administradores.html";
                }
                if(aInSession != 1){
                    sessionStorage.setItem('sci:administrador_in_session', aInSession);
                    window.location = "menu_administradores.html"; //NO CREADA AUN
                }
            })
            .catch((error) => console.error("Error:", error));
        }
            
           


        
    };
    //Funcion para eliminar el administrador
    btnEliminar.onclick = function()
    {
        fetch(`https://scitrackapi-production.up.railway.app/api/administrador/${aToEdit}`, {
            method: "DELETE",
        })
        .then((data) => {
            alert('El administrador ha sido eliminado');
            console.log("Data was deleted!");
            window.location.reload();
        })
        .catch((error) => console.error("Error:", error));
    };

  };

  function checkConfirm(inputConfirmPassword)
  {
        const txtConfirmPasswordAlert = document.getElementById("txtConfirmPasswordAlert");

        if (inputConfirmPassword.value != inputPassword.value)
        {
            txtConfirmPasswordAlert.innerHTML = "Las contraseñas no coinciden."; 
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


  // Regresar sin modificar (comentado hasta crear una pagina para regresar)
    function regresar() {
        
        if(aInSession == 1){
            sessionStorage.setItem('sci:administrador_in_session', aInSession);
            window.location.href = "listar_administradores.html";
        }

        if(aInSession != 1){
            sessionStorage.setItem('sci:administrador_in_session', aInSession);
            window.location.href = "menu_administradores.html"; //NO CREADA AUN
        }
    }