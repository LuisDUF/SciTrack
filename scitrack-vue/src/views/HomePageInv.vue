<template>
  <div>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre +" "+ usuario?.apellidoPaterno}}</h2>
    </div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff;">
      
      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="8" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyectos</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="asignados">Asignados: </h5>
            <h5 ref="evaluados">Evaluados:</h5>
            <h5 ref="pendientes">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>
        
        <v-col class="rounded"  style="margin-left: 2vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Convocatorias:</h4>
          <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF;">
            <v-list style="background-color: #EBF2FF;">
              <v-list-item
                v-for="(convocatoria, index) in convocatorias"
                :key="index"
              >
               <p>{{convocatoria.nombre}}</p>
              </v-list-item>
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
          
          const response2 = await api.get(`/api/proyectos/id/${this.usuario.idInvestigador}`);
          this.proyectos = JSON.parse(JSON.stringify(response2.data));
        
          this.$refs.asignados.textContent = "Asignados: "+ this.proyectos.length;
          this.$refs.evaluados.textContent = "Evaluados: "+ this.proyectos.filter(s=> s.promedio!=null).length
          this.$refs.pendientes.textContent="Pendientes: "+this.proyectos.filter(s=>s.promedio==null).length
      }catch(error){
        console.log(error);
        
          this.$refs.asignados.textContent = "Asignados: 0";
          this.$refs.evaluados.textContent = "Evaluados: 0";
          this.$refs.pendientes.textContent="Pendientes: 0";
      }
    },methods: {

    }

  }


</script>
<style>
  .baner{
    font-weight: normal;
  }
</style>