<template>
  <div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff">
      <h1>Participantes</h1>
      <v-row class="pa-4" style="background-color: #ffffff">
        <v-col
          class="rounded user-list elevation-1"
          cols="12"
          md="7"
          style="background-color: #bfd6ff; overflow-y: auto"
        >
          <itemListaPart
            v-for="(pendiente, index) in pendientes"
            :key="index"
            :nombre="pendiente.nombre"
            :institucion="pendiente.nombreIns"
            :conocimiento="
              pendiente.nombreAre != null
                ? pendiente.nombreAre
                : 'Sin especificar'
            "
            :estado="pendiente.estadoP"
            :investigador="pendiente"
            :vari="vari"
            :seleccion="elegido"
          />
        </v-col>

        <v-col cols="12" md="1"></v-col>
        <v-col cols="12" md="4" class="rounded">
          <v-row>
            <v-col class="rounded" cols="12" style="background-color: #bfd6ff">
              <h4 style="font-weight: bold">Filtrar por convocatoria:</h4>
              <div
                class="rounded"
                style="
                  margin-top: 0.666vw;
                  padding: 1vw;
                  padding-left: 1.33vw;
                  padding-right: 1.33vw;
                  background-color: #ebf2ff;
                "
              >
                <div
                  style="
                    max-height: 17vh;
                    overflow-y: auto;
                    background-color: #ebf2ff;
                  "
                >
                  <v-list style="background-color: #ebf2ff">
                    <v-radio-group
                      v-model="selectedConvocatoria"
                      style="margin-top: 0"
                    >
                      <v-radio
                        v-for="Convocatoria in CONVOCATORIAS"
                        :key="Convocatoria.idConvocatoria"
                        :label="Convocatoria.nombre"
                        :value="Convocatoria.idConvocatoria"
                        @change="
                          (selectedConvocatoria = Convocatoria),
                            onCheckboxChange()
                        "
                      ></v-radio>
                    </v-radio-group>
                  </v-list>
                </div>
              </div>
            </v-col>
            <v-col
              class="rounded my-4"
              cols="12"
              style="background-color: #bfd6ff"
            >
              <h4 style="font-weight: bold">Filtrar por institución:</h4>
              <div
                class="rounded"
                style="
                  margin-top: 0.666vw;
                  padding: 1vw;
                  padding-left: 1.33vw;
                  padding-right: 1.33vw;
                  background-color: #ebf2ff;
                "
              >
                <div
                  style="
                    max-height: 17vh;
                    overflow-y: auto;
                    background-color: #ebf2ff;
                  "
                >
                  <v-list style="background-color: #ebf2ff">
                    <v-radio-group
                      v-model="selectedInstitucion"
                      style="margin-top: 0"
                    >
                      <v-radio
                        v-for="Institucion in Institucions"
                        :key="Institucion.idInstitucion"
                        :label="Institucion.nombre"
                        :value="Institucion.idInstitucion"
                        @change="
                          (selectedInstitucion = Institucion),
                            onCheckboxChange()
                        "
                      ></v-radio>
                    </v-radio-group>
                  </v-list>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <transition name="fade">
        <div v-if="vari.no == 'SI'" class="overlay" @click.self="cerrar">
          <v-card class="pa-8 pt-3 modal-card" style="width: 80%">
            <h2 class="card-header ps-0 mb-3">Información</h2>

            <v-row
              class="rounded py-3 px-2"
              style="
                background-color: #bfd6ff;
                max-height: 90vh;
                overflow-y: auto;
              "
            >
              <v-col
                :md="elegido.selectis.Archivos_idArchivos == null ? 12 : 6"
                cols="12"
              >
                <v-card style="width: 100%" class="iframe-responsive">
                  <p class="ps-5 pt-3">
                    <b>Nombre:</b>
                    {{
                      `${elegido.selectis.nombre} ${elegido.selectis.apellidoPaterno} ${elegido.selectis.apellidoMaterno}`
                    }}
                  </p>
                  <p class="ps-5 mt-5">
                    <b>Institucion: </b> {{ elegido.isti.nombre }}
                  </p>
                  <p class="ps-5 mt-5">
                    <b>Correo: </b> {{ elegido.selectis.correo }}
                  </p>
                  <p class="ps-5 mt-5">
                    <b>Teléfono: </b> {{ elegido.selectis.telefono }}
                  </p>
                  <p class="ps-5 mt-5">
                    <b>Convocatoria: </b> {{ elegido.area.nombre }}
                  </p>
                  <p
                    class="ps-5 mt-5"
                    v-if="elegido.selectis.Archivos_idArchivos != null"
                  >
                    <b>Documentos:</b>
                  </p>
                  <v-list
                    class="ps-5 mt-0"
                    v-if="elegido.selectis.Archivos_idArchivos != null"
                  >
                    <v-radio-group class="mt-0">
                      <v-radio
                        v-for="(doc, index) in elegido.archivos"
                        :key="index"
                        :label="doc.nombre"
                        :value="index"
                        @change="abrirArchivo(doc)"
                      ></v-radio>
                    </v-radio-group>
                  </v-list>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <iframe
                  :src="pdfUrl"
                  class="iframe-responsive very-rounded"
                  style="width: 100%"
                  v-if="pdfUrl"
                ></iframe>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import itemListaPart from "@/components/itemListaPart.vue";

