window.onload = function () {   

    const inputName = document.getElementById("inputNombre");
    
    const inputDescripcion = document.getElementById("inputDescripcion");
   
    const inputFechaInicio = document.getElementById("inputFechaInicio");
    
    const inputFechaFin = document.getElementById("inputFechaFin");
    
    const inputMaxIntegrantes = document.getElementById("inputMaxIntegrantes");

    const txtConfirmAlert = document.getElementById('txtConfirmAlert');
   
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputName,inputFechaInicio,inputDescripcion,inputMaxIntegrantes,inputFechaFin];
    const btnConfirm = document.getElementById("btnConfirm");

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
            fetch("http://localhost:3000/api/convocatoria/", {
                method: "POST",
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

                const id = data.idConvocatoria;
                if (confirm("Se ha registrado la convocatoria. ¿Desea definir las fases en este momento?") == true) 
                {
                    sessionStorage.setItem('sci:conv_to_edit',id);
                    window.location.href='../GUI_Fases/GUIRegistroFases.html';
                } else 
                {
                    sessionStorage.setItem('sci:conv_to_edit',undefined);
                    window.location.hred='listar_convocatorias.html';
                }

                })
                .catch((error) => console.error("Error:", error));
    };

  };