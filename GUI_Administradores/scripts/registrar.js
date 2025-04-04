
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;


const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = [0,1,2,3,4,5,6,7,8,9];



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



    const inputName = document.getElementById("inputNombre");
    const inputApellidoP = document.getElementById("inputApellidoP");
    const inputApellidoM = document.getElementById("inputApellidoM");
    const inputEmail = document.getElementById("inputEmail");
    const inputPassword = document.getElementById("inputPassword");
    const inputConfirmPassword = document.getElementById("inputConfirmPassword");
    const txtPasswordAlert = document.getElementById('txtPasswordAlert');
    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
    const txtEmailAlert = document.getElementById('txtEmailAlert');
    
    const inputs = [inputName,inputApellidoM,inputApellidoP,inputEmail,inputPassword,inputConfirmPassword];
    const btnConfirm = document.getElementById("btnConfirm");
   

    
   
    //Segmento que verifica que la contraseña sea valida, que tenga minimo 8 caracteres, minimo un número, y contenga algún caracter especial,
    inputPassword.onkeyup = function () {
        
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
            txtEmailAlert.innerHTML="Ingrese un correo electrónico válido"
        }
    };
    
    //Funcion para verificar si las contraseñas coinciden
    inputConfirmPassword.onkeyup = function () {     checkConfirm(inputConfirmPassword)    };

    //Verifica que no haya campos vacios, 
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
    
            //Se llama al metodo POST de la API 
            fetch("https://scitrackapi-production.up.railway.app/api/administrador/", {
                method: "POST",
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
                alert('Se han enviado sus datos.');
                window.location.reload();
                console.log(data);
            })
            .catch((error) => console.error("Error:", error));
        }

        
    };

  };

  function checkConfirm(inputConfirmPassword)
  {
        const txtConfirmPasswordAlert = document.getElementById("txtConfirmPasswordAlert");

        if (inputConfirmPassword.value != inputPassword.value)
        {
            txtConfirmPasswordAlert.innerHTML = "Las contraseñas no coinciden"; 
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