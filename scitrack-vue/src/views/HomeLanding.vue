<template>
    <v-container fluid class="pa-0 ma-0">
      <v-container fluid class="pa-0 ma-0 mb-15">
        <div class="hero">
          <v-container>
            <div
              class="d-flex flex-column align-center justify-center"
              style="gap: 0; width: 100%; margin-top: 5vw"
            >
              <p
                class="text-center d-md-block d-none ma-0 text-h1 hammersmith-one-regular"
                style="color: aliceblue; line-height: 1"
              >
                Organiza tus concursos con SCITRACK
              </p>
              <p
                class="text-center d-block d-md-none ma-0 text-h2 hammersmith-one-regular"
                style="color: aliceblue; line-height: 1"
              >
                Organiza tus concursos con SCITRACK
              </p>
              <p
                class="ma-0 text-center d-lg-block d-none mt-10 px-8 text-h4"
                style="color: aliceblue; width: 85%"
              >
                Organiza y optimiza tus concursos de proyectos con SciTrack,
                la plataforma ideal para gestionar cada etapa del proceso.
              </p>
            </div>
          </v-container>
        </div>
      </v-container>
  
      <v-container
        class="full-page-center"
        fluid
        style="gap: 0; width: 100vw"
      >
        <v-row
          no-gutters
          class="align-center justify-center px-6"
          style="width: 100%"
        >
          <v-col cols="12" md="6" class="px-8 text-h5 mb-6">
            <v-card flat tile>
              <p style="font-weight: bold">JUSTO A TU MEDIDA</p>
              <p style="text-align: justify; width: 100%">
                Diseñado para simplificar la gestión de concursos en
                instituciones de nivel medio superior y superior, SciTrack
                te ayuda a organizar cada detalle mientras garantizas el
                cumplimiento de los lineamientos y estándares académicos.
              </p>
              <ul>
                <li>Plataforma intuitiva y fácil de usar.</li>
                <li>Seguridad de datos con encriptación avanzada.</li>
                <li>Soporte y asistencia 24/7.</li>
                <li>Implementación rápida y sin complicaciones.</li>
                <li>
                  Actualizaciones periódicas con nuevas funcionalidades.
                </li>
              </ul>
            </v-card>
          </v-col>
  
          <v-col cols="12" md="6">
            <v-card flat tile>
              <img src="../señora.png" alt="" style="width: 100%" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <v-footer
        color="#062A78"
        class="pa-0 d-flex align-center justify-center"
        style="position: absolute; width: 100%; color: #062a78"
      >
        <v-card-text class="white--text d-flex" style="width: fit-content">
          <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down mr-2"
            contain
            min-width="100"
            src="../SCITRACK.png"
            width="100"
          />
          <p class="pa-0 ma-0 pt-1" style="width: auto">
            - {{ new Date().getFullYear() }}
          </p>
        </v-card-text>
  
        <v-card-text class="white--text" style="width: fit-content">
          <button>
            <v-img
              alt="Vuetify Name"
              class="shrink mt-1 hidden-sm-and-down mr-2"
              contain
              min-width="50"
              src="../mail.png"
              width="50"
            />
          </button>
        </v-card-text>
      </v-footer>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "HomeLanding",
  };
  </script>
  
  <style scoped>
  .hero {
    background: url("../pdro.png");
    background-size: cover;
    height: 73.5vh;
    width: 100vw;
  }
  .hammersmith-one-regular {
    font-family: "Hammersmith One", sans-serif !important;
    font-weight: 400;
    font-style: normal;
  }
  </style>
  