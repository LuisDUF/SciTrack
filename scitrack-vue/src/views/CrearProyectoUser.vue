<template>
  <div id="app">
   <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
        <v-icon color="warning" large class="mr-2">mdi-alert-circle</v-icon>
          <h3>{{ modalTitulo }}</h3>
          <button @click="mostrarModal = false" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ modalMensaje }}</p>
          <ul>
            <li v-for="(error, index) in modalErrores" :key="index">{{ error }}</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button @click="mostrarModal = false" class="modal-button">Entendido</button>
        </div>
      </div>
    </div>
    <div class="contenedor">
      <h1>Crear proyecto</h1>
      <div class="marco">
        <div class="contenido">
          <form>
            <label for="nombre">Nombre del proyecto:</label>
            <input type="text" id="nombreProyecto" v-model="nombreProyecto" placeholder="...">
            <div class="row">
              <div class="column">
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
                    <span class="label-text">{{ convocatoria.nombre }} : 
                          <span :style="{ color: obtenerEstadoConv(convocatoria.idConvocatoria).color }">
                            {{ obtenerEstadoConv(convocatoria.idConvocatoria).texto }}
                          </span>
                    </span>
                  </label>
                </div>
              </div>

              <div class="column">
                <label for="filtroCategoria"><strong>Categoria:</strong></label>
                <div id="filtroCategoriaContainer" class="native-checkbox-group">
                  <label 
                    v-for="categoria in CATEGORIAS" 
                    :key="categoria.idCategoria"
                    class="native-checkbox-wrapper"
                    :class="{'is-selected': categoriaSeleccionada === categoria.idCategoria}"
                  >
                    <input
                      type="radio"
                      v-model="categoriaSeleccionada"
                      :value="categoria.idCategoria"
                      @change="filtrarCategorias"
                      class="native-checkbox"
                    >
                    <span class="checkmark"></span>
                    <span class="label-text">{{ categoria.nombre }}</span>
                  </label>
                </div>
              </div>

              <div class="columnVideo">
                <label for="dropzoneVideo"><strong>Video del proyecto:</strong></label>
                <v-text-field
                  v-model="videoUrl"
                  label="Enlace del video (YouTube o Vimeo)"
                  placeholder="Ej: https://youtu.be/abc123..."
                  :rules="[validarUrlVideo]"
                  prepend-icon="mdi-video"
                  clearable
                ></v-text-field>


              </div>
            </div>
            <span class="note">* El proyecto se asignará al equipo que usted pertenezca en la convocatoria seleccionada.</span>

            <label>Documentos:</label>
            <div class="dropzone" id="dropzone" @click="abrirSelectorArchivos">
              <img src="../assets/icono_doc.png" alt="icono documento" id="iconoDocumento" v-show="!archivo">
              <p id="textoDropzone">
                {{ archivo ? archivo.name : 'Suba aquí el documento pertinente al proyecto. Puede consultar los documentos requeridos en la convocatoria oficial' }}
              </p>
              <input 
                type="file" 
                id="documentoProyecto" 
                ref="documentoProyecto"
                accept="application/pdf" 
                hidden
                @change="manejarSeleccionArchivo"
              >
            </div>

            <button 
              id="btnEnviarRevision" 
              type="button" 
              class="submit-button"
              @click="enviarProyecto"
              :disabled="!formularioValido"
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
import api from '@/services/api';

