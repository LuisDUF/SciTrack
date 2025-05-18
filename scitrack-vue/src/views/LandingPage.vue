<template>
  <v-app>
    <v-app-bar
      app
      color=#062A78
      dark
    >
    
      <div class="d-flex align-center">
        

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="200"
          src="../SCITRACK.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="goToLogin" 
        target="_blank"
        text
        color=#DFFFFF
        style="background-color: #4277FF;"
      >
        <span class="mr-2">Acceder</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
     <template>
  <v-container fluid class="pa-0 ma-0">

  <v-container fluid class="pa-0 ma-0 mb-15">
    <div class="hero">
      <v-container >
        <div class="d-flex flex-column align-center justify-center" style="gap: 0; width: 100%; margin-top: 5vw;">
          <p class="text-center ma-0 hammersmith-one-regular" style="color: aliceblue; font-size: 5vw; line-height: 1;">
            Organiza tus concursos con SCITRACK
          </p>        
          <p class="ma-0 text-center mt-10 px-8 " style=" color: aliceblue; width: 85%; font-size: 1.8vw;">
            Organiza y optimiza tus concursos de proyectos con SciTrack, la plataforma ideal para gestionar cada etapa del proceso.
          </p>
        </div>
      </v-container>
    </div>
  </v-container>

<v-container
  class="full-page-center"
  fluid
  style="gap: 0; width: 100vw;"
>
  <v-row no-gutters class="align-center justify-center" style="width: 100%;">
    <v-col cols="5" class="pe-12">
      <v-card flat tile>
        <p style="font-weight: bold; font-size: 1.4vw;">JUSTO A TU MEDIDA</p>
        <p style="font-size: 1.4vw; text-align: justify; width: 100%;">
          Diseñado para simplificar la gestión de concursos en instituciones de nivel medio superior y superior, SciTrack te ayuda a organizar cada detalle mientras garantizas el cumplimiento de los lineamientos y estándares académicos.
        </p>
        <ul style="font-size: 1.4vw;">
          <li>Plataforma intuitiva y fácil de usar.</li>
          <li>Seguridad de datos con encriptación avanzada.</li>
          <li>Soporte y asistencia 24/7.</li>
          <li>Implementación rápida y sin complicaciones.</li>
          <li>Actualizaciones periódicas con nuevas funcionalidades.</li>
        </ul>
      </v-card>
    </v-col>
   
    <v-col cols="6">
      <v-card flat tile>
        <img src="../señora.png" alt="" style="width: 100%;">
      </v-card>
    </v-col>
  </v-row>
</v-container>
      
  </v-container>
</template>
      
    </v-main>
  </v-app>
</template>



<script>
export default {
  name: "App",
  methods: {
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};

</script>

<style scoped>



      .hero {
        background: url('../pdro.png');
        background-size: cover;
        height: 73.5vh;
        width: 100vw;
      }
      .hammersmith-one-regular {
      font-family: "Hammersmith One", sans-serif;
      font-weight: 400;
      font-style: normal;
    
    }
</style>
