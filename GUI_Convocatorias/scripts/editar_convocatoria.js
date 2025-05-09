var convocatoria = [];

//Variables para verificar que no haya ningún problema con las contraseñas o correo (que no sean validos).
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;
let institutionHasDependecy = false;

const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = [0,1,2,3,4,5,6,7,8,9];

window.onload = function () {   

    const pToEdit = sessionStorage.getItem('sci:convocatoria_to_edit')
    if ( pToEdit == undefined)
    {
        window.location = 'listar_convocatorias.html';
    }

    const inputName = document.getElementById("inputNombre");
    
    const inputDescripcion = document.getElementById("inputDescripcion");
   
    const inputFechaInicio = document.getElementById("inputFechaInicio");
    
    const inputFechaFin = document.getElementById("inputFechaFin");
    
    const inputMaxIntegrantes = document.getElementById("inputMaxIntegrantes");

    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
   
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputName,inputFechaInicio,inputDescripcion,inputMaxIntegrantes];
    const btnConfirm = document.getElementById("btnConfirm");



   

        fetch("http://localhost:3000/api/convocatoria/"+pToEdit,{

          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            convocatoria = data[0];
            inputName.value = convocatoria.nombre;
            inputDescripcion.value = convocatoria.descripcion;
            
            

            inputFechaInicio.value =  String(convocatoria.fechaInicio).slice(0,10);
            inputFechaFin.value = String(convocatoria.fechaFin).slice(0,10);
            
            inputMaxIntegrantes.value = convocatoria.max_integrantes;
          })
          .catch((error) => console.error("Error:", error));
8
    //Verfica que el email sea valido, revisando que tenga almenos una dirección (es decir, que sea un texto@algo.algo)
   

    //Verifica que no haya campos vacios, y que no haya problema con el correo o contraseña, si es así, es exitoso el registro y se envia a un administrador.
    btnConfirm.onclick = function()
    {
        let success = true;
        let estado = "Pendiente";
        var d = new Date();
        var fechaM = new Date(inputFechaFin.value);
        var fechaMen = new Date(inputFechaInicio.value);
        if(d<fechaM && d>=fechaMen){
            estado = "Activo";
        }
        else if(d>=fechaM){
            estado = "Finalizado";
            
        }
            
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
            


            fetch("http://localhost:3000/api/convocatoria/"+pToEdit, {

                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre:inputName.value,
                    descripcion:inputDescripcion.value,
                    fechaInicio:inputFechaInicio.value,
                    fechaFin:inputFechaFin.value,
                    max_integrantes:inputMaxIntegrantes.value,
                    estado:estado,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                console.log(data);
                alert("Se han guardado los cambios")
                })
                .catch((error) => console.error("Error:", error));
         }
    };

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