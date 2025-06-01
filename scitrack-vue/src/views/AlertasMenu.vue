<template>
  
      <v-container >
        <v-card class="mx-auto" max-width="600" style="overflow-y: scroll; scrollbar-width: thin;  max-height: 600px; height: max-content">
          <v-card-title class="text-h4 text-center">Enviar alerta</v-card-title>
              <v-alert
                v-if="confirmAlert"
                type="success"
                dismissible
              >
                {{ confirmAlert }}
              </v-alert>



          <v-card-text>
            <v-form ref="form" @submit.prevent="submitForm">
              <v-combobox
                v-model="destinatario"
                label="Destino"
                :items="['Todos','Participantes','Investigadores']"
                required
              ></v-combobox>

              <v-combobox
                v-model="selectedConvocatoria"
                label="Convocatoria"
               :items="Convocatorias"
                item-text="nombre"
                item-value="idConvocatoria"
                required
              ></v-combobox>

              <v-combobox
                label="Institución"
                v-model="selectedInstitucion"
                :items="Institucions"
                item-text="nombre"
                item-value="idInstitucion"
                required
              ></v-combobox>

            <v-text-field
                v-model="asunto"
                label="Asunto"
                placeholder="Ingrese su asunto..."
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="mensaje"
                label="Mensaje"
                placeholder="Ingrese su mensaje..."
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

            <v-file-input
                v-model="archivos"
                label="Archivo PDF menor a 66 KB"
                accept="application/pdf"
                :error-messages="fileError"
                color = "green"
              ></v-file-input>

              <v-alert
                v-if="submitError"
                type="error"
                dense
                class="mb-4"
              >
                {{ submitError }}
              </v-alert>

              <v-alert
                v-if="submitSuccess"
                type="success"
                dense
                class="mb-4 mt-3"
              >
              
                {{ submitSuccess }}
                <br>
              </v-alert>

              <v-btn
                color="primary"
                block
                type="submit"
                :loading="loading"
              >
                Confirmar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>

     


       

</template>

<script>
import api from '@/services/api';


