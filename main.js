
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
        }
    