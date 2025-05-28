<template>
  <div>
    <h2>Convocatorias</h2>
    <extra>
      <v-dialog v-model="dialog" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="error darken-2"
            >mdi-alert</v-icon
          >
          <p class="font-weight-bold text-h4">¡Alerta!</p>
          <p class="text-h6 font-weight-regular">
            ¿Está seguro que desea eliminar esta convocatoria?
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="white"
              style="background-color: #6596ff"
              text
              @click="dialog = false"
              >Cancelar</v-btn
            >
            <v-btn
              color="white"
              style="background-color: #b1caff"
              text
              @click="confirmDelete"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="alertEdit" max-width="400" >
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="error darken-2"
            >mdi-alert</v-icon
          >
          <p class="font-weight-bold text-h4">¡Alerta!</p>
          <p class="text-h6 font-weight-regular">
            ¿Está seguro que desea editar esta convocatoria?
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="white"
              style="background-color: #6596ff"
              text
              @click="alertEdit = false"
              >Cancelar</v-btn
            >
            <v-btn
              color="white"
              style="background-color: #b1caff"
              text
              @click="saveEditConv()"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="loading" max-width="400" persistent
      no-click-animation>
        <v-card class="text-center pa-5">
          <br><v-progress-circular
            :size="100"
            :width="7"
            color="blue"
            indeterminate
          ></v-progress-circular><br>
          <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
        </v-card>
      </v-dialog>

      <v-dialog v-model="loadingDone" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="green lighten-2"
            >mdi-check-circle</v-icon
          >
          <p class="font-weight-bold text-h4 mt-5">Se ha procesado su información</p>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="editConv"
        max-width="1200"
        persistent
        no-click-animation
        :style="{ width: 'auto' }"
      >
        <v-card class="pa-5">
          <v-container>
            <v-row>
              <v-col cols="11">
                <p class="font-weight-bold text-h4">Editar Convocatoria</p>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="red"
                  :ripple="false"
                  icon
                  @click="editConv = false"
                  style="position: absolute; top: 8px; right: 8px; z-index: 10"
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
              <v-col cols="12" :md="pdfUrl ? 6 : 12">
                <v-card
                  class="pa-4"
                  outlined
                  elevation="1"
                  style="background-color: #ffffff; border-radius: 10px"
                >
                  <v-card-text>
                    <p class="text-h6 font-weight-bold">NOMBRE:</p>
                    <v-text-field
                      type="text"
                      class=""
                      v-model="currentConv.nombre"
                      placeholder="Ingrese su nombre o nombres..."
                    ></v-text-field>

                    <p class="text-h6 font-weight-bold">DESCRIPCIÓN:</p>
                    <v-text-field
                      type="text"
                      class=""
                      v-model="currentConv.descripcion"
                      placeholder="Ingrese la descripcion..."
                    ></v-text-field>

                    <p class="text-h6 font-weight-bold">
                      NÚMERO MÁXIMO DE INTEGRANTES:
                    </p>
                    <v-text-field
                      type="number"
                      class=""
                      v-model="currentConv.max_integrantes"
                      placeholder="..."
                    ></v-text-field>

                    <p class="text-h6 font-weight-bold">
                      FECHA DE INICIO DE LA CONVOCATORIA:
                    </p>
                    <v-text-field
                      type="date"
                      class=""
                      placeholder="AAAA-MM-DD"
                      v-model="currentConv.fechaInicioRaw"
                    ></v-text-field>

                    <p class="text-h6 font-weight-bold">
                      FECHA DE CIERRE DE LA CONVOCATORIA:
                    </p>
                    <v-text-field
                      type="date"
                      class=""
                      placeholder="AAAA-MM-DD"
                      v-model="currentConv.fechaFinRaw"
                    ></v-text-field>

                    <div v-if="pdfUrl">
                      <p class="text-h6 font-weight-regular">
                        <b>DOCUMENTO:</b>
                      </p>
                      
                      <v-row class="d-flex align-center">
                        <v-col cols="6">
                          <div class="d-flex">
                            <v-btn
                              class="flex-grow-1 text-truncate"
                              color="white"
                              style="background-color: #6596ff; max-width: 100%"
                              text
                              @click="
                                openFileInNewTab(
                                  currentConv.Archivos_idArchivos
                                )
                              "
                            >
                              {{ pdfName }}
                            </v-btn>
                            <v-btn
                              color="white"
                              style="background-color: red; margin-left: 8px"
                              text
                              @click="
                                deleteFile(currentConv.Archivos_idArchivos)
                              "
                            >
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                      <v-file-input
                        v-model="pdfFileUpload"
                        label="Sube un archivo PDF (máximo 50kb)"
                        accept=".pdf"
                        prepend-icon="mdi-file-pdf-box"
                        show-size
                        :error="isInvalidFile"
                        :color="isInvalidFile ? 'red' : 'primary'"
                        small-chips
                        truncate-length="50"

                        @change="onFileSelected"
                        v-else
                      ></v-file-input>
                    <br>
                    <v-btn
                      class="flex-grow-1 text-truncate"
                      color="white"
                      style="background-image: linear-gradient(to right, #2583D0 , #0D5181);; max-width: 100%"
                      text
                      @click="alertEdit = true"
                    >
                      Confirmar
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6" class="hidden-xs-only">
                <div>
                  <iframe
                    :src="pdfUrl"
                    class="iframe-responsive very-rounded"
                    style="width: 100%"
                    v-if="pdfUrl"
                  ></iframe>
                </div>
              </v-col>
            </v-row>
          </v-container>
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
                  style="position: absolute; top: 8px; right: 8px; z-index: 10"
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
                    class="iframe-responsive very-rounded"
                    style="width: 100%"
                    v-if="pdfUrl"
                  ></iframe>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="alreadyDeleted" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="grey darken-2"
            >mdi-trash-can</v-icon
          >
          <p class="text-h6 font-weight-regular">
            Este elemento ya se encuentra inactivo
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="white"
              style="background-color: #6596ff"
              text
              @click="alreadyDeleted = false"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="succesfulDelete" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="error darken-2"
            >mdi-trash-can</v-icon
          >
          <p class="text-h6 font-weight-regular">Se ha borrado exitosamente</p>
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
    </extra>
    <template>
      <v-container
        fluid
        style="background-color: #bfd6ff"
        class="very-rounded py-5 px-5 mt-4"
      >
        <v-row dense>
          <v-col v-for="(card, index) in projectCards" :key="index" cols="12">
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
                  <v-col md="4" sm="12" xs="12" lg="2">
                    <v-btn
                      block
                      color="primary"
                      class="bit-more-rounded"
                      depressed
                      @click="openShowConvDIalog(card)"
                      >Ver más</v-btn
                    >
                  </v-col>
                  <v-col md="4" sm="12" xs="12" lg="2">
                    <v-btn
                      block
                      color="success"
                      class="bit-more-rounded"
                      depressed
                      @click="openEditDialog(card)"
                      >Editar</v-btn
                    >
                  </v-col>
                  <v-col
                    v-if="card.estado != 'Inactiva'"
                    md="4"
                    sm="12"
                    xs="12"
                    lg="2"
                  >
                    <v-btn
                      block
                      color="error darken-2"
                      class="bit-more-rounded"
                      depressed
                      @click="openDeleteDialog(card.id)"
                      >Eliminar</v-btn
                    >
                  </v-col>
                  <v-col
                    v-if="card.estado == 'Inactiva'"
                    md="4"
                    sm="12"
                    xs="12"
                    lg="2"
                  >
                    <v-btn
                      block
                      color="grey "
                      class="bit-more-rounded"
                      depressed
                      @click="alreadyDeleted = true"
                      >Eliminar</v-btn
                    >
                  </v-col>
                  <v-col md="4" sm="12" xs="12" lg="2">
                    <v-btn
                      block
                      color="purple darken-3"
                      dark
                      class="bit-more-rounded"
                      @click="openPhases(card)"
                      depressed
                      >Fases</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
