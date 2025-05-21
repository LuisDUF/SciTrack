<template>
    <div>
      <h2>Mis Convocatorias</h2>
      <extra>
       
        <v-dialog v-model="dialog"  max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="error darken-2">mdi-alert</v-icon>
            <p class="font-weight-bold text-h4">¡Alerta!</p>
            <p class="text-h6 font-weight-regular">¿Está seguro que desea eliminar esta convocatoria?</p>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="white" style="background-color: #6596FF;" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="white" style="background-color: #B1CAFF;" text @click="confirmDelete">Aceptar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="alreadyDeleted"  max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="grey darken-2">mdi-trash-can</v-icon>
            <p class="text-h6 font-weight-regular">Este elemento ya se encuentra inactivo</p>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="white" style="background-color: #6596FF;" text @click="alreadyDeleted = false">Aceptar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="succesfulDelete"  max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="error darken-2">mdi-trash-can</v-icon>
            <p class="text-h6 font-weight-regular">Se ha borrado exitosamente</p>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="white" style="background-color: #6596FF;" text @click="afterSuccesfulDelete()">Aceptar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </extra>
      <template>
        


        <v-container fluid style="background-color: #BFD6FF;" class="very-rounded py-5 px-5 mt-4">
          <v-row dense>
            <v-col
              v-for="(card, index) in projectCards"
              :key="index"
              cols="12"
            >
              <v-card class="pa-4 " outlined  elevation="1" style="background-color: #FFFFFF; border-radius: 10px;">

                <v-card-text>
                  <div class="text--primary font-weight-bold">#{{ card.id }}</div>
                  <div><strong>Nombre:</strong> {{ card.nombre }}</div>
                  <div><strong>Estado:</strong> {{ card.estado }}</div>
                  <div><strong>Fecha de inicio:</strong> {{ card.fechaInicio }}</div>
                  <div><strong>Fecha de cierre:</strong> {{ card.fechaFin }}</div>
                </v-card-text>

                <v-card-actions>
                  <v-row>
                    <v-col md="4" sm="12" xs = "12" lg="2">
                      <v-btn block color="primary" class="bit-more-rounded" depressed>Ver más</v-btn>
                    </v-col>
                    <v-col md="4" sm="12" xs = "12" lg="2">
                      <v-btn block color="success" class="bit-more-rounded" depressed>Editar</v-btn>
                    </v-col>
                    <v-col v-if="card.estado != 'Inactiva'" md="4" sm="12" xs = "12" lg="2">
                      <v-btn block color="error darken-2" class="bit-more-rounded" depressed @click="openDeleteDialog(card.id)">Eliminar</v-btn>
                    </v-col>
                    <v-col v-if="card.estado == 'Inactiva'" md="4" sm="12" xs = "12" lg="2">
                      <v-btn block color="grey " class="bit-more-rounded" depressed @click="alreadyDeleted = true">Eliminar</v-btn>
                    </v-col>
                    <v-col md="4" sm="12" xs = "12" lg="2">
                      <v-btn block color="purple darken-3" dark class="bit-more-rounded" depressed>Fases</v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>

              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </div>
</template>

<script>
export default {
  name: 'ProjectCardList',
  data() {
    return {
      dialog: false,
      alreadyDeleted: false,
      succesfulDelete: false,
      selectedConvocatoriaId: null,
      projectCards: []
    };
  },
  methods:{
    weirdDateToNormalDate(rawDate)
    {
      const date = new Date(rawDate);

      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();

      const formatted = `${day}-${month}-${year}`;

      return formatted;
    },
    openDeleteDialog(id) {
      this.selectedConvocatoriaId = id;
      this.dialog = true;
    },
    confirmDelete() {
      if (this.selectedConvocatoriaId !== null) {
        this.deleteConvocatoria(this.selectedConvocatoriaId);
      }
      this.dialog = false;
    },
    deleteConvocatoria(id) {
      fetch("http://localhost:3000/api/convocatoria/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "Inactiva",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.succesfulDelete = true;
        })
        .catch((error) => console.error("Error:", error));
    },
    afterSuccesfulDelete()
    {
      this.succesfulDelete = false;
      window.location.reload();
    }
  },
  mounted() {
  fetch("http://localhost:3000/api/convocatoria/", {
    method: "GET",
  })
      .then((response) => response.json())
      .then((data) => {

        
        this.projectCards = data.map(item => ({
          
          id: item.idConvocatoria,
          nombre: item.nombre,
          estado: item.estado || 'Desconocido',
          fechaInicio: this.weirdDateToNormalDate(item.fechaInicio),
          fechaFin: this.weirdDateToNormalDate(item.fechaFin),
        }));
      })
      .catch((error) => console.error("Error:", error));
  }
};
</script>

<style scoped>

.very-rounded {
  border-radius: 10px;
}

.bit-more-rounded{
  border-radius: 6px;
}
</style>