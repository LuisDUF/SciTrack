<template>
  <v-col v-if="!esUno" cols="5" class="rounded mx-8 my-3"  style="background-color: #ffffff;">
    <label style="font-size: small; font-weight: bold;" >Nombre:</label> <label style="font-size: small;"> {{ nombre }}</label> <br>
    <label style="font-size: small; font-weight: bold;">Institución:</label> <label style="font-size: small;" > {{ institucion }}</label> <br>
    <label style="font-size: small; font-weight: bold;">Convocatoria: </label> <label style="font-size: small;"> {{ convocatoria }} </label> <br>
    <button @click="openModalRev()" class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
  </v-col>
    <v-col v-else cols="10" class="rounded mx-8 my-3"  style="background-color: #ffffff;">
    <label style="font-size: small; font-weight: bold;" >Nombre:</label> <label style="font-size: small;"> {{ nombre }}</label> <br>
    <label style="font-size: small; font-weight: bold;">Institución:</label> <label style="font-size: small;" > {{ institucion }}</label> <br>
    <label style="font-size: small; font-weight: bold;">Convocatoria</label> <label style="font-size: small;"> {{ convocatoria }}</label> <br>
    <button @click="openModalRev()" class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
  </v-col>
</template>

<script>
//import api from '@/services/api';





export default {
    
  props: {
    nombre: String,
    institucion: String,
    convocatoria: String,
    participante: Object,
    vari: Object,
    seleccion: Object,
    esUno: Boolean
  },methods:{
    async openModalRev(){
        
        
        this.$set(this.seleccion,'selectis',this.participante);
        this.$set(this.seleccion,'isti',this.participante.nombreIns);
        this.$set(this.seleccion,'archivos',this.participante.archivos);
        this.$set(this.vari,'no','SI');
    }
  }
};
</script>