<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <h1 class="text-h4 mb-6">SCTTRACK</h1>
        <p class="text-subtitle-1 mb-8">Instituto de Ciencia, Tecnología e Innovación</p>

        <!-- VER RÚBRICAS -->
        <div v-if="activeView === 'ver'">
          <h2 class="text-h5 mb-4">Rúbricas</h2>
          <v-divider class="mb-6" />

          <div style="max-height: 400px; overflow-y: auto;" class="mb-2">
            <v-card v-for="(rubric, index) in rubrics" :key="index" class="mb-4" flat outlined>
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="mb-1 font-weight-bold">#{{ rubric.id }}</p>
                    <p class="mb-1">Para convocatoria: {{ rubric.convocatoria }}</p>
                    <p class="mb-0">Área(s): {{ rubric.area }}</p>
                  </div>
                  <div>
                    <span class="text-caption grey--text">Ver más:</span>
                    <v-btn small color="primary" class="ml-2" @click="editRubric(rubric)">Editar</v-btn>
                    <v-btn small color="error" class="ml-2" @click="deleteRubric(rubric.id)">Eliminar</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <div class="text-center">
            <v-btn color="primary" class="mt-2 elevation-5" style="width: 100%;" depressed @click="activeView = 'crear'">
              Crear una rúbrica
            </v-btn>
          </div>
        </div>

        <!-- CREAR RÚBRICA -->
        <rubrica-form v-if="activeView === 'crear'" titulo="Crear Rúbrica" :form.sync="form" @cancelar="cancelar" @confirmar="confirmar" />

        <!-- EDITAR RÚBRICA -->
        <rubrica-form v-if="activeView === 'editar'" titulo="Editar Rúbrica" :form.sync="form" @cancelar="cancelar" @confirmar="confirmar" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import RubricaForm from '@/components/RubricaForm.vue';

export default {
  components: {
    RubricaForm
  },
  data() {
    return {
      activeView: 'ver',
      convocatorias: ['InovaTEC', 'PLEXO', 'PRUEBA 1', 'PRUEBA 2'],
      areas: ['INGENIERÍA Y TECNOLOGÍA', 'BIOMÉDICA', 'PRUEBA 1', 'PRUEBA 2'],
      rubrics: [
        { id: '431548R', convocatoria: 'InovaTEC', area: 'Ingeniería de Software' },
        { id: '123ABC', convocatoria: 'PLEXO', area: 'Biomédica' }
      ],
      form: {
        convocatorias: [],
        areas: [],
        criterios: [],
        ponderacionMaxima: 100
      }
    };
  },
  methods: {
    confirmar() {
      this.activeView = 'ver';
    },
    cancelar() {
      this.resetForm();
      this.activeView = 'ver';
    },
    editRubric(rubric) {
      this.form = {
        convocatorias: [rubric.convocatoria],
        areas: [rubric.area],
        criterios: [],
        ponderacionMaxima: 100
      };
      this.activeView = 'editar';
    },
    deleteRubric(id) {
      if (confirm('¿Está seguro que desea eliminar esta rúbrica?')) {
        this.rubrics = this.rubrics.filter(r => r.id !== id);
      }
    },
    resetForm() {
      this.form = {
        convocatorias: [],
        areas: [],
        criterios: [],
        ponderacionMaxima: 100
      };
    }
  }
};
</script>
