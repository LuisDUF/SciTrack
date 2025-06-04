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
                  <v-btn small depressed color="primary" @click="openEvaluation(project, false)">Evaluar</v-btn>
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
                  <v-btn small depressed color="primary" @click="openEvaluation(project, true)">Revisar</v-btn>
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
            <v-card-title class="text-h5 d-flex justify-space-between align-start">
  {{ isReadOnly ? 'Revisión de proyecto' : 'Evaluar proyecto' }}
  <v-btn icon @click="dialog = false" class="ml-auto" style="margin-top: -8px;">
    <v-icon>mdi-close</v-icon>
  </v-btn>
</v-card-title>


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
              <div v-for="(crit, i) in rubric" :key="i" class="mb-3">
                <v-card flat class="pa-2">
                  <p>{{ crit.descripcion }}</p>
                  <p class="text-caption grey--text">Ponderación: {{ crit.ponderacion }}%</p>
                  <v-row dense>
  <v-col cols="6" v-if="!isReadOnly">
    <v-text-field
      v-model.number="crit.score"
      label="Calif."
      type="number"
      dense
      min="0"
      :max="crit.ponderacion"
    />
  </v-col>
  <v-col :cols="isReadOnly ? 12 : 6">
    <v-text-field
      :value="crit.ponderacion"
      label="Máximo"
      type="number"
      dense
      readonly
      disabled
    />
  </v-col>
</v-row>

                </v-card>
              </div>

              <div class="mt-2">
  <label class="font-weight-medium">Comentarios</label>
  <div v-if="isReadOnly" class="grey lighten-4 pa-3 rounded">
    <span v-if="selectedProject.comment">{{ selectedProject.comment }}</span>
    <span v-else class="grey--text">Sin comentarios</span>
  </div>
  <v-textarea
    v-else
    v-model="selectedProject.comment"
    rows="3"
    outlined
  />
</div>

            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!isReadOnly"
                color="primary"
                depressed
                @click="submitEvaluation"
              >
                Enviar
              </v-btn>
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
      rubric: [],
      isReadOnly: false,
    };
  },
  computed: {
    filteredUnevaluatedProjects() {
      if (this.selectedConvocatories.length === 0) return this.unevaluatedProjects;
      return this.unevaluatedProjects.filter(p =>
        this.selectedConvocatories.includes(p.convocatory)
      );
    },
    filteredEvaluatedProjects() {
      if (this.selectedConvocatories.length === 0) return this.evaluatedProjects;
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
    const res = await fetch('http://localhost:3000/api/proyectoVP/');
    if (!res.ok) throw new Error('Error al cargar los proyectos');
    const data = await res.json();

    const processed = data.map((p, i) => {
      return {
        id: p.id || i,
        displayId: 'PRJ' + (1000 + i),
        name: p.nombre_proyecto || 'Sin nombre',
        institution: p.institucion_investigador || p.institucion || 'No especificada',
        areas: p.areas_conocimiento || 'No especificadas',
        leader: p.lider_equipo || 'No asignado',
        criterios: [],
        advisor: p.asesor || 'No asignado',
        members: typeof p.integrantes === 'string' ? p.integrantes.split(', ') : [],
        comment: p.comentario_calificacion || '',
        convocatory: p.nombre_convocatoria || 'Sin convocatoria',
        status: p.estado_proyecto || 'Sin estado',
        promedio: p.promedio || null,
      };
    });

    this.unevaluatedProjects = processed.filter(p =>
      ['Pendiente', 'Aceptado'].includes(p.status) && (p.promedio == null)
    );

    this.evaluatedProjects = processed.filter(p =>
      p.promedio != null || !['Pendiente', 'Aceptado'].includes(p.status)
    );
  } catch (err) {
    console.error('Error al cargar proyectos:', err);
  }
}


,

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

    async openEvaluation(project, readOnly = false) {
  try {
    this.isReadOnly = readOnly;

    console.log("Fetching detalle del proyecto con ID:", project.id);
    const res = await fetch(`http://localhost:3000/api/proyectoVE/${project.id}`);
    if (!res.ok) throw new Error('No se pudo cargar el proyecto completo');

    const fullData = await res.json();
    console.log('Respuesta completa del backend (proyectoVE):', fullData);

    this.selectedProject = {
      id: fullData.id,
      name: fullData.nombre_proyecto || 'Sin nombre',
      institution: fullData.institucion || 'Sin institución',
      areas: fullData.areas_conocimiento || 'No especificadas',
      leader: fullData.lider_equipo || 'Sin líder',
      advisor: fullData.asesor || 'Sin asesor',
      members: Array.isArray(fullData.integrantes)
        ? fullData.integrantes
        : (fullData.integrantes || '').split(', ').filter(m => m.trim() !== ''),
      comment: fullData.comentario || '',
    };

    this.rubric = Array.isArray(fullData.criterios)
      ? fullData.criterios.map(c => ({
          id: c.id,
          descripcion: c.descripcion,
          ponderacion: Number(c.ponderacion),
          score: 0,
        }))
      : [];

    this.dialog = true;
  } catch (error) {
    console.error('Error al abrir evaluación:', error, project);
    alert('Hubo un problema al cargar los datos del proyecto.');
  }
}


,


    async submitEvaluation() {
  try {
    // Calcular promedio ponderado
    let total = 0;
    let totalPonderacion = 0;

    this.rubric.forEach(crit => {
      total += crit.score * crit.ponderacion;
      totalPonderacion += crit.ponderacion;
    });

    const promedio = totalPonderacion > 0 ? total / totalPonderacion : 0;

    // Enviar promedio a la API de actualización
    const resProm = await fetch(`http://localhost:3000/api/proyectoProm/${this.selectedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promedio }),
    });

    if (!resProm.ok) throw new Error('Error al actualizar el promedio');

    // Enviar comentario a la API de actualización
    const resCom = await fetch(`http://localhost:3000/api/comentario/${this.selectedProject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: this.selectedProject.comment || '' }),
    });

    if (!resCom.ok) throw new Error('Error al actualizar el comentario');

    console.log('Evaluación, promedio y comentario enviados con éxito');
    this.dialog = false;
    this.loadProjects();
  } catch (err) {
    console.error('Error al enviar evaluación:', err);
    alert('Error al enviar evaluación. Intenta de nuevo.');
  }
}

,
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
