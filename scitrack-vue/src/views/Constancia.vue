<template>
<div class="overlay">
    
    <v-card  class="pb-3 modal-card" >
                <div class="d-flex align-center justify-center pa-5" style="background-color: #062A78;">
          <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            @click="reloadPage()"
            min-width="200"
            src="../SCITRACK.png"
            width="100"
          />
        </div>
<div style=" font-size: 2.5vmax; font-weight: bold; margin-top: 0vmax; " class="card-header ps-0 mb-3 text-center" >Constancia validada por Scitrack</div> 
<div class="text-center">
    <h3>Participante: {{ this.participante.nombre }}</h3>
    <h3>Proyecto: {{ this.proyecto.nombre}}</h3>
</div>

</v-card>
</div>
</template>
<script>
import api from '@/services/api'

    export default{
        name: "App",
        data(){
            return {
                participante: null,
                proyecto: null
            }
        },async created(){

            this.participante = (await api.get('/api/participante/'+this.$route.params.id)).data[0];
            this.proyecto = (await api.get('/api/proyecto/'+this.$route.params.proy)).data[0];

        },async mounted(){
        }
    }
</script>
<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Oscurece el fondo */
  z-index: 1000; /* Por encima del contenido normal */
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-card {
  position: relative;
  z-index: 1001; /* Mayor que el overlay */
  width: 60%;
  max-width: 80%;
  background: white;
}
</style>