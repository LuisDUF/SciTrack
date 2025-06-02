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
                  <p class="green--text font-weight-bold mb-1">#{{ project.displayId }}</p>
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
                  <p class="green--text font-weight-bold mb-1">#{{ project.displayId }}</p>
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
              <p><strong>ÁREA(S) DE CONOCIMIENTO:</strong> {{ selectedProject.areas }}</p>
              <p><strong>LÍDER DEL EQUIPO:</strong> {{ selectedProject.leader }}</p>
              <p><strong>ASESOR:</strong> {{ selectedProject.advisor }}</p>
              <p><strong>INTEGRANTES:</strong></p>
              <ul>
                <li v-for="(member, i) in selectedProject.members" :key="i">{{ member }}</li>
              </ul>

              <p class="mt-4"><strong>RÚBRICA:</strong></p>
              <div v-for="(crit, i) in selectedProject.criterios" :key="i" class="mb-3">
                <v-card flat class="pa-2">
                  <p>{{ crit.descripcion }}</p>
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

              <v-textarea label="Comentarios" v-model="selectedProject.comment" rows="3" outlined class="mt-2" />
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
      unevaluatedProjects: [],
      evaluatedProjects: [],
      convocatories: [],
      selectedConvocatories: [],
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
  mounted() {
    this.loadProjects();
    this.loadConvocatorias();
  },
  methods: {
    async loadProjects() {
      try {
        const res = await fetch('http://localhost:3000/api/proyectoVE/');
        if (!res.ok) throw new Error('Error al cargar los proyectos');
        const data = await res.json();

        console.log(data)
        this.rubric = data[0].criterios
        const processed = data.map((p, i) => ({
          id: p.id,
          displayId: 'PRJ' + (1000 + i),
          name: p.nombre_proyecto,
          institution: p.institucion,
          areas: p.areas_conocimiento,
          leader: p.lider_equipo,
          criterios: p.criterios,
          advisor: p.asesor,
          members: p.integrantes ? p.integrantes.split(', ') : [],
          comment: p.comentario_calificacion || '',
          convocatory: 'FERIA DE PROYECTOS',
          status: i % 2 === 0 ? 'Inactiva' : 'Evaluada',
        }));

        this.unevaluatedProjects = processed.filter((_, i) => i % 2 === 0);
        this.evaluatedProjects = processed.filter((_, i) => i % 2 !== 0);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
      }
    },

    async loadConvocatorias() {
      try {
        const res = await fetch('http://localhost:3000/api/convocatoria/');
        if (!res.ok) throw new Error('Error al cargar convocatorias');
        const data = await res.json();

        this.convocatories = data.map(c => c.nombre);
        this.selectedConvocatories = [...this.convocatories];
      } catch (err) {
        console.error('Error al cargar convocatorias:', err);
      }
    },

    openEvaluation(project) {
      this.selectedProject = { ...project };
      this.dialog = true;
    },

    async submitEvaluation() {
      try {
        const evaluaciones = this.rubric.map(crit => ({
          calificacion: crit.score,
          idFase: 1, // ajustar según lógica real
          idCriterio: crit.id,
          comentario: this.selectedProject.comment,
          Proyecto_idProyecto: this.selectedProject.id,
        }));

        const res = await fetch('http://localhost:3000/api/calificacion/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(evaluaciones)
        });

        if (!res.ok) throw new Error('Error al enviar la evaluación');

        console.log('Evaluación enviada con éxito');
        this.dialog = false;

      } catch (err) {
        console.error('Error al enviar evaluación:', err);
      }
    }
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
