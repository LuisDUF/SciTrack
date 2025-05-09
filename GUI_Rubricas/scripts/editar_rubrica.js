var rubrica = [];
var criterios = [];

//Variables para verificar que no haya ningún problema con las contraseñas o correo (que no sean validos).
let passwordIssue = false;
let emailIssue = false
let passwordIssueConfirm = false;
let institutionHasDependecy = false;


window.onload = function () {   

    const pToEdit = sessionStorage.getItem('sci:rubrica_to_edit')
    if ( pToEdit == undefined)
    {
        window.location = 'listar_rubricas.html';
    }
    
    ocultar_bots(); 

    const inputDescripcion = document.getElementById("inputDescripcion");
   
    const listaCriterios = document.getElementById("lista_criterios");

    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
   
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputDescripcion];
    const btnConfirm = document.getElementById("btnConfirm");


        fetch("https://scitrackapi-production.up.railway.app/api/criterio/",{
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);
                data.forEach(criterio => {
                    if(criterio.Rubrica_idRubrica==pToEdit){     
                        let fila = document.createElement("li");
                        fila.innerHTML= `
                            <input type="radio" id="${criterio.idCriterios}" name="criterio"  onclick=radio()>${criterio.descripcion}: ${criterio.ponderacion}%</input>
                        `;
                        listaCriterios.appendChild(fila);
                    }
                });
            criterios=data;
          
            })
            .catch((error) => console.error("Error:", error));

   
        fetch("https://scitrackapi-production.up.railway.app/api/rubrica/"+pToEdit,{
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            rubrica = data[0];

            inputDescripcion.value = rubrica.descripcion;
            
            

          })
          .catch((error) => console.error("Error:", error));

          
8
    //Verfica que el email sea valido, revisando que tenga almenos una dirección (es decir, que sea un texto@algo.algo)
   

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
            

            fetch("https://scitrackapi-production.up.railway.app/api/rubrica/"+pToEdit, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    descripcion:inputDescripcion.value,
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

  function ocultar_bots(){
    const btn2 = document.getElementById("boton_modificar");
    const btn3 = document.getElementById("boton_eliminar");
    document.getElementById("inputDescripcion_criterio").hidden = true;
    document.getElementById("inputPonderacion").hidden = true;
    document.getElementById("btnConfirmar").hidden = true;
    document.getElementById("p_o").hidden = true;
    document.getElementById("p_o2").hidden = true;
    btn2.hidden = true;
    btn3.hidden = true;
}

function radio(){
    
    let btn2 = document.getElementById("boton_modificar");
    let btn3 = document.getElementById("boton_eliminar");
    
    btn2.hidden = false;
    btn3.hidden = false;

}

function delete_criterio(){
    let rad = document.querySelector('input[name="criterio"]:checked').id;
    fetch("https://scitrackapi-production.up.railway.app/api/criterio/"+rad, {
        method: "DELETE",
    })
        .then((data) => {
        console.log("Data was deleted!");
        
        alert("Criterio eliminado con éxito");
        location.reload();
        
        }) 
        .catch((error) => console.error("Error:", error));
}

function modify_criterio(){
    let rad = document.querySelector('input[name="criterio"]:checked').id;
    
    const descripcionC = document.getElementById("inputDescripcion_criterio");
    const ponderacion = document.getElementById("inputPonderacion");
    const btnC = document.getElementById("btnConfirmar");
    criterios
    document.getElementById("p_o").hidden = false;
    document.getElementById("p_o2").hidden = false;
    descripcionC.hidden = false;
    ponderacion.hidden = false;
    btnC.hidden = false;
    const cc = criterios.find(e=>{
        return e.idCriterios == rad;
    });
    
    descripcionC.value = cc.descripcion;
    ponderacion.value = cc.ponderacion;
}

function modificar_criterio(){
    
    let rad = document.querySelector('input[name="criterio"]:checked').id;
    const descripcionC = document.getElementById("inputDescripcion_criterio");
    const ponderacion = document.getElementById("inputPonderacion");
    
    fetch("https://scitrackapi-production.up.railway.app/api/criterio/"+rad, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            descripcion:descripcionC.value,
            ponderacion:ponderacion.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        alert("Se han guardado los cambios")
        location.reload();
        })
        .catch((error) => console.error("Error:", error));
}