export default {
  name: 'App',
  data(){
    return{
    usuario : JSON.parse(localStorage.getItem("userData")) || null,
    participantes: [],
    filtrados: [],
    Institucions: [],
    Convocatorias: [],
    Investigadores: [],
    selectedConvocatoria: "Todos",
    selectedInstitucion: "Todos",
    destinatario: "Todos",
    fileError: '',
    archivos:[],
    archivosSeleccionados: [],
          headersArchivos: [
        { text: '#', value: 'index' },
        { text: 'Nombre', value: 'name' },
        { text: 'Tamaño', value: 'size' },
        { text: 'Acción', value: 'accion' }
      ],

    confirmAlert: '',
    confirmPassword: '',
    submitError: '',
    submitSuccess: '',
    loading: false,
  }
},async mounted(){

    var response = await api.get('/api/investigador');
    this.Investigadores.push(...JSON.parse(JSON.stringify(response.data)));
    response = await api.get('/api/convocatoria');
    this.Convocatorias.push(...JSON.parse(JSON.stringify(response.data)));
    response = await api.get('/api/institucion');
    this.Institucions.push(...JSON.parse(JSON.stringify(response.data)));
    response = await api.get('/api/participante/and/convocatoria/');
    this.participantes.push(...JSON.parse(JSON.stringify(response.data)));

    this.Institucions.splice(0,0,{nombre:"Todos",idInstitucion:"Todos"});
    this.Convocatorias.splice(0,0,{nombre:"Todos",idConvocatoria:"Todos"});

    

  },
  methods: {
async submitForm() {
  this.submitError = '';
  this.submitSuccess = '';

  var destinatarios = [];
  if (this.destinatario == "Investigadores" || this.destinatario == "Todos"){
    destinatarios.push(...this.Investigadores);
    destinatarios = destinatarios.filter(d => d.EstadoPersona_idEstadoPersona != 1);
  }
  if (this.destinatario == "Participantes" || this.destinatario == "Todos")
    destinatarios.push(...this.participantes);

 
    
    
  // Filtrado correcto (no se reasignaba el resultado antes)
  if (this.selectedConvocatoria.idConvocatoria != "Todos") {
    destinatarios = destinatarios.filter(d => d.idConvocatoria == this.selectedConvocatoria.idConvocatoria);
  }
  if (this.selectedInstitucion.idInstitucion != "Todos") {
    destinatarios = destinatarios.filter(d => d.idInstitucion == this.selectedInstitucion.idInstitucion || d.Institucion_idInstitucion == this.selectedInstitucion.idInstitucion);
  }




  const subject = this.asunto;
  const text = this.mensaje;
  const file = this.archivos;
       const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  if(file){

    const form = new FormData()
    form.append("nombre",file.name);
    form.append("tamanio",file.size);
    form.append("fechaIngreso",currentDate);
    form.append("contenido",file);

    const response = await fetch("http://localhost:3000/api/archivos/",{
      method: "POST",
      body: form
    })

    const idA = JSON.parse(JSON.stringify(await response.json())).idArchivos;


  const requests = destinatarios.map(async to => {
    const formData = new FormData();
    formData.append("email", to.correo);
    formData.append("asunto", subject);
    formData.append("mensaje", text);
    formData.append("nombreArchivo", file.name);
    formData.append("buffer", file);
    formData.append("Administrador_idAdministrador",this.usuario.idAdministrador);
    if(to.idInvestigador)
    formData.append("Investigador_idInvestigador",to.idInvestigador);
    else
    formData.append("Participante_idParticipante",to.idParticipante);
    formData.append("Archivo_idArchivo",idA);

  

    return fetch("http://localhost:3000/api/constancias/enviarMensaje", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .catch(err => {
        console.error("Error enviando a:", to.correo, err);
        throw err; // para que Promise.all lo capture
      });
  });

  try {
    await Promise.all(requests);
    this.submitSuccess = 'Mensajes enviados correctamente.';
  } catch (err) {
    this.submitError = 'Error al enviar mensajes.';
    console.log(err);
  }
}else{
      const requests = destinatarios.map(to => {


    return fetch("http://localhost:3000/api/constancias/enviarMensaje2", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },body: JSON.stringify({
        email:to.correo,
        asunto:subject,
        mensaje:text,
        Administrador_idAdministrador:this.usuario.idAdministrador,
        Investigador_idInvestigador: to.idInvestigador,
        Participantes_idParticipante: to.idParticipante

      })
    })
      .then(res => res.json())
      .catch(err => {
        console.error("Error enviando a:", to.correo, err);
        throw err; // para que Promise.all lo capture
      });
  });

  try {
    await Promise.all(requests);
    this.submitSuccess = 'Mensajes enviados correctamente.';
  } catch (err) {
    this.submitError = 'Error al enviar mensajes.';
  }
}
},

     eliminarArchivo(index) {
      this.archivosSeleccionados.splice(index, 1);
      // Update indexes
      this.archivosSeleccionados.forEach((item, i) => {
        item.index = i + 1;
      });
    },
    async uploadFiles(idInvestigador) {
      for (const item of this.archivosSeleccionados) {
        const archivo = item.file;
        const tamanioEnKB = (archivo.size / 1024).toFixed(2);

        const formData = new FormData();
        formData.append("nombre", archivo.name);
        formData.append("Investigador_idInvestigador", idInvestigador);
        formData.append("tamanio", tamanioEnKB);
        formData.append("fechaIngreso", new Date().toISOString().split("T")[0]);
        formData.append("contenido", archivo);

        try {
          await fetch("http://localhost:3000/api/archivos/", {
            method: "POST",
            body: formData,
          });
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      }
    },
     startLoad() {
      this.loading = true;
    },
    endLoad() {
      this.loading = false;
    },
    showAlert(text) {
      this.confirmAlert = text;
      setTimeout(() => {
        this.confirmAlert = '';
      }, 3000);
    }
  },
};
</script>

<style>
.loading-gif {
  position: fixed;
  width: 4vmax;
  top: 47%;
  left: 47%;
  z-index: 1000;
}

.v-data-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>