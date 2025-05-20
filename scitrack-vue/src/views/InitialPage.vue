<template>
  <div>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre +" "+ usuario?.apellidoPaterno}}</h2>
    </div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff;">
      
      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Equipos</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritos">Incritos: </h5>
            <h5 ref="aprobados">Aprobados: </h5>
            <h5 ref="pendientes">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyectos</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosp">Incritos: </h5>
            <h5 ref="aprobadosp">Aprobados: </h5>
            <h5 ref="pendientesp">Pendientes: </h5>
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
            <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Participantes</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritospa">Incritos: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Jueces</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosinv">Incritos: </h5>
            <h5 ref="aprobadosinv">Aprobados: </h5>
            <h5 ref="pendientesinv">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>
        
        <v-col class="rounded"  style="margin-left: 1.5vw;  ">

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

      this.$refs.baner.textContent = "¡Bienvenid@!";
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
      this.$refs.inscritos.textContent = "Inscritos: ";
      this.$refs.aprobados.textContent = "Aprobados: ";
      this.$refs.pendientes.textContent = "Pendientes: ";
      this.$refs.inscritosp.textContent = "Incritos: ";
      this.$refs.aprobadosp.textContent = "Aprobados: ";
      this.$refs.pendientesp.textContent = "Pendientes: ";
      this.$refs.inscritospa.textContent = "Inscritos: ";
      this.$refs.inscritosinv.textContent = "Inscritos: ";
      this.$refs.aprobadosinv.textContent = "Aprobados: ";
      this.$refs.pendientesinv.textContent = "Pendientes: ";

      try {

        

          var inscritos = 0;
          var aprobados = 0;
          var pendientes = 0;
          var aprobadosp =0;
          var pendientesp =0;
          var inscritospa = 0;
          var pendientesinv = 0;
          var aprobadosinv = 0;
          var inscritosinv =0;
          const response3 = await api.get(`/api/proyecto/`);
          const proyectosos = JSON.parse(JSON.stringify(response3.data));
         
          await Promise.all(proyectosos.map(async proyecto => {
            const response = await api.get(`/api/convocatoria/id/${proyecto.idProyecto}`);
            const convi = (JSON.parse(JSON.stringify(response.data)));
            
            if(convi[0].idConvocatoria === item.idConvocatoria) {
              
              inscritos++;
              if(proyecto.EstadosProyecto_idEstadosProyecto==1)
                pendientesp++;
              else if(proyecto.EstadosProyecto_idEstadosProyecto==2 || proyecto.EstadosProyecto_idEstadosProyecto==5)
                aprobadosp++;
              
              const response4 = await api.get(`/api/equipo/proyecto/${proyecto.idProyecto}`);
              const equiposos = JSON.parse(JSON.stringify(response4.data));
              
              if(equiposos[0].estado=="Aprobado")
                aprobados++;
              else if(equiposos[0].estado=="Pendiente de revisión")
                pendientes++;

              const response5 = await api.get(`/api/participantes/${equiposos[0].idEquipo}`);
              inscritospa += response5.data.length;

              const response6 = await api.get(`/api/investigador/${proyecto.Investigador_idInvestigador}`);
              const inve = JSON.parse(JSON.stringify(response6.data));
              inscritosinv++;
              if(inve[0].EstadoPersona_idEstadoPersona==1)
                pendientesinv++;
              else if(inve[0].EstadoPersona_idEstadoPersona==2||inve[0].EstadoPersona_idEstadoPersona==4)
                aprobadosinv++;

            }
          }));

                this.$refs.inscritos.textContent = "Inscritos: " + inscritos;
                this.$refs.aprobados.textContent = "Aprobados: " + aprobados;
                this.$refs.pendientes.textContent = "Pendientes: " + pendientes;
                this.$refs.inscritosp.textContent = "Incritos: " + inscritos;
                this.$refs.aprobadosp.textContent = "Aprobados: " + aprobadosp;
                this.$refs.pendientesp.textContent = "Pendientes: " + pendientesp;
                this.$refs.inscritospa.textContent = "Inscritos: " + inscritospa;
                this.$refs.inscritosinv.textContent = "Inscritos: " + inscritosinv;
                this.$refs.aprobadosinv.textContent = "Aprobados: " + aprobadosinv;
                this.$refs.pendientesinv.textContent = "Pendientes: " +pendientesinv;

     
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