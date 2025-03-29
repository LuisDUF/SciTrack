//Variables para verificar que no haya ningún problema con las contraseñas o correo (que no sean validos).
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;

const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = [0,1,2,3,4,5,6,7,8,9];
let arrayGeneros = [];
window.onload = function () {
    const inputName = document.getElementById("inputNombre");
    const inputApellidoP = document.getElementById("inputApellidoP");
    const inputApellidoM = document.getElementById("inputApellidoM");
    const inputEmail = document.getElementById("inputEmail");


    const inputPhone = document.getElementById("inputPhone");

    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
    const txtEmailAlert = document.getElementById('txtEmailAlert');
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputName,inputApellidoM,inputApellidoP,inputEmail,inputPhone];
    const btnConfirm = document.getElementById("btnConfirm");
    
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
            const select = document.getElementById("select");
            
                fetch("https://scitrackapi-production.up.railway.app/api/asesor/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    nombre:inputName.value,
                    apellidoPaterno:inputApellidoP.value,
                    apellidoMaterno:inputApellidoM.value,
                    correo:inputEmail.value,
                    
                    telefono:inputPhone.value,
                    Genero_idGenero: select.options[select.selectedIndex].value
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => console.error("Error:", error));
              
            alert('Se han enviado sus datos.');
            window.location.reload();
         }
    };


    
        
        fetch("https://scitrackapi-production.up.railway.app/api/genero/", {
          method: "GET",
        })
        
          .then((response) => response.json())
          .then((data) => {
            
            let select = document.getElementById("select");
            arrayGeneros = data;

            arrayGeneros.forEach(genero => {
                
              let option = document.createElement("option"); 
              option.value = genero.idGenero;
              option.textContent = genero.nombre;
              select.appendChild(option);
            });
            console.log(data);

          })
          .catch((error) => console.error("Error:", error));
      
      
    
     
  };



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