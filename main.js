
        function mostrarDependencias() {
            let institucion = document.getElementById("institucion").value;
            if (institucion.trim() !== "") {
                document.getElementById("dependencias-section").classList.remove("hidden");
            } else {
                alert("Por favor, ingrese el nombre de la institución.");
            }
        }
        function agregarDependencia() {
            let container = document.getElementById("dependencias-container");
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Nombre de la dependencia";
            container.appendChild(input);
            container.appendChild(document.createElement("br"));
        }

        function subirDatos() {
            let institucion = document.getElementById("institucion").value;
            let dependencias = [];
            let inputs = document.querySelectorAll("#dependencias-container input");
            
            inputs.forEach(input => {
                if (input.value.trim() !== "") {
                    dependencias.push(input.value);
                }
            });

            if (institucion.trim() === "" || dependencias.length === 0) {
                alert("Llene todos los campos antes de subir los datos.");
                return;
            }

            let data = {
                institucion: institucion,
                dependencias: dependencias
            };

            console.log("Datos a subir:", data);
            alert("Datos registrados con exito (Ejemplaxio).");
            localStorage.setItem("institucion", institucion);
            localStorage.setItem("dependencias", JSON.stringify(dependencias));
        
            cargarDatos();
        }
        
        function cargarDatos() {
            let listaInstituciones = document.getElementById("lista-instituciones");
            let listaDependencias = document.getElementById("lista-dependencias");
            listaInstituciones.innerHTML = "";
            listaDependencias.innerHTML = "";
        
            let institucion = localStorage.getItem("institucion");
            let dependencias = JSON.parse(localStorage.getItem("dependencias")) || [];
        
            if (institucion) {
                let item = document.createElement("li");
                item.textContent = institucion;
                
                let btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.onclick = function () {
                    let nuevoNombre = prompt("Ingrese el nuevo nombre de la institución:", institucion);
                    if (nuevoNombre) {
                        localStorage.setItem("institucion", nuevoNombre);
                        cargarDatos();
                    }
                };
                
                let btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.onclick = function () {
                    localStorage.removeItem("institucion");
                    localStorage.removeItem("dependencias");
                    cargarDatos();
                };
                
                item.appendChild(btnEditar);
                item.appendChild(btnEliminar);
                listaInstituciones.appendChild(item);
            }
        
            dependencias.forEach(dep => {
                let item = document.createElement("li");
                item.textContent = dep;
                
                let btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.onclick = function () {
                    let nuevoNombre = prompt("Ingrese el nuevo nombre de la dependencia:", dep);
                    if (nuevoNombre) {
                        let nuevasDependencias = dependencias.map(d => d === dep ? nuevoNombre : d);
                        localStorage.setItem("dependencias", JSON.stringify(nuevasDependencias));
                        cargarDatos();
                    }
                };
                
                let btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.onclick = function () {
                    let nuevasDependencias = dependencias.filter(d => d !== dep);
                    localStorage.setItem("dependencias", JSON.stringify(nuevasDependencias));
                    cargarDatos();
                };
                
                item.appendChild(btnEditar);
                item.appendChild(btnEliminar);
                listaDependencias.appendChild(item);
            });
        }
        
    