export default {
  data() {
    return {
      nombreProyecto: '',
      convocatoriaSeleccionada: null,
      categoriaSeleccionada: null,
      archivo: null,
      videoUrl: "", // Almacena el enlace ingresado
      // Datos de API (solo los necesarios para este componente)
      CONVOCATORIAS: [],
      FASES: [],
      CATEGORIAS: [],
      EQUIPOS: [],
      PARTICIPANTE: [],
      ARCHIVOS: [],
      ITEMS: [],
      mostrarModal: false,
      modalTitulo: '',
      modalMensaje: '',
      modalErrores: []
    }
  },
  computed: {
    formularioValido() {
      return (
        this.nombreProyecto && 
        this.convocatoriaSeleccionada && 
        this.categoriaSeleccionada && 
        this.archivo 
      );
    },

    esUrlYouTube() {
      return this.videoUrl.match(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
      );
    },
    // Versión corregida (sin escapes innecesarios)
    esUrlVimeo() {
      return this.videoUrl.match(/^(https?:\/\/)?(www\.)?vimeo\.com\/.+/);
    },
    
    // Verifica si la URL es válida
    esUrlValida() {
      return this.esUrlYouTube || this.esUrlVimeo;
    }
  },

  async mounted() {
    await this.cargarConvocatorias();
    await this.cargarFases();
    await this.cargarCategorias();
    await this.cargarEquipos();
    await this.cargarParticipantes();
    await this.cargarItems();
  },
  methods: {
    validarUrlVideo(url) {
      if (!url) return "El enlace es requerido";
      const esValida = this.esUrlValida;
      return esValida || "Ingresa un enlace válido de YouTube o Vimeo";
    },
    abrirSelectorArchivos() {
      this.$refs.documentoProyecto.click();
    },
    
    manejarSeleccionArchivo(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.archivo = file;
      } else {
        alert("Por favor seleccione un archivo PDF válido.");
        this.archivo = null;
      }
    },
    obtenerEstadoConv(idConvocatoria) {
          const convocatoria = this.CONVOCATORIAS.find(c => c.idConvocatoria === idConvocatoria);
  
      if (!convocatoria) {
        return { texto: 'Convocatoria no encontrada', color: 'gray' };
      }

      const fechaHoy = new Date();
      const fechaFin = new Date(convocatoria.fechaFinRegistro);
      
      fechaHoy.setHours(0, 0, 0, 0);
      fechaFin.setHours(0, 0, 0, 0);

      return fechaHoy > fechaFin 
        ? { texto: 'Fecha de inscripción concluida', color: 'red' } 
        : { texto: 'Disponible', color: 'green' };
    },
    
    filtrarConvocatorias() {
      // Lógica de filtrado si es necesaria
    },
    
    filtrarCategorias() {
      // Lógica de filtrado si es necesaria
    },
    
    async cargarConvocatorias() {
      try {
        const response = await fetch("http://localhost:3000/api/convocatoria/");
        this.CONVOCATORIAS = await response.json();
      } catch (error) {
        console.error("Error al obtener convocatorias:", error);
      }
    },
      async cargarFases() {
      try {
        const response = await fetch("http://localhost:3000/api/fase/");
        this.FASES = await response.json();
      } catch (error) {
        console.error("Error al obtener convocatorias:", error);
      }
    },

    async cargarItems() {
      try {
        const response = await fetch("http://localhost:3000/api/itemconvocatoria_fase/");
        this.ITEMS = await response.json();
      } catch (error) {
        console.error("Error al obtener items:", error);
      }
    },
    
    async cargarCategorias() {
      try {
        const response = await fetch("http://localhost:3000/api/categoria/");
        this.CATEGORIAS = await response.json();
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    },
    
    async cargarEquipos() {
      try {
        const response = await fetch("http://localhost:3000/api/equipo/");
        this.EQUIPOS = await response.json();
      } catch (error) {
        console.error("Error al obtener equipos:", error);
      }
    },
    
    async cargarParticipantes() {
      try {
        const response = await fetch("http://localhost:3000/api/participante/");
        this.PARTICIPANTE = await response.json();
      } catch (error) {
        console.error("Error al obtener participantes:", error);
      }
    },
    
     async enviarProyecto() {
      const errores = [];
      var usuario = JSON.parse(localStorage.getItem("userData")) || null;
      
      usuario = JSON.parse(JSON.stringify((await api.get('/api/participante/'+usuario.idParticipante)).data[0]));
     
      if (!usuario || !usuario.idParticipante) {
        this.mostrarErroresModal(
          "Error de usuario",
          "No se pudo identificar al usuario líder:",
          ["Por favor, inicie sesión nuevamente"]
        );
        return;
      }

      if (usuario.Equipo_idEquipo == null) {
        this.mostrarErroresModal(
          "Error en equipo",
          "No puedes crear un proyecto:",
          ["Necesitas tener un equipo para poder crear un proyecto"]
        );
        this.$router.push({ name: 'CrearEquipo' });
        return;
      }

      if (!this.nombreProyecto) errores.push("El nombre del proyecto es requerido");
      if (!this.convocatoriaSeleccionada) errores.push("Debes seleccionar una convocatoria");
      if (!this.categoriaSeleccionada) errores.push("Debes seleccionar una categoría");
      if (!this.archivo) errores.push("Debes subir el documento del proyecto");
      else if (!this.esUrlValida) errores.push("El enlace del video debe ser de YouTube o Vimeo");

      if (errores.length > 0) {
        this.mostrarErroresModal(
          "Error en el formulario",
          "Por favor corrige los siguientes errores:",
          errores
        );
        return;
      }
    
      try {
        const participante = this.PARTICIPANTE.find(p => p.idParticipante === usuario.idParticipante);
        const fechaHoy = new Date().toISOString().split("T")[0];
        const convocatoria = this.CONVOCATORIAS.find(c => c.idConvocatoria === this.convocatoriaSeleccionada);
        const equipo = this.EQUIPOS.find(e => e.idEquipo === participante.Equipo_idEquipo);
        
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const currentDate = year+'-'+month+'-'+day;

        const itemFaseInicial = this.ITEMS.find(i => 
          i.Convocatoria_idConvocatoria === convocatoria.idConvocatoria && i.orden === 0
        );
        
        if (!itemFaseInicial) {
          throw new Error("No se encontró la fase inicial para esta convocatoria");
        }

        const fase = this.FASES.find(f => f.idFase === itemFaseInicial.Fase_idFase);
        
        if (fechaHoy > convocatoria.fechaFinRegistro) {
          this.mostrarErroresModal(
            "Error de fecha",
            "No se puede registrar el proyecto:",
            ["La fecha límite para registrar proyectos ha expirado"]
          );
          return;
        }

        if (equipo.max_integrantes !== convocatoria.max_integrantes) {
          this.mostrarErroresModal(
            "Error de integrantes",
            "No se puede registrar el proyecto:",
            ["Los integrantes máximos de tu equipo no coinicden con los de la convocatoria seleccionada."]
          );
          return;
        }

        // 1. Subir archivo
      const formDataArchivo = new FormData();
      formDataArchivo.append('nombre', this.archivo.name);
      formDataArchivo.append('tamanio', this.archivo.size);
      formDataArchivo.append('fechaIngreso', currentDate);
      formDataArchivo.append('contenido', this.archivo);


      const resArchivo = await fetch('http://localhost:3000/api/archivos', {
        method: 'POST',
        body: formDataArchivo
      });

        const dataArchivo = await resArchivo.json();
        const idArchivo = dataArchivo.idArchivos;
        console.log(dataArchivo);

        if (!idArchivo) throw new Error("No se obtuvo el ID del archivo");

        
        
        
        // 2. Crear proyecto
        const datosProyecto = {
          nombre: this.nombreProyecto,
          fechaRegistro: currentDate,

          Equipo_idEquipo: equipo.idEquipo,
          Categoria_idCategoria: this.categoriaSeleccionada,

          Archivos_idArchivos: idArchivo,
          Fase_idFase: fase.idFase,
          EstadosProyecto_idEstadosProyecto: 1,
          urlVideo: this.videoUrl,
        };

        const resProyecto = await fetch('http://localhost:3000/api/proyecto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosProyecto)
        });

         await resProyecto.json();
        console.log(resProyecto);
        if (resProyecto.ok) {

          const formData = new FormData();
          formData.append("email", usuario.correo);
          formData.append("asunto", "Creación del equipo.");
          formData.append("mensaje", "Haz creado un equipo con éxito.");
          formData.append("Administrador_idAdministrador",1);
          formData.append("Participante_idParticipante",usuario.idParticipante);

          return fetch("http://localhost:3000/api/constancias/enviarMensaje", {
          method: "POST",
          body: formData
        }).then(res => {res.json();           
            this.resetForm();
            this.$router.push("/usermenu");
            }).catch(err => {
            console.error("Error enviando a:", usuario.correo, err);
            throw err; // para que Promise.all lo capture
          });
    
        } else {
          throw new Error("Error al registrar el proyecto");
        }
      } catch (err) {
        console.error(err);
        this.mostrarErroresModal(
          "Error al enviar",
          "Ocurrió un error inesperado:",
          [err.message]
        );
      }
    },

    mostrarErroresModal(titulo, mensaje, errores) {
      this.modalTitulo = titulo;
      this.modalMensaje = mensaje;
      this.modalErrores = errores;
      this.mostrarModal = true;
    },

    resetForm() {
      this.nombreProyecto = '';
      this.convocatoriaSeleccionada = null;
      this.categoriaSeleccionada = null;
      this.archivo = null;
      this.videoUrl = "";
    }
  }
}
</script>

<style scoped>
/* Mantengo exactamente tus estilos originales */
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

input[type="text"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 0.25rem;
}

.note {
  color: red;
  font-size: 0.85rem;
}

.dropzone {
  margin-top: 1rem;
  border: 2px dashed #000;
  background-color: #ffffff;
  padding: 2rem;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.dropzone img {
  width: 50px;
}

.dropzone p {
  margin-top: 1rem;
  color: #666;
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

.submit-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 350px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 10px;
  padding: 15px;
}
.columnVideo {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 180px;
  width:200px;
  overflow-y: auto;
  background-color: #BFD6FF;
  border-radius: 10px;
  padding: 15px;
}

.row {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 15px;
  height: 390px;
  width: 100%;
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
}

/* Estilos para los checkboxes (ahora radios) */
.native-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  padding:1px;
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  background: #4f4fef;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-body ul {
  margin: 10px 0 0 20px;
  padding: 0;
}

.modal-body li {
  margin-bottom: 5px;
  color: #d32f2f;
}

.modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  background: #f5f5f5;
}

.modal-button {
  background: #4f4fef;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-button:hover {
  background: #3a3aad;
}
</style>