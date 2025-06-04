<template>
  <v-row class="px-6 py-3 position-fixed" style="background-color: aliceblue; min-height: 6%" >
    <v-col cols="10" lg="10" md="10" sm="12"> </v-col>
    <v-col
      cols="2"
      lg="2"
      md="2"
      sm="12"
      class="d-flex justify-end align-center"
    >
     

      <v-menu offset-y style="overflow-y: scroll;" v-if="bandera">
        <template  v-slot:activator="{ on, attrs }" >
          <v-icon v-bind="attrs" v-on="on" v-if="options.notificationStatus" class="mx-5"
            >mdi-bell-badge</v-icon
          >
          <v-icon v-bind="attrs" v-on="on" v-else class="mx-5">mdi-bell</v-icon>
        </template>
        <v-list style=" max-height: 10vw; ">
          <v-list-item
            v-for="noti in options.notis"
            :key="noti.idNotificacion"
            :class="noti.esLeido=='T' ? 'leida' : 'no-leida'"
            @click="vari.no='SI', notificacion=noti,actualiza(noti) , abrirArchivo(noti.Archivos_idArchivos)"
          >
            <v-list-item-title>
              {{ noti.asunto }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
            class="mx-5"
            v-bind="attrs"
            v-on="on"
          >mdi-cog</v-icon>
        </template>
        <v-list class="pa-3">
        <p @click="alerta()">Salir</p>
        </v-list>
      </v-menu>

      <h4 class="text-subtitle-1 mx-5">
        <span class="font-weight-bold mx-0 my-0 py-0 px-0">{{
          options.userName
        }}</span
        ><br />{{ options.userRole }}
      </h4>
      <v-img
        src="../assets/default-user-pfp.png"
        alt="User Profile"
        class="rounded-circle"
        max-width="40px"
        max-height="40px"
        cover
      />
    </v-col>
            <transition name="fade">
        <div v-if="vari.no=='SI'" class="overlay" @click.self="cerrar">
            <v-card  class="pa-8 pt-3 modal-card" style="overflow-y: scroll; scrollbar-width: none;  max-height: 60vh;" >
        <div style=" font-size: 2.5vmax; font-weight: bold; margin-top: 0vmax; " class="card-header ps-0 mb-3" >{{ notificacion.asunto }}</div> 
        
          <v-row  class="rounded py-3 px-2" style="background-color: #BFD6FF;">
            <v-col>
              <v-card style="width: 100%;">
                <h4 class="ps-5 mt-5">Fecha: {{ new Date(notificacion.fecha).toLocaleString().replaceAll(", 12:00:00 a.m.","") }}</h4>
                <h4 class="ps-5 mt-2">Mensaje: {{ notificacion.mensaje }} </h4>
              </v-card>
            </v-col>

          </v-row>
<v-row v-if="notificacion.Archivos_idArchivos" class="rounded py-3 px-2 mt-5 justify-center" style="background-color: #BFD6FF;">
  <v-col cols="12" style="height: 80vh; padding: 20px;">
    <iframe
      :src="pdfUrl + '#toolbar=1&navpanes=1&scrollbar=1'"
      style="width: 100%; height: 100%; border: none;"
      v-if="pdfUrl"
      type="application/pdf"
    ></iframe>
  </v-col>
</v-row>
      </v-card>
      </div>
      </transition>
  </v-row>


</template>

<script>
import api from '@/services/api';

export default {
  data(){
    return{
        notificacion: {},
  vari: {no:'NO'},
  pdfUrl: null,
  bandera: true
    }
  },
  name: "HeaderBase",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },mounted(){
    this.bandera = (!JSON.parse(localStorage.getItem('userData')).idAdministrador)
    console.log(this.bandera);

  },methods:{
          async abrirArchivo(Archivo_idArchivo){
            if(!Archivo_idArchivo)
            return

            const response = await api.get('/api/archivos/'+Archivo_idArchivo);
            const doc = JSON.parse(JSON.stringify(response.data[0]));

        const byteArray = new Uint8Array(doc.contenido.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      
      this.pdfUrl = URL.createObjectURL(blob);
      },
      cerrar(){
        this.vari.no = 'NO';
        this.pdfUrl = null;
      },
      async actualiza(noti){
        noti.esLeido = 'T';
        try{
          const response = await api.put('/api/notificacion/'+noti.idNotificacion,{esLeido:'T'});
          console.log(response);
        }catch(e){
          console.log(e);
        }
      },alerta(){
        localStorage.setItem('userData',null);
        location.reload();
      },
  }
};
</script>

<style>
  .fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
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
  width: 40%;
  max-width: 80%;
  background: white;
}

.very-rounded {
  border-radius: 10px;
}

.iframe-responsive {
  max-height: 60vh;
  height: 20vh;
}

@media (max-width: 960px) {
  .iframe-responsive {
    height: 60vh;
  }
}

.iframe-responsive-2 {
  height: 70vh;
}

@media (max-width: 960px) {
  .iframe-responsive-2 {
    height: 70vh;
  }
}

.bit-more-rounded {
  border-radius: 6px;
}

.denegar:hover{
  background-color: orangered;
  color: brown;
}
.aceptar:hover{
 color: cadetblue;
  background-color: lawngreen;
}
.aceptar, .denegar{
  border: solid 0.3vmax #BFD6FF ;
  color: #BFD6FF;
  transition: 0.7s;
}

.leida {
  /* Estilos para notificaciones leídas */
  background-color: #f5f5f5;
  color: #757575;
}

.no-leida {
  /* Estilos para notificaciones no leídas */
  background-color: #e3f2fd;
  color: #0d47a1;
  font-weight: bold;
}
</style>
