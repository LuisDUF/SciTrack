<template>
  <v-app>
    <v-main>
      <v-container class="pa-6" fluid>
        <h2 class="text-h4 mb-4">Reportes</h2>

        <div class="d-flex" style="height: calc(100vh - 200px);">
          <!-- Lista de proyectos -->
          <div class="flex-grow-1 pr-4" style="overflow-y: auto; height: 100%;">
            <p class="text-subtitle-1 mb-4">Proyectos disponibles para reporte:</p>
            <v-card 
              v-for="(project, index) in filteredProjects" 
              :key="index" 
              class="mb-4" 
              flat
              outlined
            >
              <v-card-text>
                <div class="d-flex justify-space-between align-start">
                  <div>
                    <p class="mb-1 font-weight-bold">#{{ project.id }}</p>
                    <p class="mb-1">Nombre: {{ project.name }}</p>
                    <p class="mb-1">Institución: {{ project.institution }}</p>
                    <p class="mb-1">Convocatoria: {{ project.convocatory }}</p>
                    <p class="mb-0">Estado: {{ project.status }}</p>
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
                :key="conv"
                v-model="selectedConvocatories"
                :label="conv"
                :value="conv"
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
                        <template v-slot:default>
                          <tbody>
                            <tr><td class="font-weight-bold">NOMBRE:</td><td>{{ currentReport.name }}</td></tr>
                            <tr><td class="font-weight-bold">INSTITUCION(ES):</td><td>{{ currentReport.institution }}</td></tr>
                            <tr><td class="font-weight-bold">AREA(S) DE CONOCIMIENTO:</td><td>{{ currentReport.area || 'INGENIERÍA DE SOFTWARE' }}</td></tr>
                            <tr><td class="font-weight-bold">LIDER DEL EQUIPO:</td><td>{{ currentReport.leader || 'DOMINGUEZ GUZMAN SEBASTIAN' }}</td></tr>
                            <tr><td class="font-weight-bold">ASESOR:</td><td>{{ currentReport.advisor || 'RAMOS DIAZ JOSE GUADALUPE' }}</td></tr>
                            <tr><td class="font-weight-bold">FASE:</td><td>{{ currentReport.phase || 'PRELIMINAR' }}</td></tr>
                          </tbody>
                        </template>
                      </v-simple-table>

                      <div class="mt-4">
                        <p class="font-weight-bold mb-2">INTEGRANTES:</p>
                        <div style="max-height: 100px; overflow-y: auto;">
                          <ul>
                            <li v-for="(member, i) in currentReport.members || ['DOMINGUEZ GUZMAN SEBASTIAN','HIDALGO MEDINA ALONZO JESUS','TALAVERA ORTIZ ANNA LILIA']" :key="i">• {{ member }}</li>
                          </ul>
                        </div>

                        <p class="font-weight-bold mb-2 mt-4">DOCUMENTOS:</p>
                        <div style="max-height: 100px; overflow-y: auto;">
                          <ul>
                            <li v-for="(doc, i) in currentReport.documents || ['IDENTIFICACION.pdf','RECOMENDACION.pdf']" :key="'doc-'+i">• {{ doc }}</li>
                          </ul>
                        </div>

                        <p class="font-weight-bold mb-2 mt-4">COMENTARIOS DEL ADMINISTRADOR:</p>
                        <p>{{ currentReport.adminComments || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }}</p>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Ponderación -->
                <v-col cols="12" md="6">
                  <v-card outlined class="h-100">
                    <v-card-title class="subtitle-1 font-weight-bold">Ponderación</v-card-title>
                    <v-card-text>
                      <p class="font-weight-bold mb-2">RUBRICA: #{{ currentReport.rubric || '431548R' }}</p>
                      <p class="font-weight-bold mb-2">CRITERIOS:</p>
                      <div style="max-height: 200px; overflow-y: auto;">
                        <v-simple-table>
                          <template v-slot:default>
                            <tbody>
                              <tr v-for="(criteria, i) in currentReport.criteria || [
                                { name: 'Lorem ipsum...', civil: '8 20', maximo: '8 20' }
                              ]" :key="'criteria-'+i">
                                <td>{{ criteria.name }}</td>
                                <td class="text-right font-weight-bold">Civil. {{ criteria.civil }}</td>
                                <td class="text-right font-weight-bold">Maximo {{ criteria.maximo }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>

                      <p class="font-weight-bold mt-4">PONDERACIÓN FINAL: {{ currentReport.finalScore || '88' }}</p>

                      <p class="font-weight-bold mb-2 mt-4">COMENTARIOS DEL JUEZ:</p>
                      <p>{{ currentReport.judgeComments || 'Lorem ipsum dolor sit amet...' }}</p>
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
      projects: [
  { 
    id: '10001AX', 
    name: 'Agrobot X', 
    institution: 'TEC Culiacán', 
    convocatory: 'InovaTEC', 
    status: 'Participando',
    area: 'Agrotecnología',
    leader: 'MARIA GONZALEZ LARA',
    advisor: 'ING. JULIO PÉREZ',
    phase: 'FINAL',
    members: ['MARIA GONZALEZ LARA', 'JUAN PEREZ TORRES', 'LUCIA HERNANDEZ'],
    documents: ['PROPUESTA.pdf', 'PRESENTACION.pptx'],
    adminComments: 'Muy buen enfoque de aplicación en el sector agrícola.',
    rubric: 'RB-78956',
    criteria: [
      { name: 'Innovación tecnológica', civil: '9 20', maximo: '18 20' },
      { name: 'Impacto social', civil: '7 20', maximo: '17 20' }
    ],
    finalScore: '89',
    judgeComments: 'Gran potencial, aunque el prototipo aún está en desarrollo.'
  },
  { 
    id: '10002BX', 
    name: 'EcoAqua', 
    institution: 'TEC Veracruz', 
    convocatory: 'PLEXO', 
    status: 'Finalizado',
    area: 'Medio Ambiente',
    leader: 'CARLOS REYES MORA',
    advisor: 'DRA. ANA LOPEZ',
    phase: 'PRELIMINAR',
    members: ['CARLOS REYES MORA', 'PABLO RAMIREZ', 'SOFIA LUNA'],
    documents: ['ECOAQUA_PLAN.pdf', 'ECOAQUA_RESULTS.docx'],
    adminComments: 'Cumplió con todos los requisitos y entregables.',
    rubric: 'RB-96325',
    criteria: [
      { name: 'Sostenibilidad', civil: '10 20', maximo: '19 20' },
      { name: 'Aplicabilidad práctica', civil: '8 20', maximo: '18 20' }
    ],
    finalScore: '92',
    judgeComments: 'Muy buen análisis de impacto ambiental.'
  },
  { 
    id: '10003CX', 
    name: 'Smart Mobility', 
    institution: 'TEC Monterrey', 
    convocatory: 'ES-XIV SMP', 
    status: 'Descalificado',
    area: 'Ingeniería de Transporte',
    leader: 'ANA MARTINEZ DIAZ',
    advisor: 'MTRO. EDUARDO SALAZAR',
    phase: 'FINAL',
    members: ['ANA MARTINEZ DIAZ', 'ROBERTO CASTRO', 'FABIOLA HERRERA'],
    documents: ['SMART_MOBILITY.pdf', 'VALIDACION.xlsx'],
    adminComments: 'Faltó documentación técnica esencial.',
    rubric: 'RB-11223',
    criteria: [
      { name: 'Eficiencia energética', civil: '5 20', maximo: '15 20' },
      { name: 'Diseño urbano inteligente', civil: '6 20', maximo: '16 20' }
    ],
    finalScore: '73',
    judgeComments: 'Concepto interesante pero pobremente fundamentado.'
  }
],

      convocatories: ['InovaTEC', 'PLEXO', 'ES-XIV SMP'],
      selectedConvocatories: [],
      filteredProjects: [],
      showReportDialog: false,
      currentReport: {}
    }
  },
  created() {
    this.filteredProjects = [...this.projects];
  },
  watch: {
    selectedConvocatories: 'applyFilters'
  },
  methods: {
    openReport(project) {
      this.currentReport = project;
      this.showReportDialog = true;
    },
    applyFilters() {
      this.filteredProjects = this.projects.filter(project => {
        return (
          this.selectedConvocatories.length === 0 ||
          this.selectedConvocatories.includes(project.convocatory)
        );
      });
    }
  }
}
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

/* Scroll personalizado */
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

/* Estilos para el overlay */
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
