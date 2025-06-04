<template>
  <v-app style="background-color: rgba(14, 73, 201, 0.24);">
    <v-app-bar app color=#062A78 dark>
      <v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="200" src="../SCITRACK.png"
        width="100" />
    </v-app-bar>



    <v-main>
      <div style="width: 100%; margin-top: 3vw;  text-align: center; margin-bottom: 2vw;">
        <img class="rounded" style="width: 73vw;" src="../assets/piim.jpg" alt="">
        <br>
        <button @click="descargarPDF(1)" class="px-10 py-2 rounded my-3"
          style="color: aliceblue; background-color: #062A78;">Formato de incorporación</button>
        <button @click="descargarPDF(2)" class="px-10 py-2 rounded my-3 mx-3"
          style="color: aliceblue; background-color: #062A78;">Convocatoria PIIM 2025</button>
        <button @click="descargarPDF(3)" class="px-10 py-2 rounded my-3"
          style="color: aliceblue; background-color: #062A78;">Formato de renovación</button>


      </div>
      <v-container class="" style="margin-top: 0; padding-top: 0vw; padding-bottom: 4vw;  ">
        <v-card class="pa-12">



          <v-dialog v-model="loading" max-width="400" persistent no-click-animation>
            <v-card class="text-center pa-5">
              <br /><v-progress-circular :size="100" :width="7" color="blue" indeterminate></v-progress-circular><br />
              <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
            </v-card>
          </v-dialog>


          <v-container class="pa-0">
            <v-card-title class="text-center justify-center mb-10"
              style="width: 100%; font-size: 2.8vw; color: #062A78;"><b>Registro de Candidato</b></v-card-title>
            <v-alert v-if="confirmAlert" type="error" dismissible>
              {{ confirmAlert }}
            </v-alert>
            <v-alert v-if="submitSuccess" type="success" dense class="mb-4 mt-3">

              {{ submitSuccess }}
              <br>
            </v-alert>
            <v-card style="overflow-y: auto; height: 30vw;" class="pa-2" color="#e3e6ff">



              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="form.nombre" label="Nombre(s)" placeholder="Ingrese su nombre..." required
                    color="green"></v-text-field>

                  <v-text-field v-model="form.apellidoPaterno" label="Apellido paterno"
                    placeholder="Ingrese su apellido paterno..." required color="green"></v-text-field>

                  <v-text-field v-model="form.apellidoMaterno" label="Apellido materno"
                    placeholder="Ingrese su apellido materno..." required color="green"></v-text-field>

                  <v-text-field v-model="form.correo" label="Correo electrónico" placeholder="Ingrese su correo..."
                    :rules="emailRules" required type="email" color="green"></v-text-field>

                  <v-text-field v-model="form.telefono" label="Teléfono" placeholder="Ingrese su número de teléfono..."
                    type="number" required color="green"></v-text-field>

                  <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                    :return-value.sync="form.fechaNacimiento" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="form.fechaNacimiento" label="Fecha de Nacimiento"
                        placeholder="Seleccione su fecha de nacimiento" readonly v-bind="attrs" v-on="on" required
                        color="green"></v-text-field>
                    </template>
                    <v-date-picker v-model="form.fechaNacimiento" no-title scrollable
                      :max="new Date().toISOString().substr(0, 10)" @input="$refs.menu.save(form.fechaNacimiento)">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(form.fechaNacimiento)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-select v-model="form.pais" :items="paises" item-text="nombre" item-value="idPais"
                    label="Nacionalidad" required @change="cargarEstados" color="green"></v-select>

                  <v-select v-if="form.pais" v-model="form.estado" :items="estadosFiltrados" item-text="nombre"
                    item-value="idEstado" label="Estado" required @change="cargarMunicipios" color="green"></v-select>

                  <v-select v-if="form.estado" v-model="form.municipio" :items="municipiosFiltrados" item-text="nombre"
                    item-value="idMunicipio" label="Municipio" required color="green"></v-select>

                  <v-text-field v-if="form.municipio" v-model="form.domicilio" label="Domicilio"
                    placeholder="Ingrese su domicilio..." required color="green"></v-text-field>

                  <v-text-field :value="form.curp" @input="form.curp = $event.toUpperCase()" label="CURP"
                    placeholder="Ingrese su CURP..." :rules="curpRules" required counter="18"
                    color="green"></v-text-field>

                  <v-text-field :value="form.rfc" @input="form.rfc = $event.toUpperCase()" label="RFC"
                    placeholder="Ingrese su RFC..." :rules="rfcRules" required color="green"></v-text-field>

                  <v-select v-model="form.estadoCivil" :items="estadosCivil" item-text="nombre" item-value="nombre"
                    label="Estado Civil" placeholder="Ingrese su estado civil..." required color="green"></v-select>

                  <v-select v-model="form.disciplina" :items="disciplinas" item-text="nombre" item-value="idDisciplina"
                    label="Disciplina" required color="green"></v-select>

                  <v-select v-model="form.institucion" :items="instituciones" item-text="nombre"
                    item-value="idInstitucion" label="Institución" required color="green"></v-select>

                  <v-select v-model="form.gradoEstudios" :items="gradosEstudios" item-text="nombre"
                    item-value="idGradoDeEstudios" label="Grado de Estudios" required color="green"></v-select>

                  <v-select v-model="form.genero" :items="generos" item-text="nombre" item-value="idGenero"
                    label="Género" required color="green"></v-select>

                  <v-text-field v-model="form.password" label="Contraseña" type="password" required
                    color="green"></v-text-field>

                  <v-text-field v-model="form.confirmPassword" label="Confirmar contraseña" type="password" required
                    color="green"></v-text-field>

                  <v-file-input v-model="archivos"
                    label="Archivos de máximo 66KB  (Solicitud al PIIM incorporación o renovación (obligatorio), productividad científica, certificados)"
                    accept="application/pdf" multiple @change="actualizarTablaArchivos" :error-messages="fileError"
                    color="green"></v-file-input>

                  <v-data-table :headers="headersArchivos" :items="archivosSeleccionados" hide-default-footer
                    class="elevation-1" v-if="archivosSeleccionados.length > 0">
                    <template slot="item.accion" slot-scope="{  index }">
                      <v-btn small color="error" @click="eliminarArchivo(index)">Eliminar</v-btn>
                    </template>
                    <template v-slot:no-data>
                      No se han seleccionado archivos.
                    </template>
                  </v-data-table>




                </v-form>
              </v-card-text>
            </v-card>
            <div style="width: 100%; justify-content: center; text-align: center;">
              <v-btn class="mt-12 text-h5" color="#062A78" style="color: aliceblue;" @click="sendData"><b>Confirmar</b></v-btn>
            </div>
          </v-container>




        </v-card>


      </v-container>
    </v-main>

    <v-dialog v-model="showErrorDialog" max-width="400">
      <v-card>
        <v-card-title class="error white--text">
          Error
        </v-card-title>
        <v-card-text class="pa-4">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showErrorDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        fechaNacimiento: '',
        pais: null,
        estado: null,
        municipio: null,
        domicilio: '',
        curp: '',
        rfc: '',
        estadoCivil: '',
        disciplina: null,
        institucion: null,
        gradoEstudios: null,
        genero: null,
        password: '',
        confirmPassword: ''
      }, emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
        v => (v && v.length <= 254) || 'El correo no puede exceder 254 caracteres'
      ], curpRules: [
        v => !!v || 'La CURP es requerida',
        v => (v && v.length === 18) || 'La CURP debe tener exactamente 18 caracteres',
      ], rfcRules: [
        v => !!v || 'El RFC es requerido',
        v => (v && v.length === 13) || 'El RFC debe tener exactamente 13 caracteres',
        v => /^[A-ZÑ&]{4}\d{6}[A-ZÑ&]{3}$/.test(v) || 'Formato inválido. Debe ser: AAAA123456BBB'
      ], menu: false,
      confirmAlert: '',
      submitSuccess: '',
      fileError: '',
      archivos: [],
      archivosSeleccionados: [],
      headersArchivos: [
        { text: '#', value: 'index' },
        { text: 'Nombre', value: 'name' },
        { text: 'Tamaño', value: 'size' },
        { text: 'Acción', value: 'accion' }
      ],
      // Data from API
      investigadores: [],
      instituciones: [],
      archivosAPI: [],
      disciplinas: [],
      gradosEstudios: [],
      generos: [],
      estadosPersona: [],
      paises: [],
      estados: [],
      municipios: [],
      estadosFiltrados: [],
      municipiosFiltrados: [],
      specialCharacters: ["#", "$", "%", "&"],
      neededNumbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      estadosCivil: [{ nombre: "Soltero" }, { nombre: "Casado" }, { nombre: "Viudo" }, { nombre: "Divorciado" }]
    }
  },
  async created() {
    await this.loadInitialData();
  },
  methods: {
    descargarPDF(num) {
      console.log(num);
      var pdfPath;
      const link = document.createElement('a');
      switch (num) {
        case 1: pdfPath = '/documentos/Formato-de-solicitud_incorporación_PIIM2025.docx'; link.download = 'Formato-de-solicitud_incorporación_PIIM2025.docx'; break;
        case 2: pdfPath = '/documentos/Convocatoria-PIIM-2025.pdf'; link.download = 'Convocatoria-PIIM-2025.pdf'; break;
        case 3: pdfPath = '/documentos/Formato-de-solicitud_renovación_PIIM2025.docx'; link.download = 'Formato-de-solicitud_renovación_PIIM2025.docx'; break;
      }

      link.href = pdfPath;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    ,
    async loadInitialData() {
      try {
        this.startLoad();

        const responses = await Promise.all([
          fetch("http://localhost:3000/api/investigador/"),
          fetch("http://localhost:3000/api/archivos/"),
          fetch("http://localhost:3000/api/gradodeestudios/"),
          fetch("http://localhost:3000/api/genero/"),
          fetch("http://localhost:3000/api/institucion/"),
          fetch("http://localhost:3000/api/disciplina/"),
          fetch("http://localhost:3000/api/estadopersona/"),
          fetch("http://localhost:3000/api/estado/"),
          fetch("http://localhost:3000/api/pais/"),
          fetch("http://localhost:3000/api/municipio/")
        ]);

        const data = await Promise.all(responses.map(r => r.json()));

        this.investigadores = data[0];
        this.archivosAPI = data[1];
        this.gradosEstudios = data[2];
        this.generos = data[3];
        this.instituciones = data[4];
        this.disciplinas = data[5];
        this.estadosPersona = data[6];
        this.estados = data[7];
        this.paises = data[8];
        this.municipios = data[9];

        this.endLoad();
      } catch (error) {
        console.error("Error:", error);
        this.endLoad();
      }
    },
    cargarEstados() {
      this.estadosFiltrados = this.estados.filter(e => e.Pais_idPais == this.form.pais);
      this.form.estado = null;
      this.form.municipio = null;
    },
    cargarMunicipios() {
      this.municipiosFiltrados = this.municipios.filter(m => m.Estado_idEstado == this.form.estado);
      this.form.municipio = null;
    },
    actualizarTablaArchivos(files) {
      if (!files || files.length === 0) return;

      const nuevosArchivos = Array.from(files);

      nuevosArchivos.forEach(file => {
        if (file.type !== "application/pdf") {
          this.fileError = `"${file.name}" no es un archivo PDF.`;
          return;
        }

        const yaExiste = this.archivosSeleccionados.some(a => a.name === file.name);
        if (yaExiste) {
          this.fileError = `"${file.name}" ya fue agregado.`;
          return;
        }

        if (file.size / 1024 > 65) {
          this.fileError = "El tamaño máximo de un archivo es de 66 KB";
          return;
        }

        this.archivosSeleccionados.push({
          file,
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          index: this.archivosSeleccionados.length + 1
        });
      });

      this.fileError = '';
      this.archivos = [];
    },
    eliminarArchivo(index) {
      this.archivosSeleccionados.splice(index, 1);
      // Update indexes
      this.archivosSeleccionados.forEach((item, i) => {
        item.index = i + 1;
      });
    },
    async sendData() {
      this.confirmAlert = '';
      let haltOperation = false;

      // Validate file sizes
      for (const item of this.archivosSeleccionados) {
        if (item.file.size / 1024 > 65) {
          haltOperation = true;
          this.confirmAlert = 'Uno o más de los archivos que intenta subir excede el tamaño máximo';
          break;
        }
      }

      if (this.archivosSeleccionados.length === 0) {
        this.confirmAlert = 'Por favor, selecciona por lo menos un archivo PDF antes de subir.';
        haltOperation = true;
      }

      // Validate required fields
      const requiredFields = [
        'nombre', 'apellidoPaterno', 'apellidoMaterno', 'correo', 'telefono', 'fechaNacimiento',
        'pais', 'estado', 'municipio', 'domicilio', 'curp', 'rfc', 'estadoCivil',
        'disciplina', 'institucion', 'gradoEstudios', 'genero', 'password', 'confirmPassword'
      ];

      for (const field of requiredFields) {
        if (!this.form[field]) {
          this.confirmAlert = 'Necesita llenar todos los campos para continuar';
          haltOperation = true;
          break;
        }
      }

      // Validate password
      const passwordValid = this.specialCharacters.some(r => this.form.password.includes(r)) &&
        this.neededNumbers.some(r => this.form.password.includes(r)) &&
        this.form.password.length >= 8;

      if (!passwordValid) {
        this.confirmAlert = 'La contraseña debe contener por lo menos un número, un caracter especial (#,$,%,&), y tener por lo menos 8 caracteres';
        haltOperation = true;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.confirmAlert = 'Las contraseñas no coinciden';
        haltOperation = true;
      }

      if (haltOperation) {
        setTimeout(() => {
          this.confirmAlert = '';
        }, 3000);
        return;
      }

      const response = await fetch("http://localhost:3000/api/investigador/correo/" + this.form.correo, {
        method: "GET"
      });
      const data = await response.json();
      if (data.message != "NO") {
        this.confirmAlert = "Correo ya registrado";
        return;
      } else {
        this.confirmAlert = '';
        this.submitSuccess = '';

        try {
          this.startLoad();

          // Get selected options text
          const paisText = this.paises.find(p => p.idPais === this.form.pais)?.nombre || '';
          const estadoText = this.estados.find(e => e.idEstado === this.form.estado)?.nombre || '';
          const municipioText = this.municipios.find(m => m.idMunicipio === this.form.municipio)?.nombre || '';
          this.submitSuccess = '';
          // Register researcher
          const response = await fetch("http://localhost:3000/api/investigador/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nombre: this.form.nombre,
              apellidoPaterno: this.form.apellidoPaterno,
              apellidoMaterno: this.form.apellidoMaterno,
              estadoCivil: this.form.estadoCivil,
              correo: this.form.correo,
              contrasenia: this.form.password,
              telefono: this.form.telefono,
              fechaNacimiento: this.form.fechaNacimiento,
              domicilio: this.form.domicilio,
              curp: this.form.curp,
              rfc: this.form.rfc,
              nacionalidad: paisText,
              estado: estadoText,
              municipio: municipioText,
              Disciplina_idDisciplina: this.form.disciplina,
              Institucion_idInstitucion: this.form.institucion,
              GradoDeEstudios_idGradoDeEstudios: this.form.gradoEstudios,
              Genero_idGenero: this.form.genero
            }),
          });

          const data = await response.json();
          const idInvestigador = data.idInvestigador;

          // Upload files
          await this.uploadFiles(idInvestigador);


          this.submitSuccess = 'Datos registrados con éxito';
          this.$refs.form.reset();
          this.archivosSeleccionados = [];
        } catch (error) {
          console.error("Error:", error);
          this.confirmAlert = 'Ocurrió un error al enviar los datos';
        } finally {
          this.endLoad();
        }
      }
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
    show//alert(text) {
      this.confirmAlert = text;
      setTimeout(() => {
        this.confirmAlert = '';
      }, 3000);
    }
  }
}
</script>
<style scoped>
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