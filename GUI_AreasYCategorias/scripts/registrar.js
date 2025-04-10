let CATEGORIAS = [];
let AREAS = [];

window.onload = async function () {
    await cargarCategorias();
    await cargarAreas();
    mostrarCategorias();
    mostrarAreas();

    const inputNombreArea = document.getElementById("inputNombre");
    const btnConfirm = document.getElementById("btnConfirm");
    const txtConfirmAlert = document.getElementById("txtConfirmAlert");
    const categoriaContainer = document.getElementById("categoriaContainer");
  
    // Agregar campos de categoría dinámicamente
    document.getElementById("btnAgregarCategoria").onclick = function () {
      const div = document.createElement("div");
      div.classList.add("categoria");
      div.innerHTML = `
        <input type="text" placeholder="Nombre de la categoría" class="categoriaNombre" />
        <input type="text" placeholder="Descripción" class="categoriaDescripcion" />
        <button onclick="this.parentNode.remove()">Eliminar</button>
        <br><br>
      `;
      categoriaContainer.appendChild(div);
    };
  
    btnConfirm.onclick = async function () {
      const nombreArea = inputNombreArea.value.trim();
      if (!nombreArea) {
        txtConfirmAlert.innerText = "Debe ingresar el nombre del área.";
        return;
      }
  
      const categorias = Array.from(document.querySelectorAll(".categoria")).map(div => {
        return {
          nombre: div.querySelector(".categoriaNombre").value.trim(),
          descripcion: div.querySelector(".categoriaDescripcion").value.trim()
        };
      });
  
      if (categorias.some(cat => !cat.nombre || !cat.descripcion)) {
        txtConfirmAlert.innerText = "Todas las categorías deben tener nombre y descripción.";
        return;
      }
  
      try {
        // Primero insertar el área
        const response = await fetch("https://scitrackapi-production.up.railway.app/api/areadeconocimientocat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nombreArea })
        });
  
        const dataArea = await response.json();
  
        if (!dataArea.idAreaDeConocimientoCat) throw new Error("No se recibió el ID del área");
  
        // Luego insertar las categorías
        for (const cat of categorias) {
          await fetch("https://scitrackapi-production.up.railway.app/api/categoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: cat.nombre,
              descripcion: cat.descripcion,
              AreaDeConocimientoCat_idAreaDeConocimientoCat: dataArea.idAreaDeConocimientoCat
            })
          });
        }
  
        alert("Área y categorías registradas correctamente");
        window.location.reload();
      } catch (error) {
        console.error("Error al registrar:", error);
        txtConfirmAlert.innerText = "Error al registrar el área y las categorías.";
      }
    };
  };
  

  async function cargarCategorias() {
    await fetch("https://scitrackapi-production.up.railway.app/api/categoria", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        CATEGORIAS = data;
    })
    .catch(error => console.error("Error al obtener categorías:", error));
}

async function cargarAreas() {
    await fetch("https://scitrackapi-production.up.railway.app/api/areadeconocimientocat", {
        method: "GET",
    })
    .then(response => response.json())
    .then(data => {
        AREAS = data;
    })
    .catch(error => console.error("Error al obtener áreas:", error));
}

function mostrarCategorias(filtradas = CATEGORIAS) {
    const table = document.getElementById("categoriasTable");
    const tbodyExistente = table.querySelector("tbody");
    if (tbodyExistente) tbodyExistente.remove();

    const tbody = document.createElement("tbody");

    filtradas.forEach(cat => {
        const area = AREAS.find(a => a.idAreaDeConocimientoCat === cat.AreaDeConocimientoCat_idAreaDeConocimientoCat);
        const nombreArea = area ? area.nombre : "No encontrada";
        const idA = area ? area.idAreaDeConocimientoCat : "No encontrada";

        tbody.innerHTML += `
            <tr>
                <td>${cat.idCategoria}</td>
                <td>${cat.nombre}</td>
                <td>${cat.descripcion}</td>
                <td>${nombreArea}</td>
                <td>
                    <button class="edit" onclick="modificarCategoria(${cat.idCategoria}, ${idA})">Modificar</button>
                    <button class="delete" onclick="eliminarCategoria(${cat.idCategoria})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    table.appendChild(tbody);
}

function buscarCategorias() {
    const searchInput = document.getElementById("searchCategoriaInput").value.toLowerCase();
    const filtradas = CATEGORIAS.filter(cat => 


        {
          // Filtrar por nombre del líder, nombre del equipo o asesor
          const area = AREAS.find(a => a.idAreaDeConocimientoCat === cat.AreaDeConocimientoCat_idAreaDeConocimientoCat);
          const id_cat = CATEGORIAS.find(c => c.idCategoria === cat.idCategoria);

          const id = id_cat ? `${id_cat.idCategoria}` : "";
          const nombreCat = id_cat ? `${id_cat.nombre}` : "";
          const nombreArea = area ? `${area.nombre}` : "";
  
          return id.toLowerCase().includes(searchInput) ||
                 nombreCat.toLowerCase().includes(searchInput) ||
                 nombreArea.toLowerCase().includes(searchInput);
      }
    );
    mostrarCategorias(filtradas);
}

async function eliminarCategoria(id) {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;

    await fetch(`https://scitrackapi-production.up.railway.app/api/categoria/${id}`, {
        method: "DELETE",
    })
    .then(() => {
        alert("Categoría eliminada");
        location.reload();
    })
    .catch(error => console.error("Error al eliminar categoría:", error));
}

function modificarCategoria(id, areaId) {
  sessionStorage.setItem('sci:categoria_to_edit', id);
  sessionStorage.setItem('sci:area_id', areaId);
  window.location.href = "modify_categorias.html";
}

function mostrarAreas() {
  const table = document.getElementById("areasTable").querySelector("tbody");
  table.innerHTML = ""; // Limpiar contenido previo

  AREAS.forEach(area => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${area.idAreaDeConocimientoCat}</td>
      <td>${area.nombre}</td>
      <td>
        <button class="delete" onclick="eliminarArea(${area.idAreaDeConocimientoCat})">Eliminar</button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function eliminarArea(id) {
  if (!confirm("¿Estás seguro de eliminar esta área de conocimiento y todas sus categorías?")) return;

  try {
    // 1. Filtrar las categorías asociadas al área
    const categoriasAsociadas = CATEGORIAS.filter(cat => cat.AreaDeConocimientoCat_idAreaDeConocimientoCat === id);

    // 2. Eliminar las categorías
    for (const categoria of categoriasAsociadas) {
      await fetch(`https://scitrackapi-production.up.railway.app/api/categoria/${categoria.idCategoria}`, {
        method: "DELETE",
      });
    }

    // 3. Eliminar el área
    const response = await fetch(`https://scitrackapi-production.up.railway.app/api/areadeconocimientocat/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Área y categorías asociadas eliminadas correctamente");
      await cargarAreas();
      await cargarCategorias();
      mostrarAreas();
      mostrarCategorias();
    } else {
      alert("No se pudo eliminar el área.");
    }
  } catch (error) {
    console.error("Error al eliminar área y categorías:", error);
    alert("Error al eliminar el área y sus categorías.");
  }
}