export default {
  components: { itemListaPart },
  name: "App",
  data() {
    return {
      CONVOCATORIAS: [],
      Institucions: [],
      investigadores: [],
      selectedConvocatoria: "Todos",
      selectedInstitucion: "Todos",
      pendientes: [],
      aceptados: [],
      vari: { no: "NO" },
      elegido: { selectis: null, isti: null, area: null, archivos: null },
      pdfUrl: null,
      selectedPdf: 0,
    };
  },
  created() {
    this.onCheckboxChange();
  },
  async mounted() {
    try {
      const res1 = await fetch("http://localhost:3000/api/convocatoria");
      const data1 = await res1.json();
      this.CONVOCATORIAS = JSON.parse(JSON.stringify(data1));
      this.CONVOCATORIAS.splice(0, 0, {
        nombre: "Todos",
        idConvocatoria: "Todos",
      });

      const res2 = await fetch("http://localhost:3000/api/institucion");
      const data2 = await res2.json();
      this.Institucions = JSON.parse(JSON.stringify(data2));
      this.Institucions.splice(0, 0, {
        nombre: "Todos",
        idInstitucion: "Todos",
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async aprobar(investigador, esAprobado) {
      console.log(investigador.idParticipante);
      const response = await fetch(
        `http://localhost:3000/api/investigador/${investigador.idParticipante}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            EstadoPersona_idEstadoPersona: esAprobado ? 2 : 3,
          }),
        }
      );
      if (response.ok) alert("Realizado");
      location.reload();
    },
    abrirArchivo(doc) {
      const byteArray = new Uint8Array(doc.contenido.data);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      this.pdfUrl = URL.createObjectURL(blob);
    },
    cerrar() {
      this.vari.no = "NO";
      this.pdfUrl = null;
    },
    async onCheckboxChange() {
      this.aceptados = [];
      this.pendientes = [];
      this.investigadores = [];
      try {
        const res = await fetch(
          `http://localhost:3000/api/participante/and/convocatoria/`
        );
        const data = await res.json();
        this.investigadores = JSON.parse(JSON.stringify(data));

        let inv2 = [];
        inv2 = JSON.parse(JSON.stringify(data)); // shallow clone

        if (this.selectedConvocatoria !== "Todos") {
        inv2 = inv2.filter(
            (i) => i.idConvocatoria == this.selectedConvocatoria
        );
        }

        if (this.selectedInstitucion !== "Todos") {
        inv2 = inv2.filter(
            (i) => i.idInstitucion == this.selectedInstitucion
        );
        }
        if (inv2.length > 0) {
          inv2 = inv2.filter(
            (item, index, self) =>
              index ===
              self.findIndex((t) => t.idParticipante === item.idParticipante)
          );
          this.investigadores = inv2;
        } else if (
          this.selectedConvocatoria !== "Todos" ||
          this.selectedInstitucion !== "Todos"
        ) {
          this.investigadores = [];
        }

        this.investigadores.forEach(async (inv) => {
          if (inv.idInstitucion != null) {
            const resIns = await fetch(
              `http://localhost:3000/api/institucion/${inv.idInstitucion}`
            );
            const ins = await resIns.json();
            inv.nombreIns = ins[0].nombre;
          }
          if (inv.idConvocatoria != null) {
            const resAre = await fetch(
              `http://localhost:3000/api/convocatoria/${inv.idConvocatoria}`
            );
            const are = await resAre.json();
            inv.nombreAre = are[0].nombre;
          }
          this.pendientes.push(inv);
          if (inv.EstadoPersona_idEstadoPersona == 1) {
            inv.estadoP = "Pendiente de revisión";
            this.pendientes.push(inv);
          } else if (inv.EstadoPersona_idEstadoPersona == 2) {
            inv.estadoP = "Aprobado";
            this.aceptados.push(inv);
          }
        });


      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
  },
};
</script>

<style scoped>
.baner {
  font-weight: normal;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
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
  max-width: 80%;
  background: white;
}

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

.iframe-responsive-3 {
  height: 30vh;
}

@media (max-width: 960px) {
  .iframe-responsive-3 {
    height: 30vh;
  }
}

.user-list {
  height: 65vh;
}

@media (max-width: 960px) {
  .user-list {
    height: 40vh;
  }
}

.bit-more-rounded {
  border-radius: 6px;
}

.denegar:hover {
  background-color: orangered;
  color: brown;
}
.aceptar:hover {
  color: cadetblue;
  background-color: lawngreen;
}
.aceptar,
.denegar {
  border: solid 0.3vmax #bfd6ff;
  color: #bfd6ff;
  transition: 0.7s;
}
</style>
