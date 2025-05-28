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
      <v-dialog v-model="alertEdit" max-width="400">
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

      <v-dialog v-model="deleteFileAlert" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="error darken-2"
            >mdi-alert</v-icon
          >
          <p class="font-weight-bold text-h4">¡Alerta!</p>
          <p class="text-h6 font-weight-regular">
            ¿Está seguro que desea eliminar este archivo?
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="white"
              style="background-color: #6596ff"
              text
              @click="deleteFileAlert = false"
              >Cancelar</v-btn
            >
            <v-btn
              color="white"
              style="background-color: #b1caff"
              text
              @click="deleteFileContinue()"
              >Aceptar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="loading" max-width="400" persistent no-click-animation>
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

      <v-dialog v-model="wrongFile" :persistent="false" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="red"
            >mdi-close-circle</v-icon
          >
          <p class="font-weight-bold text-h4 mt-5">
            Necesita subir un archivo válido
          </p>
        </v-card>
      </v-dialog>

      <v-dialog v-model="errorDialog" :persistent="true" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="red"
            >mdi-close-circle</v-icon
          >
          <p class="font-weight-bold text-h4 mt-5">
            Ocurrió un problema. Por favor, intentelo de nuevo más tarde
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
                              @click="deleteFileAlert = true"
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
                    <br />
                    <v-btn
                      class="flex-grow-1 text-truncate"
                      color="white"
                      style="
                        background-image: linear-gradient(
                          to right,
                          #2583d0,
                          #0d5181
                        );
                        max-width: 100%;
                      "
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
    v-model="editPhases"
    max-width="1200"
    persistent
    no-click-animation
    :style="{ width: 'auto' }"
  >
    <v-card class="pa-5">
      <v-container>
        <v-row>
          <v-col cols="11">
            <p class="font-weight-bold text-h4">Gestionar Fases</p>
          </v-col>
          <v-col cols="1">
            <v-btn
              color="red"
              :ripple="false"
              icon
              @click="editPhases = false"
              style="position: absolute; top: 8px; right: 8px; z-index: 10"
            >
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container
        fluid
        style="background-color: #bfd6ff"
        class="very-rounded py-5 px-5 mt-4"
      >
        <v-row>
          <v-col cols="12" md="6">
            <v-card
              class="pa-4"
              outlined
              elevation="1"
              style="background-color: #ffffff; border-radius: 10px"
            >
              <v-card-text>
                <!-- Phase Input Fields -->
                <v-text-field
                  v-model="phaseForm.nombre"
                  label="Nombre"
                  maxlength="45"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="phaseForm.modalidad"
                  label="Modalidad"
                  maxlength="45"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="phaseForm.calificacion"
                  label="Calificación mínima"
                  type="number"
                  required
                ></v-text-field>

                <v-menu
                  ref="menuInicio"
                  v-model="menuInicio"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="phaseForm.fechaInicio"
                      label="Fecha de Inicio"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="phaseForm.fechaInicio"
                    @input="menuInicio = false"
                  ></v-date-picker>
                </v-menu>

                <v-menu
                  ref="menuFin"
                  v-model="menuFin"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="phaseForm.fechaFin"
                      label="Fecha de Fin"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="phaseForm.fechaFin"
                    @input="menuFin = false"
                  ></v-date-picker>
                </v-menu>

                <v-textarea
                  v-model="phaseForm.descripcion"
                  label="Descripción"
                  maxlength="164"
                  rows="4"
                  required
                ></v-textarea>

                <v-text-field
                  v-model="phaseForm.ubicacion"
                  label="Ubicación (idUbicacion)"
                  placeholder="idUbicacion"
                ></v-text-field>

                <v-btn color="primary" @click="addPhase">Agregar fase</v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              class="pa-4"
              outlined
              elevation="1"
              style="background-color: #ffffff; border-radius: 10px"
            >
              <v-card-text>
                <div v-for="(phase, index) in phases" :key="index" class="mb-4">
                  <v-card outlined>
                    <v-card-title class="justify-space-between">
                      <span>{{ phase.nombre }}</span>
                      <div>
                        <v-btn icon @click="movePhaseUp(index)" :disabled="index === 0">
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                        <v-btn icon @click="movePhaseDown(index)" :disabled="index === phases.length - 1">
                          <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                      </div>
                    </v-card-title>
                    <v-card-text>
                      <p><strong>Descripción:</strong> {{ phase.descripcion }}</p>
                      <p><strong>Modalidad:</strong> {{ phase.modalidad }}</p>
                      <p><strong>Fecha de inicio:</strong> {{ phase.fechaInicio }}</p>
                      <p><strong>Fecha de cierre:</strong> {{ phase.fechaFin }}</p>
                      <p><strong>Calificación mínima:</strong> {{ phase.calificacion }}</p>
                      <p><strong>Ubicación:</strong> {{ phase.ubicacion || '---' }}</p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              class="flex-grow-1 text-truncate"
              color="white"
              style="
                background-image: linear-gradient(
                  to right,
                  #2583d0,
                  #0d5181
                );
                max-width: 100%;
              "
              text
              @click="confirmPhases"
            >
              Confirmar
            </v-btn>
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
      wrongFile: false,
      dialog: false,
      errorDialog: false,
      pdfFileUpload: null,
      deleteFileAlert: false,
      maxSize: 0.05 * 1024 * 1024,
      alreadyDeleted: false,
      succesfulDelete: false,
      showConv: false,
      editConv: false,
      phasesConv: false,
      newConv: false,
      hola: "s",
      loading: false,
      loadingDone: false,
      alertEdit: false,
      selectedConvocatoriaId: null,
      previousFile: null,
      currentConv: {},
      ARCHIVO: null,
      pdfUrl: null,
      pdfName: "",
      editPhases: false,
      isInvalidFile: false,
      projectCards: [],
      phaseForm: {
        nombre: '',
        modalidad: '',
        calificacion: null,
        fechaInicio: '',
        fechaFin: '',
        descripcion: '',
        ubicacion: ''
      },
      menuInicio: false,
      menuFin: false,
      phases: [],
      conv_to_edit: 1 
    };
  },

  methods: {
    addPhase() {
      const {
        nombre,
        modalidad,
        calificacion,
        fechaInicio,
        fechaFin,
        descripcion,
        ubicacion
      } = this.phaseForm;

      if (
        !nombre ||
        !modalidad ||
        !calificacion ||
        !fechaInicio ||
        !fechaFin ||
        !descripcion
      ) {
        alert("Ingrese la información en todos los campos");
        return;
      }

      this.phases.push({
        nombre,
        modalidad,
        calificacion,
        fechaInicio,
        fechaFin,
        descripcion,
        ubicacion: ubicacion || '---'
      });

      // Reset form
      this.phaseForm = {
        nombre: '',
        modalidad: '',
        calificacion: null,
        fechaInicio: '',
        fechaFin: '',
        descripcion: '',
        ubicacion: ''
      };
    },
    movePhaseUp(index) {
      if (index > 0) {
        const temp = this.phases[index];
        this.phases.splice(index, 1);
        this.phases.splice(index - 1, 0, temp);
      }
    },
    movePhaseDown(index) {
      if (index < this.phases.length - 1) {
        const temp = this.phases[index];
        this.phases.splice(index, 1);
        this.phases.splice(index + 1, 0, temp);
      }
    },
    async confirmPhases() {
      for (let i = 0; i < this.phases.length; i++) {
        const phase = this.phases[i];
        const phaseData = {
          nombre: phase.nombre,
          modalidad: phase.modalidad,
          fechaInicio: phase.fechaInicio,
          fechaFin: phase.fechaFin,
          descripcion: phase.descripcion,
          calificacion_minima: phase.calificacion
        };

        if (phase.ubicacion !== '---') {
          phaseData.Ubicacion_idUbicacion = phase.ubicacion;
        }

        try {
          const response = await fetch("http://localhost:3000/api/fase/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(phaseData)
          });

          const data = await response.json();

          await fetch("http://localhost:3000/api/itemconvocatoria_fase/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              Convocatoria_idConvocatoria: this.conv_to_edit,
              Fase_idFase: data.idFase,
              orden: i
            })
          });
        } catch (error) {
          console.error("Error:", error);
        }
      }

      alert('Se han registrado las fases correctamente');
      this.editPhases = false;
    },
    deleteFileContinue() {
      this.previousFile = this.currentConv.Archivos_idArchivos;
      this.currentConv.Archivos_idArchivos = null;
      this.pdfUrl = null;
      this.deleteFileAlert = false;
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
      this.editPhases = true;
      this.currentConv = card;
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
      this.isInvalidFile = false;
      console.log("attack ", file.size, "we ", this.maxSize);
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
      console.log("Finalmente: ", this.pdfFileUpload);
    },
    async saveEditConv() {
      this.alertEdit = false;
      this.loading = true;
      console.log("hoa", this.pdfUrl, " but then ", this.pdfFileUpload);

      if (
        this.pdfUrl == null &&
        (this.isInvalidFile || this.pdfFileUpload == null)
      ) {
        this.wrongFile = true;
        this.loading = false;
        return;
      }

      if (this.pdfUrl == null) {
        try {
          const archivo = this.pdfFileUpload;
          const tamanioEnKB = (archivo.size / 1024).toFixed(2);
          const formData = new FormData();

          formData.append("nombre", archivo.name);
          formData.append("tamanio", tamanioEnKB);
          formData.append(
            "fechaIngreso",
            new Date().toISOString().split("T")[0]
          );
          formData.append("contenido", archivo);

          const response = await fetch("http://localhost:3000/api/archivos/", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          console.log("Archivo subido:", data.idArchivos);
          this.currentConv.Archivos_idArchivos = data.idArchivos;
        } catch (error) {
          console.error("Error:", error);
          this.errorDialog = true;
          this.loading = false;
          return;
        }
      }

      const parseDate = (input) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
        const [day, month, year] = input.split("-");
        return `${year}-${month}-${day}`;
      };

      this.currentConv.fechaInicio = parseDate(this.currentConv.fechaInicioRaw);
      this.currentConv.fechaFin = parseDate(this.currentConv.fechaFin);

      try {
        const response = await fetch(
          "http://localhost:3000/api/convocatoria/" + this.currentConv.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: this.currentConv.nombre,
              descripcion: this.currentConv.descripcion,
              fechaInicio: this.currentConv.fechaInicio,
              fechaFin: this.currentConv.fechaFin,
              max_integrantes: this.currentConv.max_integrantes,
              Archivos_idArchivos: this.currentConv.Archivos_idArchivos,
            }),
          }
        );

        const result = await response.json();
        console.log(result);

        this.loading = false;
        this.loadingDone = true;
      } catch (error) {
        console.error("Error:", error);
        this.loading = false;
        this.errorDialog = true;
      }

      if (this.previousFile != null) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/archivos/${this.previousFile}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();
          console.log("Archivo borrado:", data);
          this.previousFile = null;
        } catch (error) {
          console.error("Delete Error:", error);

          return;
        }
      }
    },
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
