<template>
  <div>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre +" "+ usuario?.apellidoPaterno}}</h2>
    </div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff;">
      
      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Equipo</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="idE">ID Equipo: </h5>
            <h5 ref="integrantes">Integrantes:</h5>
            <h5 ref="estado">Estado: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyecto</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="nombre">Nombre: </h5>
            <h5 ref="nombreA">Asesor:</h5>
            <h5 ref="estadoE">Estado: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>
        
        <v-col class="rounded"  style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Convocatorias:</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF;">
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
        equipos: [],
        selectedConvocatoria: null


      }
    },
    created(){

    },async mounted(){
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
    },methods: {
     async onCheckboxChange(item) {
      this.$refs.nombre.textContent = "Nombre: ";
      this.$refs.estado.textContent = "Estado: ";
      this.$refs.nombreA.textContent = "Asesor: ";
      this.$refs.estadoE.textContent = "Estado: ";
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
              this.$refs.nombreA.textContent = "Asesor: " + aseso[0].nombre;
              this.$refs.estadoE.textContent = "Estado: " + equipo.estado;
              this.$refs.idE.textContent = "ID Equipo: " + equipo.idEquipo;

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
  .baner{
    font-weight: normal;
  }
</style>  