<template>
  <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff;">
    <v-row><p style="font-size: small; font-weight: bold;" >Nombre: </p> <p style="font-size: small;" class="mx-1"> {{ `${nombre} ${investigador.apellidoPaterno} ${investigador.apellidoMaterno}` }}</p> </v-row>
    <v-row><p style="font-size: small; font-weight: bold;">Institución: </p> <p style="font-size: small;"  class="mx-1"> {{ institucion }}</p> </v-row>
    <v-row><p style="font-size: small; font-weight: bold;">Conocimiento: </p> <p style="font-size: small;" class="mx-1"> {{ conocimiento }}</p> </v-row>
    <v-row><p style="font-size: small; font-weight: bold;">Estado:  </p> <p style="font-size: small; color: darkred;" v-if="estado =='Pendiente de revisión'"  class="mx-1"> {{ estado }}</p>  <p style="font-size: small; color: #35B592;" v-if="estado =='Aprobado'" class="mx-1" > {{ estado }}</p> </v-row>
    <button @click="openModalRev()" class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
  </div>
</template>

<script>
import api from '@/services/api';




export default {
    
  props: {
    nombre: String,
    institucion: String,
    conocimiento: String,
    estado: String,
    investigador: Object,
    vari: Object,
    seleccion: Object
  },methods:{
    async openModalRev(){
        
        
        this.$set(this.seleccion,'selectis',this.investigador);
        var response = await api.get('/api/institucion/'+this.investigador.Institucion_idInstitucion);
        this.$set(this.seleccion,'isti',JSON.parse(JSON.stringify(response.data[0])));
        response = await api.get('/api/areaDeConocimientoInv/disciplina/'+this.investigador.Disciplina_idDisciplina);
        this.$set(this.seleccion,'area',JSON.parse(JSON.stringify(response.data[0])));
        response = await api.get('/api/archivos/investigador/'+this.investigador.idInvestigador);
        var archi =[]; 
        archi.push(...JSON.parse(JSON.stringify(response.data)));
        this.$set(this.seleccion,'archivos',archi);
        this.$set(this.vari,'no','SI');
    }
  }
};
</script>