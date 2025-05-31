<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">
        <h1 class="text-h4 mb-1">Evaluar proyectos</h1>
        <v-divider class="mb-4"></v-divider>

        <v-row dense>
          <!-- Sin evaluar -->
          <v-col cols="12" md="4">
            <h2 class="text-subtitle-1 font-weight-bold mb-2">Sin evaluar:</h2>
            <div class="scroll-column">
              <v-card
                v-for="(project, index) in filteredUnevaluatedProjects"
                :key="'unevaluated-' + index"
                outlined
                class="mb-4 project-card"
              >
                <v-card-text>
                  <p class="green--text font-weight-bold mb-1">#{{ project.id }}</p>
                  <p><strong>Nombre:</strong> {{ project.name }}</p>
                  <p><strong>Institución:</strong> {{ project.institution }}</p>
                  <p><strong>Convocatoria:</strong> {{ project.convocatory }}</p>
                  <p><strong>Estado:</strong> <span class="red--text">{{ project.status }}</span></p>
                  <v-btn small depressed color="primary" @click="openEvaluation(project)">Evaluar</v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- Evaluados -->
          <v-col cols="12" md="4">
            <h2 class="text-subtitle-1 font-weight-bold mb-2">Evaluados:</h2>
            <div class="scroll-column">
              <v-card
                v-for="(project, index) in filteredEvaluatedProjects"
                :key="'evaluated-' + index"
                outlined
                class="mb-4 project-card"
              >
                <v-card-text>
                  <p class="green--text font-weight-bold mb-1">#{{ project.id }}</p>
                  <p><strong>Nombre:</strong> {{ project.name }}</p>
                  <p><strong>Institución:</strong> {{ project.institution }}</p>
                  <p><strong>Convocatoria:</strong> {{ project.convocatory }}</p>
                  <p><strong>Estado:</strong> <span class="green--text">{{ project.status }}</span></p>
                  <v-btn small depressed color="primary">Revisar</v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- Filtros -->
          <v-col cols="12" md="4">
            <h2 class="text-subtitle-1 font-weight-bold mb-2">Filtrar por convocatoria:</h2>
            <v-card outlined>
              <v-card-text class="scroll-column px-4">
                <v-checkbox
                  v-for="conv in convocatories"
                  :key="conv"
                  :label="conv"
                  :value="conv"
                  v-model="selectedConvocatories"
                  hide-details
                  dense
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modal de evaluación -->
        <v-dialog v-model="dialog" max-width="800px">
          <v-card>
            <v-card-title class="text-h5">Evaluar proyecto</v-card-title>
            <v-card-text class="modal-content">
              <p><strong>NOMBRE:</strong> {{ selectedProject.name }}</p>
              <p><strong>INSTITUCIÓN(ES):</strong> {{ selectedProject.institution }}</p>
              <p><strong>ÁREA(S) DE CONOCIMIENTO:</strong> INGENIERÍA DE SOFTWARE</p>
              <p><strong>LÍDER DEL EQUIPO:</strong> DOMINGUEZ GUZMAN SEBASTIAN</p>
              <p><strong>ASESOR:</strong> RAMOS DÍAZ JOSE GUADALUPE</p>
              <p><strong>INTEGRANTES:</strong></p>
              <ul>
                <li>DOMINGUEZ GUZMAN SEBASTIAN</li>
                <li>HIDALGO MEDINA ALONZO JESUS</li>
                <li>TALAVERA ORTIZ ANNA LILIA</li>
              </ul>

              <p class="mt-4"><strong>RÚBRICA:</strong></p>
              <div v-for="(crit, i) in rubric" :key="i" class="mb-3">
                <v-card flat class="pa-2">
                  <p>{{ crit.text }}</p>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field v-model="crit.score" label="Calif." type="number" dense />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field :value="crit.max" label="Máximo" type="number" dense readonly />
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <v-textarea label="Comentarios" rows="3" outlined class="mt-2" />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" depressed @click="submitEvaluation">Enviar</v-btn>
              <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      selectedProject: {},
      unevaluatedProjects: [
        { id: '212136P', name: 'Cash Royale', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Pendiente de evaluación' },
        { id: '212136P', name: 'Pony Hambriento', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Pendiente de evaluación' },
        { id: '212136P', name: 'WAVE-E', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Pendiente de evaluación' },
      ],
      evaluatedProjects: [
        { id: '212536P', name: 'Dolphin', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Evaluado' },
        { id: '212736P', name: 'Main@Home', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Evaluado' },
        { id: '212836P', name: 'OBU-L', institution: 'TECNM Morelia', convocatory: 'InovaTEC', status: 'Evaluado' },
      ],
      convocatories: ['InovaTEC', 'PLEXO'],
      selectedConvocatories: ['InovaTEC'],
      rubric: [
        { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', score: 0, max: 20 },
        { text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', score: 0, max: 20 },
      ],
    };
  },
  computed: {
    filteredUnevaluatedProjects() {
      return this.unevaluatedProjects.filter(p =>
        this.selectedConvocatories.includes(p.convocatory)
      );
    },
    filteredEvaluatedProjects() {
      return this.evaluatedProjects.filter(p =>
        this.selectedConvocatories.includes(p.convocatory)
      );
    },
  },
  methods: {
    openEvaluation(project) {
      this.selectedProject = project;
      this.dialog = true;
    },
    submitEvaluation() {
      console.log('Evaluación enviada:', this.selectedProject, this.rubric);
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.scroll-column {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}
.project-card {
  background-color: #f8faff;
}
.modal-content {
  max-height: 500px;
  overflow-y: auto;
}
</style>
