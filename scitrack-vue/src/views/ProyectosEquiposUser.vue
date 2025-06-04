<template>
  <div>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre +" "+ usuario?.apellidoPaterno}}</h2>
    </div>
    <div  style="border-radius:5px; margin-top: 0.666vw; padding: 1vw;  display: flex; flex-direction: row;background-color:#ffffff; gap: 15px;">
      
      <v-row style=" flex: 2; display: flex; flex-direction: column; gap: 15px; height: max-content; width: 50%; overflow-x: auto; background-color:#ffffff; border-radius: 5px; padding: 15px;">
        <v-col  class="elevation-2" style="width:900px; border-radius:5px; background-color: #BFD6FF; ">
          <h4 style="font-weight: bolder;">Equipo</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw;  padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="idE">ID Equipo: </h5>
            <h5 ref="integrantes">Integrantes:</h5>
            <h5 ref="estado">Estado: </h5>
            
          </div>

        </v-col>

        <v-col class="elevation-2" style="width:900px; border-radius:5px; background-color: #BFD6FF;  ">
          <h4 style="font-weight: bolder;">Proyecto</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw;  padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="nombre">Nombre: </h5>
            <h5 ref="nombreA">Asesor:</h5>
            <h5 ref="estadoE">Estado: </h5>
            <h5 ref="promedioP">Promedio: </h5>

          </div>
        </v-col>
      </v-row>
      <v-row style=" flex: 1; display: flex; flex-direction: column; gap: 15px; height: 600px; width: 200px; overflow-x: auto; background-color:#ffffff; border-radius: 5px; padding: 15px;">
        <v-col  style="flex:2;border-radius: 5px; height:max-content; width:480px; margin-left: 0.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Convocatorias:</h4>
          <div style="width:450px; border-radius:5px; margin-top: 0.666vw;  padding-right: 1.33vw; background-color: #EBF2FF; " class="elevation-5">
            <div style="width:420px; overflow-y: auto; background-color: #EBF2FF;" class="rounded px-5">
            <v-list style="background-color: #EBF2FF;">
              <v-radio-group v-model="selectedConvocatoria">
                  <v-radio
                  v-for="convocatoria in convocatorias"
                  :key="convocatoria.idConvocatoria"
                  :label="convocatoria.nombre"
                  :value="convocatoria.idConvocatoria"
                  @change="onCheckboxChange(convocatoria)"
                ></v-radio>
              </v-radio-group>
            </v-list>
          </div>
          </div>
        </v-col>
        
          <v-col  style=" display: flex;flex-direction:column; border-radius: 5px; height:100px; width:480px; margin-left: 0.5vw; background-color:#ffffff; ">
              <button 
                id="btnCrearProyecto" 
                type="button" 
                class="submit-button"
                @click="irACrearProyecto"
              >
                Crear un nuevo proyecto
              </button>
              <div v-if="!usuarioTieneEquipo" class= "botonAncho">
                <button 
                  id="btnCrearEquipo" 
                  type="button" 
                  class="submit-button2"
                  @click="irACrearEquipo"
                >
                  Crear un nuevo equipo
                </button>
              </div>
          </v-col>
        
      </v-row>
    </div>
  </DIV>

</template>


