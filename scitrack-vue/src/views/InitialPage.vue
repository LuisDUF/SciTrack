<template>

  <div>
    <extra>

      <v-dialog v-model="loading" max-width="400" persistent no-click-animation>
        <v-card class="text-center pa-5">
          <br /><v-progress-circular :size="100" :width="7" color="blue" indeterminate></v-progress-circular><br />
          <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
        </v-card>
      </v-dialog>
      <v-dialog v-model="loadingDone" :persistent="true" max-width="400">
        <v-card class="text-center pa-5">
          <v-icon class="text-h1 text-center mt-4" color="green lighten-2">mdi-check-circle</v-icon>
          <p class="font-weight-bold text-h4 mt-5">
            Se han procesado las fases
          </p>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="white" style="background-color: #6596ff" text @click="loadingDone = false">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </extra>
    <div class=" px-4 py-4 rounded" style="background-color: #ffffff; ">
      <h2 ref="baner" class="baner"></h2>
      <h2 class="nombreUsuario">{{ usuario?.nombre + " " + usuario?.apellidoPaterno }}</h2>
    </div>
    <div class="pa-4 mt-4 rounded" style="background-color: #ffffff;">
      <h2 class="mb-4">General:</h2>
      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Equipos</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritos">Incritos: </h5>
            <h5 ref="aprobados">Aprobados: </h5>
            <h5 ref="pendientes">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;"
              @click="dea()">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyectos</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosp">Incritos: </h5>
            <h5 ref="aprobadosp">Aprobados: </h5>
            <h5 ref="pendientesp">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>

        <v-col class="rounded" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Convocatorias:</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #EBF2FF; ">
            <div style="max-height: 5.5vw; overflow-y: auto; background-color: #EBF2FF;">
              <v-list style="background-color: #EBF2FF;">
                <v-radio-group v-model="selectedConvocatoria" style="margin-top: 0;">
                  <v-radio v-for="convocatoria in convocatorias" :key="convocatoria.idConvocatoria"
                    :label="convocatoria.nombre" :value="convocatoria.idConvocatoria"
                    @change="onCheckboxChange(convocatoria)"></v-radio>
                </v-radio-group>


              </v-list>
            </div>
          </div>
        </v-col>

      </v-row>
      <v-row class="pa-4" style="background-color: #ffffff;">
        <v-col class="rounded me-2" cols="4" style="background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Participantes</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritospa">Inscritos: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;" @click="$router.push('/');">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Jueces</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosinv">Incritos: </h5>
            <h5 ref="aprobadosinv">Aprobados: </h5>
            <h5 ref="pendientesinv">Pendientes: </h5>
            <button class="rounded px-12 mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>

        <v-col class="rounded" style="margin-left: 1.5vw;  ">

        </v-col>
      </v-row>
      <h2 class="mt-5" v-if="selectedConvocatoria != null">Estadísticas:</h2>
      <v-row class="mt-3" v-if="selectedConvocatoria != null">
        <v-col>
          <div>
            <ApexChart style="width: 100%;" type="donut" :options="optionsGenderPart" :series="seriesGenderPart"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart style="width: 100%;" type="donut" :options="optionsGenderInv" :series="seriesGenderInv"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart style="width: 100%;" type="donut" :options="optionsProjects" :series="seriesProjects"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart style="width: 100%;" type="line" :options="optionsPromedio" :series="seriesPromedio"></ApexChart>
          </div>
        </v-col>
      </v-row>
      <h2 class="mt-5">Otros:</h2>
      <v-row class="mt-3">
        <v-col>
          <v-btn text color="#FFFFFF" class="mx-2" @click="doPhaseManager()"
            style="background: linear-gradient(to left, #7b2ff7, #4277ff);">Progresar Fases <v-icon
              class="ml-3">mdi-clipboard-text-clock</v-icon></v-btn>
        </v-col>
      </v-row>

    </div>
  </DIV>

</template>

<script>
import api from "../services/api.js"


