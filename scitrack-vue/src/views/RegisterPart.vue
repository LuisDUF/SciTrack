<template>
  <v-app style="background-color: rgba(14, 73, 201, 0.24);">
      <v-app-bar
      app
      color=#062A78
      dark
      >
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="200"
          src="../SCITRACK.png"
          width="100"
        />
      </v-app-bar>



      <v-main >

        <v-container class="" style="color: #062A78; margin-top: 3vw; padding-top: 0vw; padding-bottom: 4vw;  ">
          <h1 class="text-h4 text-center" style="font-weight: bolder; margin-bottom: 2vw;" >Registro de Participante</h1>
          <v-card class="mx-auto" max-width="600">
          
          
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="participant.nombre"
                label="Nombre(s)"
                placeholder="Ingrese su nombre o nombres..."
                required
              ></v-text-field>

              <v-text-field
                v-model="participant.apellidoPaterno"
                label="Apellido paterno"
                placeholder="Ingrese su apellido paterno..."
                required
              ></v-text-field>

              <v-text-field
                v-model="participant.apellidoMaterno"
                label="Apellido materno"
                placeholder="Ingrese su apellido materno..."
                required
              ></v-text-field>

              <v-text-field
                v-model="participant.correo"
                label="Correo electrónico"
                placeholder="Ingrese su correo..."
                :error-messages="emailErrors"
                @input="validateEmail"
                required
              ></v-text-field>

              <v-text-field
                v-model="participant.contrasenia"
                label="Contraseña"
                placeholder="..."
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :error-messages="passwordErrors"
                @input="validatePassword"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirmar contraseña"
                placeholder="..."
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :error-messages="confirmPasswordErrors"
                @input="validateConfirmPassword"
                required
              ></v-text-field>

              <v-text-field
                v-model="participant.telefono"
                label="Teléfono"
                placeholder="..."
                type="number"
                onkeydown="return event.keyCode !== 69"
                required
              ></v-text-field>

              <v-select
                v-model="participant.Genero_idGenero"
                :items="genders"
                item-text="nombre"
                item-value="idGenero"
                label="Género"
                required
                :rules="[v => !!v || 'Debe seleccionar un género']"
              ></v-select>

              <v-select
                v-model="participant.Institucion_idInstitucion"
                :items="institutions"
                item-text="nombre"
                item-value="idInstitucion"
                label="Institución"
                required
                :rules="[v => !!v || 'Debe seleccionar una institución']"
                @change="loadDependencies"
              ></v-select>

              <v-select
                v-model="participant.Dependencia_idDependencia"
                :items="filteredDependencies"
                item-text="nombre"
                item-value="idDependencia"
                label="Dependencia"
                v-if="showDependencySelect"
                required
                :rules="[v => !!v || 'Debe seleccionar una dependencia']"
              ></v-select>

              <v-alert
                v-if="submitError"
                type="error"
                dense
                class="mb-4 mt-3"
              >
              
                {{ submitError }}
                <br>
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
                color="#062A78"
                style="color: aliceblue;"
                block
                @click="submitForm"
                :loading="loading"
              >
                Confirmar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
            
        
      </v-container>
      </v-main>


  </v-app>
</template>

<script>
const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = ['0','1','2','3','4','5','6','7','8','9'];

export default {
  name: 'App',
  data: () => ({
    participant: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      correo: '',
      contrasenia: '',
      telefono: '',
      Genero_idGenero: null,
      Institucion_idInstitucion: null,
      Dependencia_idDependencia: null,
    },
    confirmPassword: '',
    institutions: [],
    genders: [],
    dependencies: [],
    filteredDependencies: [],
    showDependencySelect: false,
    showPassword: false,
    showConfirmPassword: false,
    emailErrors: [],
    passwordErrors: [],
    confirmPasswordErrors: [],
    submitError: '',
    submitSuccess: '',
    loading: false,
  }),
  mounted() {
    this.fetchInstitutions();
    this.fetchGenders();
    this.fetchDependencies();
  },
  methods: {
    async fetchInstitutions() {
      try {
        const response = await fetch("http://localhost:3000/api/institucion/");
        this.institutions = await response.json();
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    },
    async fetchGenders() {
      try {
        const response = await fetch("http://localhost:3000/api/genero/");
        this.genders = await response.json();
      } catch (error) {
        console.error("Error fetching genders:", error);
      }
    },
    async fetchDependencies() {
      try {
        const response = await fetch("http://localhost:3000/api/dependencia/");
        this.dependencies = await response.json();
      } catch (error) {
        console.error("Error fetching dependencies:", error);
      }
    },
    loadDependencies() {
      const selectedInstitution = this.participant.Institucion_idInstitucion;
      this.filteredDependencies = this.dependencies.filter(
        dep => dep.Institucion_idInstitucion == selectedInstitution
      );
      this.showDependencySelect = this.filteredDependencies.length > 0;
      if (!this.showDependencySelect) {
        this.participant.Dependencia_idDependencia = null;
      }
    },
    async validateEmail() {
      if (!this.participant.correo.includes("@") || !this.participant.correo.split('@')[1].includes('.')) {
        this.emailErrors = ["Ingrese un correo electrónico válido"];
        return false;
      } else{
        this.emailErrors = [];
        return true;
      }
    },
    validatePassword() {
      let errors = [];
      
      if (this.participant.contrasenia.length < 8) {
        errors.push("La contraseña debe tener al menos 8 dígitos");
      }
      
      if (!this.includesFromArray(this.participant.contrasenia, NUMBERS_PASSWORD) || 
          !this.includesFromArray(this.participant.contrasenia, SPECIAL_CHARACTERS)) {
        errors.push("La contraseña debe tener al menos un caracter especial (#,$,%,&,@) y un número (0-9)");
      }
      
      this.passwordErrors = errors;
      this.validateConfirmPassword();
      return errors.length === 0;
    },
    validateConfirmPassword() {
      if (this.confirmPassword !== this.participant.contrasenia) {
        this.confirmPasswordErrors = ["Las contraseñas no coinciden"];
        return false;
      } else {
        this.confirmPasswordErrors = [];
        return true;
      }
    },
    includesFromArray(stringToSearch, array) {
      return array.some(e => stringToSearch.includes(e));
    },
    async submitForm() {
      this.submitSuccess = '';
      this.submitError = '';
     
      // Validate form
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      const isConfirmPasswordValid = this.validateConfirmPassword();
     
      if (!this.$refs.form.validate() || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        this.submitError = "Por favor complete todos los campos correctamente";
        return;
      }
      
      if (this.showDependencySelect && !this.participant.Dependencia_idDependencia) {
        this.submitError = "Debe seleccionar una dependencia";
        return;
      }
    
      const response = await fetch("http://localhost:3000/api/participante/correo/"+this.participant.correo,{
          method: "GET"
        });
        const data = await response.json();
        if(data.message!="NO"){
          this.emailErrors = ["Correo ya registrado"];
          this.submitError = "Correo ya registrado";
          return;
        }else{
      this.emailErrors = [];
      this.submitError = '';
        
      
      this.loading = true;
      
      try {
        const response = await fetch("http://localhost:3000/api/participante/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.participant),
        });
      
        await response.json();

        if(response.ok)
        this.submitSuccess = 'Registro exitoso';
        this.$refs.form.reset();
        this.confirmPassword = '';
        this.showDependencySelect = false;
      } catch (error) {
        console.error("Error:", error);
        this.submitError = "Ocurrió un error al enviar los datos. Por favor intente nuevamente.";
      } finally {
        this.loading = false;
      }
    }
    },
  },
};
</script>

<style>
/* You can add custom styles here if needed */
</style>
