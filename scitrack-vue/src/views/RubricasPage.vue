<template>
    <div>
      <h2>Cocho Cochuis</h2>
      <p>vue2 vuetify2</p>
    </div>
  </template><template>
  <v-container>
    <v-card outlined>
      <v-card-title>
        <h2>Crear rúbrica</h2>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- Sección de Convocatoria y Áreas -->
          <v-col cols="12" md="4">
            <h3>Convocatoria</h3>
            <v-checkbox
              v-for="item in convocatorias"
              :key="item"
              v-model="form.convocatorias"
              :label="item"
              :value="item"
              dense
              hide-details
            />

            <h3 class="mt-4">Área(s) de conocimiento</h3>
            <v-checkbox
              v-for="item in areas"
              :key="item"
              v-model="form.areas"
              :label="item"
              :value="item"
              dense
              hide-details
            />
          </v-col>

          <!-- Sección de Criterios -->
          <v-col cols="12" md="8">
            <h3>Criterios de evaluación</h3>

            <v-card
              v-for="(criterio, index) in form.criterios"
              :key="index"
              class="mb-3"
              outlined
            >
              <v-card-text>
                <p>
                  <strong>Criterio:</strong> {{ criterio.descripcion }}
                </p>
                <p>
                  <strong>Ponderación:</strong>
                  {{ criterio.ponderacion }} puntos máximos.
                </p>
                <v-btn color="success" small @click="editarCriterio(index)">
                  Editar
                </v-btn>
                <v-btn color="error" small @click="eliminarCriterio(index)">
                  Eliminar
                </v-btn>
              </v-card-text>
            </v-card>

            <v-row class="align-center">
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

            <!-- Validaciones -->
            <v-alert type="error" dense v-if="form.criterios.length === 0">
              *Se requiere al menos un criterio para registrar la rúbrica
            </v-alert>
            <v-alert type="error" dense v-if="!isFormValid">
              *Todos los campos son obligatorios para registrar la rúbrica
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmar">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      convocatorias: ['InovaTEC', 'PLEXO'],
      areas: ['INGENIERÍA Y TECNOLOGIA', 'BIOMEDICA'],
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
        this.form.convocatorias.length &&
        this.form.areas.length &&
        this.form.criterios.length
      );
    }
  },
  methods: {
    añadirCriterio() {
      this.form.criterios.push({
        descripcion: 'Lorem ipsum dolor sit amet...',
        ponderacion: 20
      });
    },
    eliminarCriterio(index) {
      this.form.criterios.splice(index, 1);
    },
    editarCriterio(index) {
      // Aquí podrías abrir un diálogo para editar la descripción y ponderación
      const nuevoTexto = prompt('Editar descripción:', this.form.criterios[index].descripcion);
      if (nuevoTexto !== null) {
        this.form.criterios[index].descripcion = nuevoTexto;
      }
    },
    confirmar() {
      if (!this.isFormValid) {
        return;
      }
      // Enviar los datos al backend
      console.log('Formulario enviado', this.form);
    }
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
