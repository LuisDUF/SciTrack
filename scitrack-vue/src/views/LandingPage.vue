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
  class="pa-0" 
  style="max-width: 100%; margin: auto;"
>
  <v-row no-gutters class="justify-center">
    <v-col cols="12" md="11" lg="10">
      <v-row class="align-center">
        <v-col cols="12" md="6" class="pa-3">  <!-- Padding reducido -->
          <v-card flat>
            <p style="font-weight: bold; font-size: 1.3rem;">JUSTO A TU MEDIDA</p>
            <p style="font-size: 1.3rem; text-align: justify;">
              Diseñado para simplificar la gestión de concursos en instituciones de nivel medio superior y superior, SciTrack te ayuda a organizar cada detalle mientras garantizas el cumplimiento de los lineamientos y estándares académicos.
            </p>
          <ul style="font-size: 1.3rem; line-height: 1.8; padding-left: 1.5rem; margin: 0;">
          <li style="margin-bottom: 0;">Plataforma intuitiva y fácil de usar.</li>
          <li style="margin-bottom: 0;">Seguridad de datos con encriptación avanzada.</li>
          <li style="margin-bottom: 0;">Soporte y asistencia 24/7.</li>
          <li style="margin-bottom: 0;">Implementación rápida y sin complicaciones.</li>
          <li>Actualizaciones periódicas con nuevas funcionalidades.</li>
          </ul>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" class="pa-0">
          <img src="../señora.png" style="width: 100%;">
        </v-col>
      </v-row>
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
