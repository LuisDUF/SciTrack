<template >
  <v-app >
    <v-main>
      <v-container class="pa-6" fluid>
        <h2 class="text-h4 mb-4">Reportes</h2>

        <div class="d-flex" style="height: calc(100vh - 200px);">
          <!-- Lista de proyectos -->
          <div class="flex-grow-1 pr-4" style="overflow-y: auto; height: 100%;">
            <p class="text-subtitle-1 mb-4">Proyectos disponibles para reporte:</p>
            <v-card 
              v-for="project in filteredProjects" 
              :key="project.id || project.name" 
              class="mb-4" 
              flat
              outlined
            >
              <v-card-text>
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <p class="mb-1 font-weight-bold">#{{ project.id || 'N/A' }}</p>
                    <p class="mb-1">Nombre: {{ project.name }}</p>
                    <p class="mb-1">Institución: {{ project.institution }}</p>
                    <p class="mb-1">Convocatoria: {{ project.convocatory || 'N/A' }}</p>
                    <p class="mb-0">Estado: {{ project.status || 'N/A' }}</p>
                  </div>
                  <v-btn color="primary" depressed @click="openReport(project)">
                    Ver reporte
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Filtros -->
          <div style="width: 300px; overflow-y: auto; height: 100%; border-left: 1px solid #e0e0e0; padding-left: 16px;">
            <p class="text-subtitle-1 mb-2">Filtrar por convocatoria:</p>
            <v-card outlined class="pa-2 mb-4" style="max-height: 150px; overflow-y: auto;">
              <v-checkbox
                v-for="conv in convocatories"
                :key="conv.idConvocatoria || conv"
                v-model="selectedConvocatories"
                :label="conv.nombre || conv"
                :value="(conv.nombre || conv).trim()"
                dense
                hide-details
              />
            </v-card>
          </div>
        </div>

        <!-- Overlay de Reporte -->
        <v-dialog v-model="showReportDialog" max-width="1000" scrollable>
          <v-card>
            <v-card-title class="headline">
              <span class="text-h5">Reporte de Proyecto</span>
              <v-spacer></v-spacer>
              <v-btn icon @click="showReportDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            
            <v-card-text style="max-height: 80vh; overflow-y: auto;">
              <v-row dense>
                <!-- Información General -->
                <v-col cols="12" md="6">
                  <v-card outlined class="h-100">
                    <v-card-title class="subtitle-1 font-weight-bold">Información general</v-card-title>
                    <v-card-text>
                      <v-simple-table>
                        <tbody>
                          <tr><td class="font-weight-bold">NOMBRE:</td><td>{{ currentReport.name }}</td></tr>
                          <tr><td class="font-weight-bold">INSTITUCIÓN(ES):</td><td>{{ currentReport.institution }}</td></tr>
                          <tr><td class="font-weight-bold">ÁREA(S) DE CONOCIMIENTO:</td><td>{{ currentReport.area || 'INGENIERÍA DE SOFTWARE' }}</td></tr>
                          <tr><td class="font-weight-bold">LÍDER DEL EQUIPO:</td><td>{{ currentReport.leader || 'DOMINGUEZ GUZMAN SEBASTIAN' }}</td></tr>
                          <tr><td class="font-weight-bold">ASESOR:</td><td>{{ currentReport.advisor || 'RAMOS DIAZ JOSE GUADALUPE' }}</td></tr>
                          <tr><td class="font-weight-bold">FASE:</td><td>{{ currentReport.phase || 'PRELIMINAR' }}</td></tr>
                        </tbody>
                      </v-simple-table>

                      <div class="mt-4">
                        <p class="font-weight-bold mb-2">INTEGRANTES:</p>
                        <div style="max-height: 100px; overflow-y: auto;">
                          <ul>
                            <li v-for="(member, i) in currentReport.members || []" :key="i">• {{ member }}</li>
                          </ul>
                        </div>

                        <p class="font-weight-bold mb-2 mt-4">DOCUMENTOS:</p>
                        <div style="max-height: 100px; overflow-y: auto;">
                          <ul>
                            <li v-for="(doc, i) in currentReport.documents || []" :key="'doc-'+i">• {{ doc }}</li>
                          </ul>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Ponderación -->
                <v-col cols="12" md="6">
                  <v-card outlined class="h-100">
                    <v-card-title class="subtitle-1 font-weight-bold">Ponderación</v-card-title>
                    <v-card-text>
                      <p class="font-weight-bold mb-2">RÚBRICA:</p>
                      <p class="font-weight-bold mb-2">CRITERIOS:</p>
                      <div style="max-height: 200px; overflow-y: auto;">
                        <v-simple-table>
                          <tbody>
                            <tr v-for="(criteria, i) in currentReport.criteria || []" :key="'criteria-'+i">
                              <td>{{ criteria.descripcion || '-' }}</td>
                              <td class="text-right font-weight-bold">Ponderación: {{ criteria.ponderacion || '-' }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>

                      <p class="font-weight-bold mt-4">PONDERACIÓN FINAL: {{ currentReport.finalScore || 'N/A' }}</p>

                      <p class="font-weight-bold mb-2 mt-4">COMENTARIOS DEL JUEZ:</p>
                      <p>{{ currentReport.judgeComments || 'Sin comentarios aún.' }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
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
      projects: [],
      convocatories: [],
      selectedConvocatories: [],
      filteredProjects: [],
      showReportDialog: false,
      currentReport: {}
    };
  },
  created() {
    this.loadConvocatorias();
    this.loadAndCombineProyectos();
  },
  watch: {
    selectedConvocatories: 'applyFilters'
  },
  methods: {
    async loadConvocatorias() {
      try {
        const res = await fetch('http://localhost:3000/api/convocatorias/');
        const data = await res.json();
        this.convocatories = data;
      } catch (error) {
        console.error('Error cargando convocatorias:', error);
      }
    },

    async loadAndCombineProyectos() {
      try {
        const resDetalles = await fetch('http://localhost:3000/api/reportes/');
        const detalles = await resDetalles.json();

        const resVp = await fetch('http://localhost:3000/api/reportesVp/');
        const infoVp = await resVp.json();

        const detallesMap = new Map();
        detalles.forEach(d => {
          detallesMap.set(d.nombre_proyecto, d);
        });

        this.projects = infoVp.map(item => {
          const detalle = detallesMap.get(item.nombre_proyecto) || {};
          const criterios = detalle.criterios || [];
          let finalScore = 'N/A';

          if (criterios.length > 0) {
            const suma = criterios.reduce((acc, c) => acc + (c.ponderacion || 0), 0);
            finalScore = (suma / criterios.length).toFixed(2);
          }

          return {
            id: detalle.idProyecto || null,
            name: item.nombre_proyecto,
            institution: item.institucion_investigador,
            convocatory: (item.nombre_convocatoria || 'N/A').trim(),
            status: item.estado_proyecto || 'N/A',
            area: detalle.area_conocimiento_categoria || 'N/A',
            leader: detalle.lider_equipo || 'N/A',
            advisor: detalle.asesor_equipo || 'N/A',
            phase: detalle.fase_proyecto || 'N/A',
            members: detalle.integrantes_equipo || [],
            documents: detalle.archivos || [],
            rubric: 'N/A',
            criteria: criterios,
            finalScore,
            judgeComments: detalle.comentario_proyecto || 'Sin comentarios aún.'
          };
        });

        this.filteredProjects = [...this.projects];
      } catch (error) {
        console.error('Error cargando proyectos:', error);
      }
    },

    openReport(project) {
      this.currentReport = project;
      this.showReportDialog = true;
    },

    applyFilters() {
      const selected = this.selectedConvocatories.map(c => c.trim().toLowerCase());

      console.log('Selected convocatorias:', selected);

      this.filteredProjects = this.projects.filter(project => {
        const conv = (project.convocatory || '').trim().toLowerCase();
        return selected.includes(conv);
      });
    }
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 4px !important;
  border: 1px solid #e0e0e0 !important;
}
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
.text-subtitle-1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: 0.009375em;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.v-dialog {
  overflow-y: hidden !important;
}
.v-card__text {
  padding: 20px !important;
}
ul {
  padding-left: 20px;
  margin: 0;
}
</style>
