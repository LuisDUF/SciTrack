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
            Se ha procesado la solicitud
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
              @click="goToTeams()">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Proyectos</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosp">Incritos: </h5>
            <h5 ref="aprobadosp">Aprobados: </h5>
            <h5 ref="pendientesp">Pendientes: </h5>
            <h5 ref="descalificadosp">Descalificados: </h5>
            <h5 ref="rechazadosp">Rechazados: </h5>
            <h5 ref="concluidosp">Concluidos: </h5>
            <button @click="goToProjects()" class="rounded px-12 mt-2"
              style="color: #ffffff; background-color: #6596FF;">Revisar</button>
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
            <h5 ref="inscritospa">Incritos: </h5>
            <button @click="goToParticipants()" class="rounded px-12 mt-2"
              style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>

        </v-col>

        <v-col class="rounded me-2" cols="4" style="margin-left: 1.5vw; background-color: #BFD6FF; ">
          <h4 style="font-weight: bold;">Jueces</h4>
          <div class="rounded"
            style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff; ">
            <h5 ref="inscritosinv">Incritos: </h5>
            <h5 ref="aprobadosinv">Aprobados: </h5>
            <h5 ref="pendientesinv">Pendientes: </h5>
            <button class="rounded px-12 mt-2" @click="goToInvs()"
              style="color: #ffffff; background-color: #6596FF;">Revisar</button>
          </div>
        </v-col>

        <v-col class="rounded" style="margin-left: 1.5vw;  ">

        </v-col>
      </v-row>
      <h2 class="mt-5" v-if="selectedConvocatoria != null">Estadísticas:</h2>
      <v-row class="mt-3" v-if="selectedConvocatoria != null">
        <v-col>
          <div>
            <ApexChart width="500" type="donut" :options="optionsGenderPart" :series="seriesGenderPart"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart width="500" type="donut" :options="optionsGenderInv" :series="seriesGenderInv"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart width="500" type="donut" :options="optionsProjects" :series="seriesProjects"></ApexChart>
          </div>
        </v-col>
        <v-col>
          <div>
            <ApexChart width="500" type="line" :options="optionsPromedio" :series="seriesPromedio"></ApexChart>
          </div>
        </v-col>
      </v-row>
      <h2 class="mt-5">Otros:</h2>
      <v-row class="mt-3" justify="start">
        <v-col class="d-flex" cols="auto">
          <v-btn text color="#FFFFFF" class="mx-2" @click="doPhaseManager()"
            style="background: linear-gradient(to left, #7b2ff7, #4277ff);">
            Progresar Fases
            <v-icon class="ml-3">mdi-clipboard-text-clock</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex" cols="auto">
          <v-btn text color="#FFFFFF" class="mx-2" @click="convStart()"
            style="background: linear-gradient(to left, #7b2ff7, #4277ff);">
            Asignar Jueces
            <v-icon class="ml-3">mdi-abacus</v-icon>
          </v-btn>
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

      optionsGenderPart: {
        labels: ['Femenino', 'Masculino'],
        legend: {
          position: 'bottom'
        }
      },
      seriesGenderPart: [30, 30],

      optionsGenderInv: {
        labels: ['Femenino', 'Masculino'],
        legend: {
          position: 'bottom'
        }
      },
      seriesGenderInv: [30, 30],

      optionsProjects: {
        labels: ['Inscritos', 'Aprobados', 'Pendientes', 'Descalificados', 'Rechazados', 'Concluidos'],
        legend: {
          position: 'bottom'
        }
      },
      seriesProjects: [0, 0, 0, 0, 0, 0],

      optionsPromedio: {
        chart: {
          id: 'Promedio de Proyectos'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      seriesPromedio: [{
        name: 'Promedios',
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
    goToProjects() {
      this.$router.push('/adminmenu/proyectosyusuarios');
    },
     goToTeams() {
      this.$router.push('/adminmenu/proyectosyusuarios');
    },
     goToParticipants() {
      this.$router.push('/adminmenu/constancias');
    },
     goToInvs() {
      this.$router.push('/adminmenu/listainvestigadores');
    },
    async doPhaseManager() {
      this.loading = true;
      const responsePhase = await api.get('/api/phasemanager');
      console.log(JSON.parse(JSON.stringify(responsePhase.data)));
      this.loading = false;
      this.loadingDone = true;
    },
    async convStart() {
      this.loading = true;
      const responsePhase = await api.get('/api/convstart');
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
      this.$refs.descalificadosp.textContent = "Descalificados: ";
      this.$refs.concluidosp.textContent = "Concluidos: ";
      this.$refs.rechazadosp.textContent = "Rechazados: ";

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
        var rechazadosp = 0;
        var descalificadosp = 0;
        var concluidosp = 0;
        var proyectosos = [];
        var equiposos = [];
        const parts = [];
        var invs = [];
        const namesP = [];
        const promsP = [];

        invs.push(...JSON.parse(JSON.stringify((await api.get('/api/investigador/convocatoria/' + item.idConvocatoria)).data)));

        invs = invs.filter(
          (obj, index, self) =>
            index === self.findIndex(o => o.idInvestigador === obj.idInvestigador)
        );

        parts.push(...JSON.parse(JSON.stringify(await api.get(`/api/participante/convocatoria/` + item.idConvocatoria))).data);

        inscritospa = parts.length;

        pendientesinv = invs.filter(s => s.EstadoPersona_idEstadoPersona == 1).length;
        aprobadosinv = invs.filter(s => s.EstadoPersona_idEstadoPersona == 2).length;
        inscritosinv = invs.length;

        proyectosos.push(...JSON.parse(JSON.stringify(await api.get('/api/proyectos/convocatoria/' + item.idConvocatoria))).data);
        pendientesp = proyectosos.filter(s => s.EstadosProyecto_idEstadosProyecto == 1).length;
        aprobadosp = proyectosos.filter(s => s.EstadosProyecto_idEstadosProyecto == 2).length;
        descalificadosp = proyectosos.filter(s => s.EstadosProyecto_idEstadosProyecto == 4).length;
        concluidosp = proyectosos.filter(s => s.EstadosProyecto_idEstadosProyecto == 5).length;
        rechazadosp = proyectosos.filter(s => s.EstadosProyecto_idEstadosProyecto == 3).length;
        proyectosos.forEach((pr) => {
          if (pr.EstadosProyecto_idEstadosProyecto != 3 && pr.EstadosProyecto_idEstadosProyecto != 1) {
            console.log(JSON.stringify(pr))
            namesP.push(pr.nombreProyecto);
            promsP.push(pr.promedio);
          }
        })

        inscritos = proyectosos.length

        equiposos.push(...JSON.parse(JSON.stringify(await api.get('/api/equipos/convocatoria/' + item.idConvocatoria))).data);
        equiposos = equiposos.filter(
          (obj, index, self) =>
            index === self.findIndex(o => o.idEquipo === obj.idEquipo)
        );
        pendientes = equiposos.filter(s => s.estado == "Pendiente de revisión").length;
        aprobados = equiposos.filter(s => s.estado == "Aprobado").length;
        var inscri = equiposos.length;




        let numF = 0;
        let numM = 0;
        parts.forEach(pa => {
          if (pa.Genero_idGenero === 1) numM = numM + 1;
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



        this.seriesProjects = [inscritos, aprobadosp, pendientesp, descalificadosp, rechazadosp, concluidosp]

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

        this.$refs.inscritos.textContent = "Inscritos: " + inscri;
        this.$refs.aprobados.textContent = "Aprobados: " + aprobados;
        this.$refs.pendientes.textContent = "Pendientes: " + pendientes;
        this.$refs.inscritosp.textContent = "Incritos: " + inscritos;
        this.$refs.aprobadosp.textContent = "Aprobados: " + aprobadosp;
        this.$refs.rechazadosp.textContent = "Rechazados: " + rechazadosp;
        this.$refs.concluidosp.textContent = "Concluidos: " + concluidosp;
        this.$refs.descalificadosp.textContent = "Descalificados: " + descalificadosp;
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