<template>
  <v-card outlined>
    <v-card-title>
      <h2>{{ titulo }}</h2>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Convocatorias -->
        <v-col cols="12" md="4">
          <div>
            <h3>Convocatoria</h3>
            <v-card outlined class="pa-2" style="max-height: 150px; overflow-y: auto;">
              <v-checkbox
                v-for="item in convocatorias"
                :key="item"
                v-model="form.convocatorias"
                :label="item"
                :value="item"
                dense
                hide-details
              />
            </v-card>
          </div>

          <!-- Áreas -->
          <div class="mt-4">
            <h3>Área(s) de conocimiento</h3>
            <v-card outlined class="pa-2" style="max-height: 150px; overflow-y: auto;">
              <v-checkbox
                v-for="item in areas"
                :key="item"
                v-model="form.areas"
                :label="item"
                :value="item"
                dense
                hide-details
              />
            </v-card>

            <!-- Advertencias -->
            <p class="red--text text--darken-2 text-subtitle-2 mt-5">
              *Debe seleccionar al menos una área de conocimiento
            </p>
            <p class="red--text text--darken-2 text-subtitle-2">
              *Seleccione máximo 3 áreas
            </p>

            <!-- Botón Confirmar -->
            <v-btn
              color="primary"
              class="mt-4 py-4"
              block
              :loading="loading"
              @click="confirmar"
              :disabled="!isFormValid"
            >
              Confirmar
            </v-btn>
          </div>
        </v-col>

        <!-- Criterios -->
        <v-col cols="12" md="8">
          <h3 class="mb-2">Criterios de evaluación</h3>
          <v-card outlined class="pa-3" style="max-height: 400px; overflow-y: auto;">
            <v-card
              v-for="(criterio, index) in form.criterios"
              :key="index"
              outlined
              class="mb-3"
            >
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
              <v-text-field
                label="Ponderación máxima"
                v-model.number="form.ponderacionMaxima"
                type="number"
                min="0"
                dense
              />
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" @click="añadirCriterio">
                Añadir criterio
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="grey" @click="$emit('cancelar')">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'RubricaForm',
  props: {
    titulo: {
      type: String,
      required: true
    },
    rubrica: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      convocatorias: ['InovaTEC', 'PLEXO', 'PRUEBA 1', 'PRUEBA 2', 'PRUEBA 3'],
      areas: ['INGENIERÍA Y TECNOLOGÍA', 'BIOMÉDICA', 'PRUEBA 1', 'PRUEBA 2', 'PRUEBA 3'],
      form: {
        convocatorias: [],
        areas: [],
        criterios: [],
        ponderacionMaxima: 100
      }
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.convocatorias.length > 0 &&
        this.form.areas.length > 0 &&
        this.form.areas.length <= 3 &&
        this.form.criterios.length > 0
      );
    }
  },
  watch: {
    rubrica: {
      handler(newVal) {
        if (newVal) {
          // Simulación de carga de datos en modo edición
          this.form.convocatorias = ['PRUEBA 2'];
          this.form.areas = ['BIOMÉDICA'];
          this.form.criterios = [
            { descripcion: 'Claridad', ponderacion: 30 },
            { descripcion: 'Innovación', ponderacion: 40 }
          ];
          this.form.ponderacionMaxima = 100;
        }
      },
      immediate: true
    }
  },
  methods: {
    añadirCriterio() {
      this.form.criterios.push({
        descripcion: 'Ejemplo de criterio',
        ponderacion: 20
      });
    },
    eliminarCriterio(index) {
      this.form.criterios.splice(index, 1);
    },
    editarCriterio(index) {
      const nuevoTexto = prompt('Editar descripción:', this.form.criterios[index].descripcion);
      if (nuevoTexto !== null) {
        this.form.criterios[index].descripcion = nuevoTexto;
      }
    },
    confirmar() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        console.log(`${this.titulo} enviado`, this.form);
        this.$emit('cancelar');
      }, 1000);
    }
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
