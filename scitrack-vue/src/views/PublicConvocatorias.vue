<template>
  <div style="background-color: #c4cef2; height: 100%">
    <extra>
      <v-dialog
          v-model="loading"
          max-width="400"
          persistent
          no-click-animation
        >
          <v-card class="text-center pa-5">
            <br /><v-progress-circular
              :size="100"
              :width="7"
              color="blue"
              indeterminate
            ></v-progress-circular
            ><br />
            <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
          </v-card>
        </v-dialog>
        <v-dialog v-model="loadingDone" :persistent="true" max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="green lighten-2"
              >mdi-check-circle</v-icon
            >
            <p class="font-weight-bold text-h4 mt-5">
              Se ha procesado su información
            </p>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="white"
                style="background-color: #6596ff"
                text
                @click="afterSuccesfulDelete()"
                >Aceptar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="showConv"
          max-width="1200"
          persistent
          no-click-animation
          :style="{ width: 'auto' }"
        >
          <v-card class="pa-5">
            <v-container>
              <v-row>
                <v-col cols="11">
                  <p class="font-weight-bold text-h4">
                    Información de la Convocatoria
                  </p>
                </v-col>
                <v-col cols="1">
                  <v-btn
                    color="red"
                    :ripple="false"
                    icon
                    @click="showConv = false"
                    style="
                      position: absolute;
                      top: 8px;
                      right: 8px;
                      z-index: 10;
                    "
                    ><v-icon>mdi-close-circle</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
            <v-container
              fluid
              style="background-color: #bfd6ff"
              class="very-rounded py-5 px-5 mt-4"
            >
              <v-row>
                <v-col cols="12" :md="pdfUrl ? 4 : 12">
                  <v-card
                    class="pa-4"
                    outlined
                    elevation="1"
                    style="background-color: #ffffff; border-radius: 10px"
                  >
                    <v-card-text>
                      <p class="text-h6 font-weight-regular">
                        <b>NOMBRE:</b> {{ currentConv.nombre }}
                      </p>
                      <p class="text-h6 font-weight-regular">
                        <b>DESCRIPCION:</b> {{ currentConv.descripcion }}
                      </p>
                      <p class="text-h6 font-weight-regular">
                        <b>ESTADO:</b> {{ currentConv.estado }}
                      </p>
                      <p class="text-h6 font-weight-regular">
                        <strong>FECHA DE INICIO:</strong>
                        {{ currentConv.fechaInicio }}
                      </p>
                      <p class="text-h6 font-weight-regular">
                        <strong>FECHA DE CIERRE:</strong>
                        {{ currentConv.fechaFin }}
                      </p>
                      <div v-if="pdfUrl">
                        <p class="text-h6 font-weight-regular">
                          <b>DOCUMENTO:</b>
                        </p>
                        <v-btn
                          color="white"
                          style="background-color: #6596ff; overflow: hidden"
                          text
                          @click="
                            openFileInNewTab(currentConv.Archivos_idArchivos)
                          "
                          >{{ pdfName }}</v-btn
                        >
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="8" class="hidden-xs-only">
                  <div>
                    <iframe
                      :src="pdfUrl"
                      class="iframe-responsive-2 very-rounded"
                      style="width: 100%"
                      v-if="pdfUrl"
                    ></iframe>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-dialog>
    </extra>
    <v-container
      style="background-color: #ffffff; max-width: 80%; height: 100%"
      class="px-5"
    >
      <h2>Convocatorias Disponibles</h2>

      <v-container
        fluid
        style="background-color: #bfd6ff; max-height: 85vh; overflow-y: auto"
        class="rounded py-5 px-5 mt-4 elevation-1"
      >
        <v-row dense>
          <v-col
            v-for="(card, index) in projectCards"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card
              class="pa-4"
              outlined
              elevation="1"
              style="background-color: #ffffff; border-radius: 10px"
            >
              <v-card-text>
                <div class="text--primary font-weight-bold">#{{ card.id }}</div>
                <div><strong>Nombre:</strong> {{ card.nombre }}</div>
                <div><strong>Estado:</strong> {{ card.estado }}</div>
                <div>
                  <strong>Fecha de inicio:</strong> {{ card.fechaInicio }}
                </div>
                <div><strong>Fecha de cierre:</strong> {{ card.fechaFin }}</div>
              </v-card-text>

              <v-card-actions>
                <v-row>
                  <v-col md="4" sm="12" xs="12" lg="4">
                    <v-btn
                      block
                      color="primary"
                      class="bit-more-rounded"
                      depressed
                      @click="openShowConvDIalog(card)"
                      >Ver más</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      ARCHIVO: null,
      projectCards: [],
      FASES: null,
      ITEMFASE: null,
      UBICACIONES: null,
      pdfName:"",
      pdfUrl:null,
      currentConv: {},
      showConv:false,
    };
  },
  methods: {
    weirdDateToNormalDate(rawDate) {
      const date = new Date(rawDate);

      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear();

      const formatted = `${day}-${month}-${year}`;

      return formatted;
    },
    openFileInNewTab() {
      const pdfWindow = window.open("");
      pdfWindow.document.write(`
          <html>
              <head><title>Visualizador PDF</title></head>
              <body style="margin:0">
                  <iframe width="100%" height="100%" src="${this.pdfUrl}" frameborder="0"></iframe>
              </body>
          </html>
      `);
    },
    generatePdfUrl(id) {
      const archivo = this.ARCHIVO?.find((a) => a.idArchivos === id);
      console.log("Cup ", id);
      if (!archivo || !archivo.contenido || !archivo.contenido.data) {
        console.warn("Archivo no disponible o mal formado.");
        this.pdfUrl = null;
        return;
      }

      const byteArray = new Uint8Array(archivo.contenido.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      this.pdfName = archivo.nombre;
      this.pdfUrl = URL.createObjectURL(blob);
    },

    openShowConvDIalog(card) {
      this.currentConv = card;
      this.showConv = true;
      this.generatePdfUrl(card.Archivos_idArchivos);
    },
  },
  mounted() {
    this.loading = true;
    Promise.all([
      fetch("http://localhost:3000/api/archivos/").then((res) => res.json()),
      fetch("http://localhost:3000/api/convocatoria/").then((res) =>
        res.json()
      ),
      fetch("http://localhost:3000/api/fase/").then((res) => res.json()),
      fetch("http://localhost:3000/api/itemconvocatoria_fase/").then((res) =>
        res.json()
      ),
      fetch("http://localhost:3000/api/ubicacion/").then((res) => res.json()),
    ])
      .then(
        ([
          archivosData,
          convocatoriaData,
          faseData,
          itemFaseData,
          ubicacionData,
        ]) => {
          this.ARCHIVO = archivosData;

          this.projectCards = convocatoriaData.map((item) => ({
            id: item.idConvocatoria,
            nombre: item.nombre,
            max_integrantes: item.max_integrantes,
            estado: item.estado || "Desconocido",
            descripcion: item.descripcion || "...",
            fechaInicioRaw: item.fechaInicio?.slice(0, 10) || "",
            fechaFinRaw: item.fechaFin?.slice(0, 10) || "",
            fechaInicio: this.weirdDateToNormalDate(item.fechaInicio),
            fechaFin: this.weirdDateToNormalDate(item.fechaFin),
            Archivos_idArchivos: item.Archivos_idArchivos,
          }));

          this.projectCards = this.projectCards.filter(
            (c) => c.estado !== "Inactiva"
          );

          this.FASES = faseData;

          this.ITEMFASE = itemFaseData;

          this.UBICACIONES = ubicacionData;

          this.loading = false;
        }
      )
      .catch((error) => {
        console.error("Error al obtener datos:", error);
      });
  },
};
</script>

<style scoped>
.very-rounded {
  border-radius: 10px;
}

.iframe-responsive {
  height: 50vh;
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
</style>