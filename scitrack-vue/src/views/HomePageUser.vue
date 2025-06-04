<template>
  <div>
    <upload-document-dialog v-model="fileUploadDialog" @submit="uploadIdFile" />
    <v-dialog v-model="loadingDone" :persistent="true" max-width="400">
      <v-card class="text-center pa-5">
        <v-icon class="text-h1 text-center mt-4" color="green lighten-2">mdi-check-circle</v-icon>
        <p class="font-weight-bold text-h4 mt-5">
          Se ha procesado su información
        </p>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="white" style="background-color: #6596ff" text @click="afterSuccesfulDelete()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loading" max-width="400" persistent no-click-animation>
      <v-card class="text-center pa-5">
        <br /><v-progress-circular :size="100" :width="7" color="blue" indeterminate></v-progress-circular><br />
        <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
      </v-card>
    </v-dialog>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre + " " + usuario?.apellidoPaterno }}</h2>
    </div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff;">

      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Equipo</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="idE">ID Equipo: </h5>
            <h5 ref="integrantes">Integrantes:</h5>
            <h5 ref="estado">Estado: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyecto</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="nombre">Nombre: </h5>
            <h5 ref="nombreA">Asesor:</h5>
            <h5 ref="estadoE">Estado: </h5>
            <h5 ref="promedioP">Promedio: </h5>

            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>

        <v-col class="rounded" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Convocatorias:</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF;">
              <v-list style="background-color: #EBF2FF;">
                <v-radio-group v-model="selectedConvocatoria">
                  <v-radio v-for="convocatoria in convocatorias" :key="convocatoria.idConvocatoria"
                    :label="convocatoria.nombre" :value="convocatoria.idConvocatoria"
                    @change="onCheckboxChange(convocatoria)"></v-radio>
                </v-radio-group>


              </v-list>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="usuario.Archivos_idArchivos == null" class="pa-5 justify-center">
        <v-col cols="12" md="6" class="text-center pa-5" style="border: 2px solid #4277ff; border-radius: 20px;">
          <h2>Termina tu Verificación</h2>
          <p>
            Sube un documento que verifique tu identidad para completar tu registro
            (INE, pasaporte, credencial institucional, etc).
          </p>
          <v-btn @click="fileUploadDialog = true" text color="#FFFFFF"
            style="background: linear-gradient(to left, #7b2ff7, #4277ff);" class="mt-4">
            <span>Subir Archivo</span>
            <v-icon right>mdi-id-card</v-icon>
          </v-btn>
        </v-col>
      </v-row>


      
       <div v-if="!usuarioTieneEquipo">
          <section style="margin-top:2%">
            <h2 style = "text-align: center">¡Únete a un equipo existente!</h2>
            <input
              type="text"
              v-model="busqueda"
              placeholder="Buscar equipo (Nombre del líder o del asesor)"
              @input="buscarEquipos"
              class="input"
            />
            <div class="card-grid">
              <div v-for="equipo in equiposFiltrados" :key="equipo.idEquipo" class="card">
                <h4>Líder: {{ obtenerLider(equipo) }}</h4>
                <p><strong>Asesor:</strong> {{ obtenerAsesor(equipo) }}</p>
                <p><strong>Institución:</strong> {{ obtenerInstitucion(equipo) }}</p>
                <p><strong>Participantes:</strong> {{ contarParticipantes(equipo) }} / {{ obtenerMaximo(equipo) }}</p>

                <button 
                  @click="unirseEquipo(equipo)"  
                  :disabled="contarParticipantes(equipo) >= obtenerMaximo(equipo)"
                  class="button1"
                  style="color: #ffffff; background-color: #6596FF;"
                >
                  {{ contarParticipantes(equipo) >= obtenerMaximo(equipo) ? 'Equipo lleno' : 'Unirse' }}
                </button>
              </div>
            </div>
          </section>
        </div>
        <v-dialog v-model="showModalClave" max-width="500px">
  <v-card>
    <v-card-title class="headline">Ingresa la clave de acceso</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="claveIngresada"
        label="Clave de acceso"
        
        outlined
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="showModalClave = false">Cancelar</v-btn>
      <v-btn color="blue darken-1" text @click="confirmarUnirse">Confirmar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    </div>
  </DIV>

