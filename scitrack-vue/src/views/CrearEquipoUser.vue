<template>
  <div id="app">
    <div class="contenedor">
      <h1>Crear equipo</h1>
      <div class="marco">
        <div class="contenido">
          <form>
            <h3>Seleccione un asesor:</h3>
            <select id="selectAsesor" class="selectAsesor" v-model="idAsesor" required>
              <option value="none">Seleccione un asesor</option>
              <option v-for="asesor in asesores" :key="asesor.idAsesor" :value="asesor.idAsesor">
                {{ asesor.nombre }} {{ asesor.apellidoPaterno }} {{ asesor.apellidoMaterno }}
              </option>
            </select>

            <div class="row1">
              <div class="column1">
                <label for="filtroConvocatoria"><strong>Convocatoria:</strong></label>
                <div id="filtroConvocatoriaContainer" class="native-checkbox-group">
                  <label 
                    v-for="convocatoria in CONVOCATORIAS" 
                    :key="convocatoria.idConvocatoria"
                    class="native-checkbox-wrapper"
                    :class="{'is-selected': convocatoriaSeleccionada === convocatoria.idConvocatoria}"
                  >
                    <input
                      type="radio"
                      v-model="convocatoriaSeleccionada"
                      :value="convocatoria.idConvocatoria"
                      @change="filtrarConvocatorias"
                      class="native-checkbox"
                    >
                    <span class="checkmark"></span>
                    <span class="label-text">{{ convocatoria.nombre }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="column">
                <label><strong>Participantes disponibles:</strong></label>
                <input 
                  type="text" 
                  v-model="busquedaParticipante" 
                  placeholder="Buscar participantes..."
                  class="search-input"
                >
                <div v-for="participante in mostrarParticipantes" :key="participante.idParticipante" class="card">
                  <p>{{ obtenerNombre(participante.idParticipante) }} : <strong>{{ obtenerInstitucionLider(participante.idParticipante) }}</strong></p>
                  <button @click="agregarParticipante(participante)" class="add-button">Agregar</button>
                </div>
              </div>

              <div class="column">
                <label><strong>Participantes seleccionados:</strong></label>
                <table class="selected-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Institución</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="participante in participantesSeleccionados" :key="participante.idParticipante">
                      <td>{{ obtenerNombre(participante.idParticipante) }}</td>
                      <td>{{ obtenerInstitucionLider(participante.idParticipante) }}</td>
                      <td>
                        <button 
                          @click="eliminarParticipante(participante)"
                          class="remove-button"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button 
              id="btnEnviarRevision" 
              type="button" 
              class="submit-button"
              @click="enviarEquipo"
            >
              Enviar para revisión
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idAsesor: null,
      convocatoriaSeleccionada: null,
      busquedaParticipante: '',
      participantesSeleccionados: [],
      asesores: [],
      CONVOCATORIAS: [],
      PARTICIPANTES: [],
      EQUIPOS: [],
      DEPENDENCIAS: [],
      INSTITUCIONES: [],
    }
  },

  computed: {
    mostrarParticipantes() {
      return this.PARTICIPANTES.filter(participante => {
        // Filtro por estado (que no tenga equipo asignado)
        if (participante.Equipo_idEquipo !== null) return false;
        
        // Filtro por texto de búsqueda
        const texto = this.busquedaParticipante.toLowerCase();
        const nombreCompleto = `${participante.nombre} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`.toLowerCase();
        
        return nombreCompleto.includes(texto);
      });
    },
  },
  async mounted() {
    await this.cargarAsesores();
    await this.cargarConvocatorias();
    await this.cargarParticipantes();
    await this.cargarEquipos();
    await this.cargarDependencias();
    await this.cargarInstituciones();
  },
  methods: {
    agregarParticipante(participante) {
      // Verificar si ya está agregado
      if (!this.participantesSeleccionados.some(p => p.idParticipante === participante.idParticipante)) {
        this.participantesSeleccionados.push(participante);
      } else {
        alert('Este participante ya fue agregado');
      }
    },
    eliminarParticipante(participante) {
      this.participantesSeleccionados = this.participantesSeleccionados.filter(
        p => p.idParticipante !== participante.idParticipante
      );
    },
    obtenerNombre(idParticipante) {
      const participante = this.PARTICIPANTES.find(p => p.idParticipante === idParticipante);
      return participante ? `${participante.nombre} ${participante.apellidoPaterno}` : 'Sin nombre';
    },
    obtenerInstitucionLider(idLider) {
      const lider = this.PARTICIPANTES.find(p => p.idParticipante === idLider);
      const dependencia = this.DEPENDENCIAS.find(d => d.idDependencia === (lider ? lider.Dependencia_idDependencia : null));
      const institucion = this.INSTITUCIONES.find(i => i.idInstitucion === (dependencia ? dependencia.Institucion_idInstitucion : null));
      return institucion ? institucion.nombre : 'Sin institución';
    },
    filtrarConvocatorias() {
      // Lógica de filtrado si es necesaria
    },
    async cargarAsesores() {
      const res = await fetch('http://localhost:3000/api/asesor/')
      this.asesores = await res.json()
    },
    async cargarDependencias() {
      const response = await fetch("http://localhost:3000/api/dependencia/");
      this.DEPENDENCIAS = await response.json();
    },
    async cargarInstituciones() {
      const response = await fetch("http://localhost:3000/api/institucion/");
      this.INSTITUCIONES = await response.json();
    },
    async cargarConvocatorias() {
      const response = await fetch("http://localhost:3000/api/convocatoria/");
      this.CONVOCATORIAS = await response.json();
    },
    async cargarParticipantes() {
      const response = await fetch("http://localhost:3000/api/participante/");
      this.PARTICIPANTES = await response.json();
    },
    async cargarEquipos() {
      const response = await fetch("http://localhost:3000/api/equipo/");
      this.EQUIPOS = await response.json();
    },


    async enviarEquipo() {

    const usuario = JSON.parse(localStorage.getItem("userData")) || null;
    if (!usuario || !usuario.idParticipante) {
      alert("No se pudo identificar al usuario líder. Por favor, inicie sesión nuevamente.");
      return;
    }
    // Validaciones básicas
    if (!this.idAsesor || !this.convocatoriaSeleccionada) {
        alert("Por favor complete todos los campos requeridos.");
        return;
    }

    if (this.participantesSeleccionados.length === 0) { // Corregido: usar === en lugar de =
        alert("Debe agregar al menos un participante.");
        return;
    }

    const convocatoria = this.CONVOCATORIAS.find(c => c.idConvocatoria === this.convocatoriaSeleccionada); // Agregado this.
    let numMax = convocatoria ? convocatoria.max_integrantes : null; 
    
    
        numMax = numMax - 1; 
        
        if (this.participantesSeleccionados.length > numMax) {
        alert(`Cantidad de participantes sobrepasada (Máximo permitido omitiendo al líder: ${numMax}). Por favor, seleccione la cantidad aceptada en la convocatoria.`);
        return;
        }
    

    try {
        // 1. Primero creamos el equipo
        const equipoData = {
        Asesor_idAsesor: this.idAsesor,
        Participante_idLider: usuario.idParticipante,
        };

        // Enviar solicitud para crear el equipo
        const responseEquipo = await fetch('http://localhost:3000/api/equipo/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipoData)
        });

        if (!responseEquipo.ok) {
        throw new Error('Error en la respuesta del servidor al crear equipo');
        }

        const equipoCreado = await responseEquipo.json();

        if (!equipoCreado.idEquipo) {
        throw new Error('No se recibió el ID del equipo creado');
        }

        // 2. Actualizar cada participante con el ID del nuevo equipo
        const actualizaciones = this.participantesSeleccionados.map(async participante => {
        const updateData = {
            Equipo_idEquipo: equipoCreado.idEquipo
        };

        const response = await fetch(`http://localhost:3000/api/participante/${participante.idParticipante}`, {
            method: 'PUT', // Cambiado a PUT como indicaste
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar participante ${participante.idParticipante}`);
        }
        });

        // Esperar que todas las actualizaciones terminen
        await Promise.all(actualizaciones);

        // 3. Mostrar mensaje de éxito y resetear el formulario
        alert(`Equipo creado exitosamente con ${this.participantesSeleccionados.length} participantes`);
        
        // Resetear el formulario
        this.idAsesor = null;
        this.convocatoriaSeleccionada = null;
        this.participantesSeleccionados = [];
        this.busquedaParticipante = '';
        
    } catch (err) {
        console.error('Error al crear equipo:', err);
        alert("Ocurrió un error al crear el equipo: " + err.message);
    }
    }
  }
}
</script>

<style scoped>
/* Tus estilos originales */
.contenedor {
  background: #ffffff;
  border-radius: 10px;
  max-width: 100%;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.marco {
  background: #BFD6FF;
  border-radius: 10px;
  padding: 2rem;
  max-width: 100%;
  margin: auto;
}

.contenido {
  background: #fff;
  border-radius: 10px;
  padding: 2rem;
  max-width: 100%;
  margin: auto;
}

h1 {
  font-size: 2rem;
}

label {
  display: block;
  margin-top: 1rem;
  font-weight: bold;
}
tr,td{
    background-color: white;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  background-color:white;
  border-radius: 5px;
  margin-top: 0.25rem;
}
.selectAsesor {
  width: 40%;
  padding: 0.2rem;
  border: 2px solid rgb(0, 0, 0);
  background-color: #ffffff;
  border-radius: 5px;
  margin-top: 0.25rem;
}
.search-input {
  margin-bottom: 1rem;
}

.submit-button {
  margin-top: 2rem;
  background: linear-gradient(to left, #4f4fef, #7a7aff);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.row {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 350px;
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 10px;
}
.row1 {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 250px;
  width: 40%;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 330px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 10px;
  padding: 15px;
}
.column1 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 200px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 10px;
  padding: 15px;
}

.card {
    display: flex;
    align-items: center;
  justify-content: space-between;
  background: white;
  border-left: 5px solid #3b82f6;
  border-radius: 8px;
  padding: 10px 15px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  margin-bottom: 10px;
}

.card p {
  margin: 4px 0;
  font-size: 14px;
}

.add-button {
  float: left;
  background: #543D99;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
}

.selected-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.selected-table th, .selected-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.selected-table th {
  background-color: #f2f2f2;
}

.remove-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* Estilos para los checkboxes (ahora radios) */
.native-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 95%;
  margin-bottom: 20px;
}

.native-checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  padding: 6px;
  width: 100%;
  border-bottom: 1px solid #aaa; 
  transition: background-color 0.3s, border-color 0.3s;
}

.native-checkbox {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: #007bff;
}

.is-selected {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  border-radius: 6px;
  padding: 6px 10px;
  font-weight: 600;
}

.label-text {
  pointer-events: none;
  display: inline-block;
  padding: 0 4px;
}
</style>