window.onload = function () {
    const inputNombre = document.getElementById("inputNombre");
    const inputModalidad = document.getElementById("inputModalidad");
    const inputFechaInicio = document.getElementById("inputFechaInicio");
    const inputFechaFin = document.getElementById("inputFechaFin");
    const inputDescripcion = document.getElementById("inputDescripcion");
    const inputIdUbicacion = document.getElementById("inputIdUbicacion");

    
    //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.
    const inputs = [inputNombre,inputModalidad,inputFechaInicio,inputFechaFin,inputDescripcion,inputIdUbicacion];
    const btnConfirm = document.getElementById("btnConfirm");
    
    btnConfirm.onclick = function()
    {
        inputs.every(i => {
            if (i.value == "")
            {
                alert("Ingrese la informacion en todos los campos");           
                return false;
            }
        }); 
                fetch("https://scitrackapi-production.up.railway.app/api/asesor/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    nombre: inputNombre.value,
                    modalidad: inputModalidad.value,
                    fechaInicio: inputFechaInicio.value,
                    fechaFin: inputFechaFin.value,
                    descripcion: inputDescripcion.value,
                    Ubicacion_idUbicacion: inputIdUbicacion.value
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => console.error("Error:", error));
              
            alert('Se ha registrado la fase.');
            window.location.reload();
         
    };     
  };