</template>


<script>

import UploadDocumentDialog from "@/components/IdUpload.vue";
import api from  "../services/api.js"
  export default{
    components: { UploadDocumentDialog },
    name: "App",
    data(){
      return{
        usuario : JSON.parse(localStorage.getItem("userData")) || null,
        convocatorias: [],
        fileUploadDialog: false,
        proyectos: [],
        equipos: [],
        loading: false,
        loadingDone: false,
        selectedConvocatoria: null,
        asesores: [],
        participantes: [],
        EQUIPOS: [],
        dependencias: [],
        instituciones: [],
        equiposFiltrados: [],
        busqueda: '',
        idAsesor: 'none',
        MAX_PARTICIPANTES: '',
            showModalClave: false,
    claveIngresada: '',
    equipoSeleccionado: null
      }
    },


  computed: {
    usuarioTieneEquipo() {
      if (!this.usuario || !this.usuario.idParticipante) return false;
      const participante = this.participantes.find(p => p.idParticipante === this.usuario.idParticipante);
      return participante && participante.Equipo_idEquipo;
    }
  },

  created() {
    this.cargarAsesores()
    this.cargarParticipantes()
    this.cargarEquipos()
    this.cargarDependencias()
    this.cargarInstituciones()

  }, async mounted() {
    switch (this.usuario.Genero_idGenero) {
      case 1: this.$refs.baner.textContent = "¡Bienvenido!"; break;
      case 2: this.$refs.baner.textContent = "¡Bienvenida!"; break;
      case 3: this.$refs.baner.textContent = "¡Bienvenid@!"; break;
      default: console.log("ERROR GENERO"); break;
    }
    try {
      const response = await api.get('/api/convocatoria');
      this.convocatorias = JSON.parse(JSON.stringify(response.data));

    } catch (error) {
      console.log(error);

      this.$refs.asignados.textContent = "Asignados: 0";
      this.$refs.evaluados.textContent = "Evaluados: 0";
      this.$refs.pendientes.textContent = "Pendientes: 0";
    }
  },
  methods: {
    afterSuccesfulDelete() {
      window.location.reload();
    },

    async uploadIdFile(file) {
      this.loading = true;

      const archivo = file;
      const tamanioEnKB = (archivo.size / 1024).toFixed(2);
      const formData = new FormData();

      formData.append("nombre", archivo.name);
      formData.append("tamanio", tamanioEnKB);
      formData.append(
        "fechaIngreso",
        new Date().toISOString().split("T")[0]
      );
      formData.append("contenido", archivo);

      const response = await fetch("http://localhost:3000/api/archivos/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Archivo subido:", data.idArchivos);
      const recentFileId = data.idArchivos;
      console.log('My Sos', recentFileId)

      const usuario = JSON.parse(localStorage.getItem("userData")) || null;

      const responsePart = await fetch(`http://localhost:3000/api/participante/${usuario.idParticipante}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Archivos_idArchivos: recentFileId,
        }),
      });

      const currentUser = JSON.parse(localStorage.getItem('userData'));
      currentUser.Archivos_idArchivos = recentFileId;
      localStorage.setItem("userData", JSON.stringify(currentUser));

      const dataPart = await responsePart.json();
      console.log("Información actualizada: ", dataPart);
      this.loading = false;
      this.loadingDone = true;
    },
    async cargarAsesores() {
      const res = await fetch('http://localhost:3000/api/asesor/')
      this.asesores = await res.json()
    },
    async cargarParticipantes() {
      const res = await fetch('http://localhost:3000/api/participante/')
      this.participantes = await res.json()
    },
    async cargarEquipos() {
      const res = await fetch('http://localhost:3000/api/equipo/')
      this.EQUIPOS = await res.json()
      this.equiposFiltrados = this.EQUIPOS.filter(e => e.estado === 'Aprobado')
    },
    async cargarDependencias() {
      const res = await fetch('http://localhost:3000/api/dependencia/')
      this.dependencias = await res.json()
    },
    async cargarInstituciones() {
      const res = await fetch('http://localhost:3000/api/institucion/')
      this.instituciones = await res.json()
    },
    buscarEquipos() {
      const q = this.busqueda.toLowerCase()
      this.equiposFiltrados = this.EQUIPOS.filter(e => {
        if (e.estado !== 'Aprobado') return false
        const lider = this.participantes.find(p => p.idParticipante === e.Participante_idLider)
        const asesor = this.asesores.find(a => a.idAsesor === e.Asesor_idAsesor)
        const nomLider = lider ? `${lider.nombre} ${lider.apellidoPaterno}`.toLowerCase() : ''
        const nomAsesor = asesor ? `${asesor.nombre} ${asesor.apellidoPaterno}`.toLowerCase() : ''
        return nomLider.includes(q) || nomAsesor.includes(q)
      })
    },
    obtenerLider(equipo) {
      const p = this.participantes.find(p => p.idParticipante === equipo.Participante_idLider)
      return p ? `${p.nombre} ${p.apellidoPaterno}` : 'Sin líder'
    },
    obtenerAsesor(equipo) {
      const a = this.asesores.find(a => a.idAsesor === equipo.Asesor_idAsesor)
      return a ? `${a.nombre} ${a.apellidoPaterno}` : 'Sin asesor'
    },
    obtenerInstitucion(equipo) {
      const p = this.participantes.find(p => p.idParticipante === equipo.Participante_idLider)
      const d = this.dependencias.find(dep => dep.idDependencia === p?.Dependencia_idDependencia)
      const i = this.instituciones.find(inst => inst.idInstitucion === d?.Institucion_idInstitucion)
      return i?.nombre || 'Sin institución'
    },
    obtenerMaximo(equipo) {
      // Verifica si el equipo tiene la propiedad max_integrantes
      if (equipo && equipo.max_integrantes !== undefined) {
        return equipo.max_integrantes;
      }

      if (equipo.max_integrantes === undefined) {
        return '-1'; // Valor por defecto
      }
    },
    contarParticipantes(equipo) {
      return this.participantes.filter(p => p.Equipo_idEquipo === equipo.idEquipo).length
    },


    async unirseEquipo(equipo) {  // Ahora recibe el objeto equipo completo
    const usuario = JSON.parse(localStorage.getItem("userData")) || null;
    const actual = this.participantes.find(p => p.idParticipante === usuario.idParticipante);
    
    if (!actual) {
      alert('Debe iniciar sesión.');
      return;
    }
    
    if (actual.Equipo_idEquipo) {
      alert('Ya estás en un equipo.');
      return;
    }

    const total = this.contarParticipantes(equipo);
    const MAX_PARTICIPANTES = equipo.max_integrantes;
    
    if (total >= MAX_PARTICIPANTES) {
      alert('Este equipo ya está lleno.');
      return;
    }

    // Guarda el equipo seleccionado y muestra el modal
    this.equipoSeleccionado = equipo;
    this.showModalClave = true;
    this.claveIngresada = '';
    
    console.log("Intento de unirse al equipo:", equipo); // Para depuración
  }, 

      async confirmarUnirse() {
        if (!this.claveIngresada) {
          alert('Por favor ingresa la clave de acceso');
          return;
        }

        // Verifica la clave
        if (this.claveIngresada !== this.equipoSeleccionado.claveAcceso) {
          alert('Clave de acceso incorrecta');
          return;
        }

        try {
          const usuario = JSON.parse(localStorage.getItem("userData"));
          const response = await fetch(`http://localhost:3000/api/participante/${usuario.idParticipante}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              Equipo_idEquipo: this.equipoSeleccionado.idEquipo 
            })
          });

          if (!response.ok) throw new Error('Error en la respuesta del servidor');
          
          location.reload();
          
        } catch (error) {
          console.error('Error al unirse al equipo:', error);
          alert('No se pudo unir al equipo. Error: ' + error.message);
        } finally {
          this.showModalClave = false;
        }
      },
      async onCheckboxChange(item) {
        this.$refs.nombre.textContent = "Nombre: ";
        this.$refs.estado.textContent = "Estado: ";
        this.$refs.nombreA.textContent = "Asesor: ";
        this.$refs.estadoE.textContent = "Estado: ";
        this.$refs.promedioP.textContent = "Promedio: ";

        this.$refs.idE.textContent = "ID Equipo: ";
        this.$refs.integrantes.textContent = "Integrantes: ";

        try {
          const response2 = await api.get(`/api/equipo/participante/${this.usuario.idParticipante}`);
          const equiposos = JSON.parse(JSON.stringify(response2.data));
         


          await Promise.all(equiposos.map(async equipo => {
            
            const response3 = await api.get(`/api/proyectos/equipo/${equipo.idEquipo}`);
            const proyectosos = JSON.parse(JSON.stringify(response3.data));

            await Promise.all(proyectosos.map(async proyecto => {
              const response = await api.get(`/api/convocatoria/id/${proyecto.idProyecto}`);
              const convi = (JSON.parse(JSON.stringify(response.data)));

              if (convi[0].idConvocatoria === item.idConvocatoria) {
                this.proyectos = proyecto;
                this.$refs.nombre.textContent = "Nombre: " + proyecto.nombre;

                switch (proyecto.EstadosProyecto_idEstadosProyecto) {
                  case 1: this.$refs.estadoE.textContent = "Estado: Pendiente"; break;
                  case 2: this.$refs.estadoE.textContent = "Estado: Aceptado"; break;
                  case 3: this.$refs.estadoE.textContent = "Estado: Rechazado"; break;
                  case 4: this.$refs.estadoE.textContent = "Estado: Descalificado"; break;
                  case 5: this.$refs.estadoE.textContent = "Estado: Concluido"; break;
                }

                const response4 = await api.get(`/api/asesor/${equipo.Asesor_idAsesor}`);
                const aseso = JSON.parse(JSON.stringify(response4.data));
                this.$refs.nombreA.textContent = "Asesor: " + aseso[0].nombre + ' ' + aseso[0].apellidoPaterno + ' ' + aseso[0].apellidoMaterno;
                this.$refs.estado.textContent = "Estado: " + equipo.estado;
                this.$refs.idE.textContent = "ID Equipo: " + equipo.idEquipo;
                this.$refs.promedioP.textContent = "Promedio: " + (proyecto.promedio ?? "Sin calificar");

                const response5 = await api.get(`/api/participantes/${equipo.idEquipo}`);
                this.$refs.integrantes.textContent = "Integrantes: " + response5.data.length;
              }
            }));
          }));
        } catch (error) {
          console.error("Error al cargar datos:", error);

        }
      }
  }

}


</script>
<style>
.baner {
  font-weight: normal;
}



.form {
  max-width: 600px;
  margin: 20px auto;
  background-color: #d2dfff;
  padding: 20px;
  border-radius: 12px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

select,
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}

input {
  border-radius: 30px;
}

.button1 {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
}

.button1:hover {
  opacity: 0.9;
}

.input {
  max-width: 600px;
  margin: 0 auto 20px auto;
  display: block;
  padding: 10px;
  font-size: 16px;
  border-radius: 30px;
  border: 2px solid #6596FF;
  margin-top: 2%;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.43);
}
</style>