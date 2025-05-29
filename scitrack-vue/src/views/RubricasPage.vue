<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <!-- Botones para cambiar de vista -->
        <v-row class="mb-4">
          <v-col>
            <v-btn color="primary" @click="modoCrearRúbrica = false">
              Mostrar rúbricas
            </v-btn>
            <v-btn color="secondary" @click="modoCrearRúbrica = true">
              Crear nueva rúbrica
            </v-btn>
          </v-col>
        </v-row>

        <!-- Vista de listado de rúbricas -->
        <div v-if="!modoCrearRúbrica">
          <h1 class="text-h4 mb-6">SCTTRACK</h1>
          <p class="text-subtitle-1 mb-8">Instituto de Ciencia, tecnología e Innovación</p>

          <h2 class="text-h5 mb-4">Rúbricas</h2>
          <v-divider class="mb-6"></v-divider>

          <div style="max-height: 400px; overflow-y: auto;" class="mb-2">
            <v-card 
              v-for="(rubric, index) in rubrics" 
              :key="index" 
              class="mb-4" 
              flat
              outlined
            >
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="mb-1 font-weight-bold">#{{ rubric.id }}</p>
                    <p class="mb-1">Para convocatoria: {{ rubric.convocatoria }}</p>
                    <p class="mb-0">Área(s) de conocimiento: {{ rubric.area }}</p>
                  </div>
                  <div>
                    <span class="text-caption grey--text">Ver más:</span>
                    <v-btn small color="primary" class="ml-2" @click="editRubric(rubric)">
                      Editar
                    </v-btn>
                    <v-btn small color="error" class="ml-2" @click="deleteRubric(rubric.id)">
                      Eliminar
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <div class="text-center">
            <v-btn 
              color="primary" 
              class="mt-2 elevation-5 transition-ease-in-out" 
              style="width: 100%;"
              depressed
              @click="showCreateDialog = true"
            >
              Crear una rúbrica
            </v-btn>
          </div>

          <!-- Diálogo para crear/editar -->
          <v-dialog v-model="showCreateDialog" max-width="500">
            <v-card>
              <v-card-title class="headline">
                {{ editingRubric ? 'Editar Rúbrica' : 'Nueva Rúbrica' }}
              </v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="form.id" label="ID" outlined dense :disabled="!!editingRubric" />
                  <v-text-field v-model="form.convocatoria" label="Para convocatoria" outlined dense />
                  <v-text-field v-model="form.area" label="Área(s) de conocimiento" outlined dense />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="showCreateDialog = false">Cancelar</v-btn>
                <v-btn color="primary" depressed @click="saveRubric">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>

        <!-- Vista de creación avanzada -->
        <div v-else>
          <v-card outlined>
            <v-card-title>
              <h2>Crear rúbrica</h2>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <h3>Convocatoria</h3>
                  <v-card outlined class="pa-2" style="max-height: 150px; overflow-y: auto;">
                    <v-checkbox v-for="item in convocatorias" :key="item" v-model="form.convocatorias" :label="item" :value="item" dense hide-details />
                  </v-card>

                  <div class="mt-4">
                    <h3>Área(s) de conocimiento</h3>
                    <v-card outlined class="pa-2" style="max-height: 150px; overflow-y: auto;">
                      <v-checkbox v-for="item in areas" :key="item" v-model="form.areas" :label="item" :value="item" dense hide-details />
                    </v-card>

                    <p class="red--text text--darken-2 text-subtitle-2 mt-5">*Debe seleccionar al menos una área de conocimiento</p>
                    <p class="red--text text--darken-2 text-subtitle-2">*Seleccione máximo 3 áreas</p>

                    <v-btn color="primary" class="mt-4 py-4" block :loading="loading" @click="confirmar">Confirmar</v-btn>
                  </div>
                </v-col>

                <v-col cols="12" md="8">
                  <h3 class="mb-2">Criterios de evaluación</h3>
                  <v-card outlined class="pa-3" style="max-height: 400px; overflow-y: auto;">
                    <v-card v-for="(criterio, index) in form.criterios" :key="index" outlined class="mb-3">
                      <v-card-text>
                        <p><strong>Criterio:</strong> {{ criterio.descripcion }}</p>
                        <p><strong>Ponderación:</strong> {{ criterio.ponderacion }} puntos</p>
                        <v-btn color="success" small @click="editarCriterio(index)">Editar</v-btn>
                        <v-btn color="error" small @click="eliminarCriterio(index)">Eliminar</v-btn>
                      </v-card-text>
                    </v-card>
                  </v-card>

                  <v-row class="mt-4">
                    <v-col cols="8">
                      <v-text-field label="Ponderación máxima" v-model.number="form.ponderacionMaxima" type="number" min="0" dense />
                    </v-col>
                    <v-col cols="4">
                      <v-btn color="primary" @click="añadirCriterio">Añadir criterio</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions><v-spacer /></v-card-actions>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      modoCrearRúbrica: false,
      showCreateDialog: false,
      editingRubric: null,
      rubrics: [
        { id: '431548R', convocatoria: 'InovaTEC', area: 'Ingeniería de Software' },
        { id: '431549R', convocatoria: 'LOREM-PSUM-2025', area: 'Ingeniería de Software' }
      ],
      convocatorias: ['InovaTEC', 'PLEXO', 'PRUEBA 1', 'PRUEBA 2' ,'PRUEBA 3'],
      areas: ['INGENIERÍA Y TECNOLOGÍA', 'BIOMÉDICA', 'PRUEBA 1', 'PRUEBA 2', 'PRUEBA 3'],
      loading: false,
      form: {
        id: '',
        convocatoria: '',
        area: '',
        convocatorias: [],
        areas: [],
        criterios: [],
        ponderacionMaxima: 100
      }
    }
  },
  computed: {
    isFormValid() {
      return this.form.convocatorias.length && this.form.areas.length && this.form.criterios.length;
    }
  },
  methods: {
    editRubric(rubric) {
      this.editingRubric = rubric;
      this.form = { ...rubric };
      this.showCreateDialog = true;
    },
    deleteRubric(id) {
      if (confirm('¿Está seguro que desea eliminar esta rúbrica?')) {
        this.rubrics = this.rubrics.filter(r => r.id !== id);
      }
    },
    saveRubric() {
      if (this.editingRubric) {
        const index = this.rubrics.findIndex(r => r.id === this.editingRubric.id);
        this.rubrics.splice(index, 1, { ...this.form });
      } else {
        this.rubrics.push({ ...this.form });
      }
      this.resetForm();
      this.showCreateDialog = false;
    },
    resetForm() {
      this.form = {
        id: '', convocatoria: '', area: '', convocatorias: [], areas: [], criterios: [], ponderacionMaxima: 100
      };
      this.editingRubric = null;
    },
    añadirCriterio() {
      this.form.criterios.push({ descripcion: 'Ejemplo de criterio', ponderacion: 20 });
    },
    eliminarCriterio(index) {
      this.form.criterios.splice(index, 1);
    },
    editarCriterio(index) {
      const nuevoTexto = prompt('Editar descripción:', this.form.criterios[index].descripcion);
      if (nuevoTexto !== null) this.form.criterios[index].descripcion = nuevoTexto;
    },
    confirmar() {
      if (!this.isFormValid) return;
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        console.log('Formulario enviado', this.form);
      }, 1500);
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
.v-btn--small {
  font-size: 0.8125rem;
}
h2 {
  font-weight: bold;
}
</style>
