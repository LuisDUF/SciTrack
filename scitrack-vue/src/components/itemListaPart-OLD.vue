<template>
  <div class="rounded" style="margin-top: 0.666vw; padding: 1vw; padding-left:1.33vw; padding-right: 1.33vw; background-color: #ffffff;">
    <extra>
      <v-dialog v-model="deleteDialog" max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="error darken-2"
              >mdi-alert</v-icon
            >
            <p class="font-weight-bold text-h4">¡Alerta!</p>
            <p class="text-h6 font-weight-regular">
              ¿Está seguro que desea eliminar esta convocatoria?
            </p>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="white"
                style="background-color: #6596ff"
                text
                @click="deleteDialog = false"
                >Cancelar</v-btn
              >
              <v-btn
                color="white"
                style="background-color: #b1caff"
                text
                @click="deleteParticipante()"
                >Aceptar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="loading"
          max-width="400"
          persistent
          no-click-animation
        >
          <v-card class="text-center pa-5">
            <br /><v-progress-circular
              :size="100"
              :width="7"
              color="blue"
              indeterminate
            ></v-progress-circular
            ><br />
            <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
          </v-card>
        </v-dialog>
        <v-dialog v-model="loadingDone" :persistent="true" max-width="400">
          <v-card class="text-center pa-5">
            <v-icon class="text-h1 text-center mt-4" color="green lighten-2"
              >mdi-check-circle</v-icon
            >
            <p class="font-weight-bold text-h4 mt-5">
              Se ha procesado su información
            </p>
            <v-card-actions class="d-flex justify-center">
              <v-btn
                color="white"
                style="background-color: #6596ff"
                text
                @click="finishDelete()"
                >Aceptar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
    </extra>
    <p class="text-subtitle-1"><b>Nombre:</b>  {{ `${this.investigador.nombre} ${this.investigador.apellidoPaterno} ${this.investigador.apellidoMaterno}` }}</p> 
    <p class="text-subtitle-1"><b>Institución:</b>  {{ institucion }}</p> 
    <p class="text-subtitle-1"><b>Convocatoria:</b>   {{ conocimiento }}</p> 
    <v-row>
                  <v-col md="6" sm="12" xs="12" lg="2">
                    <v-btn @click="openModalRev()" class="rounded mt-2" style="color: #ffffff; background-color: #6596FF;">Revisar</v-btn>
                  </v-col>
                  <v-col md="6" sm="12" xs="12" lg="2">
                    <v-btn @click="deleteDialog = true" class="rounded mt-2" style="color: #ffffff; background-color: red;">Eliminar</v-btn>
                  </v-col>        
    </v-row>
  </div>
</template>

  
  <script>
  export default {
    data() {
      return {
        deleteDialog:false,
        loading:false
      };
    },
    props: {
      nombre: String,
      institucion: String,
      conocimiento: String,
      estado: String,
      investigador: Object,
      vari: Object,
      seleccion: Object
    },
    methods: {
      async openModalRev() {
        this.loading = true;
        this.$set(this.seleccion, 'selectis', this.investigador);
        let response, data;
        if (this.investigador.idInstitucion != null)
       { response = await fetch(`http://localhost:3000/api/institucion/${this.investigador.idInstitucion}`);
        data = await response.json();
        this.$set(this.seleccion, 'isti', JSON.parse(JSON.stringify(data[0])));}
        
        if (this.investigador.idConvocatoria != null)
       { response = await fetch(`http://localhost:3000/api/convocatoria/${this.investigador.idConvocatoria}`);
        data = await response.json();
        this.$set(this.seleccion, 'area', JSON.parse(JSON.stringify(data[0])));}
        
        if (this.investigador.Archivos_idArchivos != null)
        {
          response = await fetch(`http://localhost:3000/api/archivos/${this.investigador.Archivos_idArchivos}`);
          data = await response.json();
          const archi = [...JSON.parse(JSON.stringify(data))];
          this.$set(this.seleccion, 'archivos', archi);
        }
        this.loading = false;
        this.$set(this.vari, 'no', 'SI');
      },

      async deleteParticipante() {
        this.loading = true;
        this.$set(this.seleccion, 'selectis', this.investigador);
          try {
          const response = await fetch(
            "http://localhost:3000/api/participante/" + this.investigador.idParticipante,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                isDeleted: 1
              }),
            }
          );

          const result = await response.json();
          console.log(result);
          this.loading = false;  
          this.loadingDone = true;
        } catch (error) {
          console.error("Error:", error);
        }
      },
      finishDelete()
      {
        window.location.reload();  

      }
    }
  };
  </script>
  
  