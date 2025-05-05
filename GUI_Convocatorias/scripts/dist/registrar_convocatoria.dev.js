"use strict";

window.onload = function () {
  var inputName = document.getElementById("inputNombre");
  var inputDescripcion = document.getElementById("inputDescripcion");
  var inputFechaInicio = document.getElementById("inputFechaInicio");
  var inputFechaFin = document.getElementById("inputFechaFin");
  var inputMaxIntegrantes = document.getElementById("inputMaxIntegrantes");
  var txtConfirmAlert = document.getElementById('txtConfirmAlert'); //Se guardan todos los inputs de texto en un array para facilmente ver los valores de TODOS posteriormente.

  var inputs = [inputName, inputFechaInicio, inputDescripcion, inputMaxIntegrantes, inputFechaFin];
  var btnConfirm = document.getElementById("btnConfirm");

  btnConfirm.onclick = function () {
    var success = true;
    var estado = "Pendiente";
    var d = new Date();
    var fechaM = new Date(inputFechaFin.value);
    var fechaMen = new Date(inputFechaInicio.value);

    if (d < fechaM && d >= fechaMen) {
      estado = "Activo";
    } else if (d >= fechaM) {
      estado = "Finalizado";
    }

    inputs.every(function (i) {
      if (i.value == "") {
        txtConfirmAlert.innerHTML = "¡Debe llenar todos los campos correctamente!";
        success = false;
        return false;
      }
    });
    if (success) txtConfirmAlert.innerHTML = "";
    fetch("http://localhost:3000/api/convocatoria/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre: inputName.value,
        descripcion: inputDescripcion.value,
        fechaInicio: inputFechaInicio.value,
        fechaFin: inputFechaFin.value,
        max_integrantes: inputMaxIntegrantes.value,
        estado: estado
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      var id = data.idConvocatoria;

      if (confirm("Se ha registrado la convocatoria. ¿Desea definir las fases en este momento?") == true) {
        sessionStorage.setItem('sci:conv_to_edit', id);
        window.location.href = '../Transicion_Fases/GUIRegistroFases.html';
      } else {
        sessionStorage.setItem('sci:conv_to_edit', undefined);
        window.location.hred = 'listar_convocatorias.html';
      }
    })["catch"](function (error) {
      return console.error("Error:", error);
    });
  };
};