<script>
import api from  "../services/api.js"
  export default{
    name: "App",
    data(){
      return{
        usuario : JSON.parse(localStorage.getItem("userData")) || null,
        convocatorias: [],
        proyectos: [],
        PARTICIPANTE: [],
        equipos: [],
        selectedConvocatoria: null
      }
    },
  computed: {
    usuarioTieneEquipo() {
      if (!this.usuario || !this.usuario.idParticipante) return false;
      const participante = this.PARTICIPANTE.find(p => p.idParticipante === this.usuario.idParticipante);
      return participante && participante.Equipo_idEquipo;
    }
  },
  async mounted(){
      await this.cargarParticipantes();
      switch(this.usuario.Genero_idGenero){
        case 1: this.$refs.baner.textContent = "¡Bienvenido!"; break;
        case 2: this.$refs.baner.textContent = "¡Bienvenida!"; break;
        case 3: this.$refs.baner.textContent = "¡Bienvenid@!"; break;
        default: console.log("ERROR GENERO"); break;
      }
      try {
          const response = await api.get('/api/convocatoria');
          this.convocatorias = JSON.parse(JSON.stringify(response.data));
          
      }catch(error){
        console.log(error);
        
          this.$refs.asignados.textContent = "Asignados: 0";
          this.$refs.evaluados.textContent = "Evaluados: 0";
          this.$refs.pendientes.textContent="Pendientes: 0";
      }
    },
    methods: {
     async onCheckboxChange(item) {
      this.$refs.nombre.textContent = "Nombre: ";
      this.$refs.estado.textContent = "Estado: ";
      this.$refs.nombreA.textContent = "Asesor: ";
      this.$refs.estadoE.textContent = "Estado: ";
      this.$refs.idE.textContent = "ID Equipo: ";
      this.$refs.integrantes.textContent = "Integrantes: ";
      this.$refs.promedioP.textContent = "Promedio: ";

      try {
        const response2 = await api.get(`/api/equipo/participante/${this.usuario.idParticipante}`);
        const equiposos = JSON.parse(JSON.stringify(response2.data));

        await Promise.all(equiposos.map(async equipo => {
          const response3 = await api.get(`/api/proyectos/equipo/${equipo.idEquipo}`);
          const proyectosos = JSON.parse(JSON.stringify(response3.data));
          
          await Promise.all(proyectosos.map(async proyecto => {
            const response = await api.get(`/api/convocatoria/id/${proyecto.idProyecto}`);
            const convi = (JSON.parse(JSON.stringify(response.data)));
            
            if(convi[0].idConvocatoria === item.idConvocatoria) {
              this.proyectos = proyecto;
              this.$refs.nombre.textContent = "Nombre: "+ proyecto.nombre;
              
              switch(proyecto.EstadosProyecto_idEstadosProyecto) {
                case 1: this.$refs.estado.textContent = "Estado: Pendiente"; break;
                case 2: this.$refs.estado.textContent = "Estado: Aceptado"; break;
                case 3: this.$refs.estado.textContent = "Estado: Rechazado"; break;
                case 4: this.$refs.estado.textContent = "Estado: Descalificado"; break;
                case 5: this.$refs.estado.textContent = "Estado: Concluido"; break;
              }
              
              const response4 = await api.get(`/api/asesor/${equipo.Asesor_idAsesor}`);
              const aseso = JSON.parse(JSON.stringify(response4.data));
              this.$refs.nombreA.textContent = "Asesor: " + aseso[0].nombre + ' '+aseso[0].apellidoPaterno+' '+aseso[0].apellidoMaterno;
              this.$refs.estadoE.textContent = "Estado: " + equipo.estado;
              this.$refs.promedioP.textContent = "Promedio: " + (proyecto.promedio ?? "Sin calificar");

              this.$refs.idE.textContent = "ID Equipo: " + equipo.idEquipo;

              const response5 = await api.get(`/api/participantes/${equipo.idEquipo}`);
              this.$refs.integrantes.textContent = "Integrantes: " + response5.data.length;
            }
          }));
        }));
      } catch (error) {
        console.error("Error al cargar datos:", error);

      }
    },

    irACrearProyecto() {
      this.$router.push({ name: 'CrearProyecto' })
    },
    
    
    irACrearEquipo() {
      this.$router.push({ name: 'CrearEquipo' })
    },
        async cargarParticipantes() {
      try {
        const response = await fetch("http://localhost:3000/api/participante/");
        this.PARTICIPANTE = await response.json();
      } catch (error) {
        console.error("Error al obtener participantes:", error);
      }
    },
    }

  }


</script>
<style>
  .baner{
    font-weight: normal;
  }

.submit-button2 {
  margin-top: 10px;
  background: linear-gradient(to left, #543D99, #6596FF);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}
.submit-button {
  margin-top: 10px;
  background: linear-gradient(to left, #2668F5, #65C4FF);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
.botonAncho{
  width: 100%;
}
</style>