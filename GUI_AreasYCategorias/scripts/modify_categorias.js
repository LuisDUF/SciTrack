let CATEGORIA = [];

const categoriaToEdit = sessionStorage.getItem('sci:categoria_to_edit');
const areaId = sessionStorage.getItem('sci:area_id');

window.onload = function () {


    const inputNombre = document.getElementById("inputNombre");
    const inputDescripcion = document.getElementById("inputDescripcion");

    const txtNombreAlert = document.getElementById("txtNombreAlert");
    const txtDescripcionAlert = document.getElementById("txtDescripcionAlert");
    const txtConfirmAlert = document.getElementById("txtConfirmAlert");

    const btnConfirm = document.getElementById("btnConfirm");
    const btnEliminar = document.getElementById("btnEliminar");

    // Cargar datos de la categoría
    fetch(`https://scitrackapi-production.up.railway.app/api/categoria/${categoriaToEdit}`)
        .then(response => response.json())
        .then(data => {
            CATEGORIA = data[0];
            inputNombre.value = CATEGORIA.nombre;
            inputDescripcion.value = CATEGORIA.descripcion;
        })
        .catch(error => console.error("Error:", error));

    btnConfirm.onclick = function () {
        if (inputNombre.value === "" || inputDescripcion.value === "") {
            txtConfirmAlert.innerHTML = "¡Debe llenar todos los campos!";
            return;
        }

        txtConfirmAlert.innerHTML = "";

        fetch(`https://scitrackapi-production.up.railway.app/api/categoria/${categoriaToEdit}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: inputNombre.value,
                descripcion: inputDescripcion.value,
                AreaDeConocimientoCat_idAreaDeConocimientoCat: areaId
            }),
        })
            .then(response => response.json())
            .then(data => {
                alert("Categoría actualizada correctamente.");
                window.location = "main.html";
            })
            .catch(error => console.error("Error:", error));
    };

    btnEliminar.onclick = function () {
        fetch(`https://scitrackapi-production.up.railway.app/api/categoria/${categoriaToEdit}`, {
            method: "DELETE",
        })
            .then(() => {
                alert("Categoría eliminada.");
                window.location = "main.html";
            })
            .catch(error => console.error("Error:", error));
    };
};

function regresar() {
    window.location.href = "main.html";
}