export default {
  name: "ProjectCardList",
  data() {
    return {
      dialog: false,
      pdfFileUpload:null,
      maxSize: 0.05 * 1024 * 1024, 
      alreadyDeleted: false,
      succesfulDelete: false,
      showConv: false,
      editConv: false,
      phasesConv: false,
      newConv: false,
      hola: "s",
      loading: false,
      loadingDone:false,
      alertEdit: false,
      selectedConvocatoriaId: null,
      currentConv: {},
      ARCHIVO: null,
      pdfUrl: null,
      pdfName: "",
      isInvalidFile:false,
      projectCards: [],
    };
  },

  methods: {
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
    openEditDialog(card) {
      this.editConv = true;
      this.currentConv = card;
      this.generatePdfUrl(card.Archivos_idArchivos);
    },
    openShowConvDIalog(card) {
      this.currentConv = card;
      this.showConv = true;
      this.generatePdfUrl(card.Archivos_idArchivos);
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
    weirdDateToNormalDate(rawDate) {
      const date = new Date(rawDate);

      const day = date.getUTCDate().toString().padStart(2, "0");
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const year = date.getUTCFullYear();

      const formatted = `${day}-${month}-${year}`;

      return formatted;
    },
    openDeleteDialog(id) {
      this.selectedConvocatoriaId = id;
      this.dialog = true;
    },
    openPhases(card) {
      const idk = card;
      if (idk) console.log("borrame");
    },
    confirmDelete() {
      if (this.selectedConvocatoriaId !== null) {
        this.deleteConvocatoria(this.selectedConvocatoriaId);
      }
      this.dialog = false;
    },
    deleteConvocatoria(id) {
      fetch("http://localhost:3000/api/convocatoria/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "Inactiva",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.succesfulDelete = true;
        })
        .catch((error) => console.error("Error:", error));
    },
    afterSuccesfulDelete() {
      this.succesfulDelete = false;
      window.location.reload();
    },
    onFileSelected(file) {
      if (!file) return;
      console.log('attack ',file.size,'we ',this.maxSize)
      if (file.type !== "application/pdf") {
        console.log("error", "El archivo debe ser un PDF.");
        this.isInvalidFile = true;
      } else if (file.size > this.maxSize) {
        console.log("error", "El archivo excede el límite de 2 MB.");
        this.isInvalidFile = true;
      } else {
        console.log("Archivo PDF válido:", file);
        // Process file (e.g., upload)
      }
      console.log('Finalmente: ',this.pdfFileUpload)
    },
    saveEditConv(){
      this.alertEdit = false;
      this.loading = true;
      const parseDate = (input) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
        const [day, month, year] = input.split('-');
        return `${year}-${month}-${day}`;
      };
      this.currentConv.fechaInicio = parseDate(this.currentConv.fechaInicioRaw);
      this.currentConv.fechaFin = parseDate(this.currentConv.fechaFin);

      fetch("http://localhost:3000/api/convocatoria/"+this.currentConv.id, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre:this.currentConv.nombre,
            descripcion:this.currentConv.descripcion,
            fechaInicio:this.currentConv.fechaInicio,
            fechaFin:this.currentConv.fechaFin,
            max_integrantes:this.currentConv.max_integrantes
        }),
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          this.loading = false;
          this.loadingDone = true;
        })
        .catch((error) => console.error("Error:", error));
    }
  },
  mounted() {
    this.loading = true;
    Promise.all([
      fetch("http://localhost:3000/api/archivos/").then((res) => res.json()),
      fetch("http://localhost:3000/api/convocatoria/").then((res) =>
        res.json()
      ),
    ])
      .then(([archivosData, convocatoriaData]) => {
        this.loading = false;


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


      })
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

.bit-more-rounded {
  border-radius: 6px;
}
</style>