export default {
  name: "App",
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem("userData")) || null,
      convocatorias: [],
      proyectos: [],

      optionsGenderPart: {},
      seriesGenderPart: [30, 30],

      optionsGenderInv: {},
      seriesGenderInv: [30, 30],

      optionsProjects: {},
      seriesProjects: [30, 30],

      optionsPromedio: {
        chart: {
          id: 'Promedio de Proyectos'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      seriesPromedio: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }],

      equipos: [],
      loading: false,
      loadingDone: false,
      selectedConvocatoria: null,
      participantesObjects: null,
    }
  },
  created() {

  }, async mounted() {
    this.loading = true;
    this.$refs.baner.textContent = "¡Bienvenid@!";
    try {
      const response = await api.get('/api/convocatoria');
      this.convocatorias = JSON.parse(JSON.stringify(response.data));

    } catch (error) {
      console.log(error);

      this.$refs.asignados.textContent = "Asignados: 0";
      this.$refs.evaluados.textContent = "Evaluados: 0";
      this.$refs.pendientes.textContent = "Pendientes: 0";
    }
    this.loading = false;
  }, methods: {
    async doPhaseManager() {
      this.loading = true;
      const responsePhase = await api.get('/api/phasemanager');
      console.log(JSON.parse(JSON.stringify(responsePhase.data)));
      this.loading = false;
      this.loadingDone = true;
    },
    async onCheckboxChange(item) {
      this.loading = true;
      this.$refs.inscritos.textContent = "Inscritos: ";
      this.$refs.aprobados.textContent = "Aprobados: ";
      this.$refs.pendientes.textContent = "Pendientes: ";
      this.$refs.inscritosp.textContent = "Incritos: ";
      this.$refs.aprobadosp.textContent = "Aprobados: ";
      this.$refs.pendientesp.textContent = "Pendientes: ";
      this.$refs.inscritospa.textContent = "Inscritos: ";
      this.$refs.inscritosinv.textContent = "Inscritos: ";
      this.$refs.aprobadosinv.textContent = "Aprobados: ";
      this.$refs.pendientesinv.textContent = "Pendientes: ";

      try {
        var inscritos = 0;
        var aprobados = 0;
        var pendientes = 0;
        var aprobadosp = 0;
        var pendientesp = 0;
        var inscritospa = 0;
        var pendientesinv = 0;
        var aprobadosinv = 0;
        var inscritosinv = 0;
        const response3 = await api.get(`/api/proyecto/`);
        const proyectosos = JSON.parse(JSON.stringify(response3.data));
        const parts = [];
        const invs = [];
        const namesP = [];
        const promsP = [];

        await Promise.all(proyectosos.map(async proyecto => {
          const response = await api.get(`/api/convocatoria/id/${proyecto.idProyecto}`);
          const convi = (JSON.parse(JSON.stringify(response.data)));

          if (convi[0].idConvocatoria === item.idConvocatoria) {

            inscritos++;
            if (proyecto.EstadosProyecto_idEstadosProyecto == 1)
              pendientesp++;
            else if (proyecto.EstadosProyecto_idEstadosProyecto == 2 || proyecto.EstadosProyecto_idEstadosProyecto == 5)
              aprobadosp++;

            promsP.push(proyecto.promedio);
            namesP.push(proyecto.nombre);


            const response4 = await api.get(`/api/equipo/proyecto/${proyecto.idProyecto}`);
            const equiposos = JSON.parse(JSON.stringify(response4.data));

            if (equiposos[0].estado == "Aprobado")
              aprobados++;
            else if (equiposos[0].estado == "Pendiente de revisión")
              pendientes++;

            const response5 = await api.get(`/api/participantes/${equiposos[0].idEquipo}`);
            inscritospa += response5.data.length;
            parts.push(response5.data)

            
            const response6 = await api.get(`/api/investigador/${proyecto.Investigador_idInvestigador}`);
            const inve = JSON.parse(JSON.stringify(response6.data));

            if (!invs.includes(inve[0])) {
              inscritosinv++;

              invs.push(inve[0])
            }

            if (inve[0].EstadoPersona_idEstadoPersona == 1)
              pendientesinv++;
            else if (inve[0].EstadoPersona_idEstadoPersona == 2 || inve[0].EstadoPersona_idEstadoPersona == 4)
              aprobadosinv++;

          }
        }));

        let numF = 0;
        let numM = 0;
        console.log(JSON.stringify(invs))
        parts.forEach(pa => {
          if (pa[0].Genero_idGenero === 1) numM = numM + 1;
          else numF = numF + 1;
        });

        this.seriesGenderPart = [numM, numF];


        numF = 0;
        numM = 0;
        invs.forEach(pa => {
          if (pa.Genero_idGenero === 1) numM = numM + 1;
          else numF = numF + 1;
        });
        this.seriesGenderInv = [numM, numF];
        console.log('Second Coming: ', numF)

        this.seriesProjects = [(inscritos - aprobadosp), aprobadosp]

        this.seriesPromedio = [{
          name: 'Promedio',
          data: promsP
        }];

        this.optionsPromedio = {
          chart: {
            id: 'Promedio de Proyectos'
          },
          xaxis: {
            categories: namesP
          }
        }

        this.$refs.inscritos.textContent = "Inscritos: " + inscritos;
        this.$refs.aprobados.textContent = "Aprobados: " + aprobados;
        this.$refs.pendientes.textContent = "Pendientes: " + pendientes;
        this.$refs.inscritosp.textContent = "Incritos: " + inscritos;
        this.$refs.aprobadosp.textContent = "Aprobados: " + aprobadosp;
        this.$refs.pendientesp.textContent = "Pendientes: " + pendientesp;
        this.$refs.inscritospa.textContent = "Inscritos: " + inscritospa;
        this.$refs.inscritosinv.textContent = "Inscritos: " + inscritosinv;
        this.$refs.aprobadosinv.textContent = "Aprobados: " + aprobadosinv;
        this.$refs.pendientesinv.textContent = "Pendientes: " + pendientesinv;


      } catch (error) {
        console.error("Error al cargar datos:", error);

      }
      this.loading = false;

    }
  }

}


</script>
<style>
.baner {
  font-weight: normal;
}
</style>