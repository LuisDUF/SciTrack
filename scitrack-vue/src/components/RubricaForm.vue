<template>
  <v-card outlined>
    <v-card-title>
      <h2>{{ titulo }}</h2>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="15">
          <h3>Criterios de evaluación</h3><br>
          <v-row class="mb-1" align="center">
            <v-spacer />
            <v-col cols="auto">
              <v-btn color="primary" @click="abrirModalNuevoCriterio">
                Añadir criterio
              </v-btn>
            </v-col>
          </v-row>

          <v-card outlined class="pa-3" style="max-height: 400px; overflow-y: auto;">
            <v-card
              v-for="(criterio, index) in form.criterios"
              :key="criterio.idCriterios || index"
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
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="grey" @click="$emit('cancelar')">Cancelar</v-btn>
    </v-card-actions>

    <!-- Modal Nuevo Criterio -->
    <v-dialog v-model="dialogNuevoCriterio" max-width="500px">
      <v-card>
        <v-card-title>Nuevo Criterio</v-card-title>
        <v-card-text>
          <v-text-field label="Descripción" v-model="nuevoCriterio.descripcion" />
          <v-text-field label="Ponderación" v-model.number="nuevoCriterio.ponderacion" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" @click="dialogNuevoCriterio = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarNuevoCriterio">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "RubricaForm",
  props: {
    titulo: { type: String, required: true },
    rubrica: { type: Object, default: null }
  },
  data() {
    return {
      areas: [],
      dialogNuevoCriterio: false,
      nuevoCriterio: {
        descripcion: '',
        ponderacion: null
      },
      form: {
        areas: [],
        criterios: [],
        ponderacionMaxima: 100
      }
    };
  },
  watch: {
    rubrica: {
      handler(newVal) {
        if (newVal) {
          this.form.areas = [newVal.area_nombre];
          this.form.criterios = newVal.criterios || [];
          const total = this.form.criterios.reduce((sum, c) => sum + parseFloat(c.ponderacion || 0), 0);
          this.form.ponderacionMaxima = total;
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.fetchAreas();
  },
  methods: {
    async fetchAreas() {
      try {
        const res = await fetch("http://localhost:3000/api/areadeconocimientocatRub/");
        const data = await res.json();
        this.areas = [...new Set(data.map((a) => a.area_nombre))];
      } catch (error) {
        console.error("Error al cargar áreas de conocimiento:", error);
      }
    },
    abrirModalNuevoCriterio() {
      this.nuevoCriterio = { descripcion: '', ponderacion: null };
      this.dialogNuevoCriterio = true;
    },
    async guardarNuevoCriterio() {
      if (!this.nuevoCriterio.descripcion || this.nuevoCriterio.ponderacion == null) {
        alert("Completa todos los campos.");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/criterio/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            descripcion: this.nuevoCriterio.descripcion,
            ponderacion: this.nuevoCriterio.ponderacion
          })
        });

        const data = await res.json();
        this.form.criterios.push({
          idCriterios: data.idCriterios,
          descripcion: data.descripcion,
          ponderacion: data.ponderacion
        });

        this.dialogNuevoCriterio = false;
      } catch (error) {
        console.error("Error al crear criterio:", error);
        alert("Error al guardar el criterio.");
      }
    },
    async eliminarCriterio(index) {
      const criterio = this.form.criterios[index];
      if (!criterio.idCriterios) {
        alert("Este criterio no existe en la base de datos.");
        return;
      }

      if (!confirm("¿Eliminar este criterio?")) return;
        alert(index)
      try {
        const res = await fetch(`http://localhost:3000/api/criterio/`+criterio.idCriterios, {
          method: "DELETE"
        });

        if (res.status === 204) {
          this.form.criterios.splice(index, 1);
        } else {
          const errorData = await res.json();
          alert("Error al eliminar el criterio: " + errorData.message);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Ocurrió un error al eliminar.");
      }
    },
    async editarCriterio(index) {
      const criterio = this.form.criterios[index];
      const descripcion = prompt("Editar descripción:", criterio.descripcion);
      const ponderacion = prompt("Editar ponderación:", criterio.ponderacion);

      if (descripcion !== null && ponderacion !== null) {
        try {
          const res = await fetch(`http://localhost:3000/api/criterio/${criterio.idCriterios}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              descripcion,
              ponderacion,
              Rubrica_idRubrica: this.rubrica?.rubrica_id || null
            })
          });

          const data = await res.json();
          this.form.criterios[index] = {
            ...criterio,
            descripcion: data.descripcion,
            ponderacion: data.ponderacion
          };
        } catch (error) {
          console.error("Error al editar:", error);
          alert("Error al editar criterio.");
        }
      }
    }
  }
};
</script>

<style scoped>
h2 {
  font-weight: bold;
}
</style>
