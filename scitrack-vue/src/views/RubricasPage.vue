<template>
  <v-app >
    <v-main class="pa-0">
      <v-container class="pa-6">
        <h1 class="text-h4 mb-6">Rúbricas</h1>

        <!-- VER RÚBRICAS -->
        <div v-if="activeView === 'ver'">
          <v-divider class="mb-6" />

          <div style="max-height: 400px; overflow-y: auto;" class="mb-2">
            <v-card
              v-for="rubrica in rubrics"
              :key="rubrica.rubrica_id"
              class="mb-4"
              flat
              outlined
            >
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="mb-1 font-weight-bold">#{{ rubrica.rubrica_id }}</p>
                    <p class="mb-1">Descripción: {{ rubrica.rubrica_descripcion }}</p>
                    <p class="mb-0">Área: {{ rubrica.area_nombre }}</p>
                  </div>
                  <div>
                    <span class="text-caption grey--text">Ver más:</span>
                    <v-btn
                      small
                      color="primary"
                      class="ml-2"
                      @click="editRubric(rubrica.rubrica_id)"
                    >Editar</v-btn>
                    <v-btn
                      small
                      color="error"
                      class="ml-2"
                      @click="deleteRubric(rubrica.rubrica_id)"
                    >Eliminar</v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <div class="text-center">
            <v-btn
              color="primary"
              class="mt-2 elevation-5"
              style="width: 100%;"
              depressed
              @click="dialogCrear = true"
            >
              Crear una rúbrica
            </v-btn>
          </div>
        </div>

        <!-- MODAL CREAR RÚBRICA -->
        <v-dialog v-model="dialogCrear" max-width="500px">
          <v-card>
            <v-card-title>Crear Rúbrica</v-card-title>
            <v-card-text>
              <v-form ref="formCrear" v-model="valid">
                <v-text-field
                  v-model="nuevaRubrica.descripcion"
                  label="Descripción"
                  :rules="[v => !!v || 'Descripción es requerida']"
                  required
                ></v-text-field>

                <v-select
                  v-model="nuevaRubrica.area_id"
                  :items="areas"
                  item-text="nombre"
                  item-value="idAreaDeConocimientoCat"
                  label="Área de Conocimiento"
                  :rules="[v => !!v || 'Área es requerida']"
                  required
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="cancelarCrear">Cancelar</v-btn>
              <v-btn
                color="primary"
                :disabled="!valid"
                @click="guardarNuevaRubrica"
              >Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- EDITAR RÚBRICA -->
        <rubrica-form
          v-if="activeView === 'editar'"
          titulo="Editar Rúbrica"
          :rubrica="selectedRubrica"
          @cancelar="cancelar"
        />
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
      rubrics: [],
      selectedRubrica: null,

      // Modal Crear
      dialogCrear: false,
      nuevaRubrica: {
        descripcion: '',
        area_id: null, // guardará la id correcta
      },
      areas: [],
      valid: false,
    };
  },
  mounted() {
    this.loadRubricas();
    this.loadAreas();
  },
  methods: {
    async loadRubricas() {
      try {
        const res = await fetch('http://localhost:3000/api/rubricaConTodo/');
        const data = await res.json();

        const rubricaMap = {};
        data.forEach(row => {
          if (!rubricaMap[row.rubrica_id]) {
            rubricaMap[row.rubrica_id] = {
              rubrica_id: row.rubrica_id,
              rubrica_descripcion: row.rubrica_descripcion,
              area_nombre: row.area_nombre,
              categoria_nombre: row.categoria_nombre,
              criterios: []
            };
          }

          if (row.criterio_id) {
            rubricaMap[row.rubrica_id].criterios.push({
              idCriterios: row.criterio_id,
              descripcion: row.criterio_descripcion,
              ponderacion: row.ponderacion
            });
          }
        });

        this.rubrics = Object.values(rubricaMap);
      } catch (err) {
        console.error('Error al cargar rúbricas:', err);
      }
    },
    async loadAreas() {
      try {
        const res = await fetch('http://localhost:3000/api/areadeconocimientocat/');
        this.areas = await res.json();
      } catch (err) {
        console.error('Error al cargar áreas:', err);
      }
    },
    editRubric(id) {
      const rubrica = this.rubrics.find(r => r.rubrica_id === id);
      if (rubrica) {
        this.selectedRubrica = JSON.parse(JSON.stringify(rubrica));
        this.activeView = 'editar';
      }
    },
    async deleteRubric(id) {
      if (!confirm('¿Está seguro que desea eliminar esta rúbrica?')) return;

      try {
        const res = await fetch(`http://localhost:3000/api/rubrica/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) throw new Error('Error al eliminar la rúbrica');

        this.rubrics = this.rubrics.filter(r => r.rubrica_id !== id);
      } catch (err) {
        console.error('Error al eliminar rúbrica:', err);
        alert('Hubo un problema al eliminar la rúbrica.');
      }
    },
    cancelar() {
      this.selectedRubrica = null;
      this.activeView = 'ver';
    },
    cancelarCrear() {
      this.dialogCrear = false;
      this.nuevaRubrica.descripcion = '';
      this.nuevaRubrica.area_id = null;
      this.$refs.formCrear.resetValidation();
    },
    async guardarNuevaRubrica() {
      const isValid = await this.$refs.formCrear.validate();
      if (!isValid) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
      }

      const descripcion = this.nuevaRubrica.descripcion?.trim();
      const areaId = this.nuevaRubrica.area_id;

      if (!descripcion) {
        alert("Por favor, ingresa la descripción de la rúbrica.");
        return;
      }
      if (!areaId || typeof areaId !== "number" || areaId <= 0) {
        alert("Por favor, selecciona un área de conocimiento válida.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/rubrica/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            descripcion,
            AreaDeConocimientoCat_idAreaDeConocimientoCat: areaId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al crear rúbrica");
        }

        const data = await response.json();

        this.rubrics.push({
          rubrica_id: data.rubrica_id || data.id,
          rubrica_descripcion: data.descripcion,
          area_nombre: this.areas.find(a => a.idAreaDeConocimientoCat === areaId)?.nombre || "",
          criterios: []
        });

        this.nuevaRubrica.descripcion = '';
        this.nuevaRubrica.area_id = null;
        this.dialogCrear = false;
        this.$refs.formCrear.resetValidation();

        alert("Rúbrica creada correctamente.");
      } catch (error) {
        console.error("Error al crear la rúbrica:", error);
        alert("No se pudo guardar la rúbrica. Intenta de nuevo.");
      }
    }
  }
};
</script>
