<template>
  
      <v-container>
        <v-card class="mx-auto" max-width="600">
          <v-card-title class="text-h4 text-center">Registro de Administradores</v-card-title>
              <v-alert
                v-if="confirmAlert"
                type="success"
                dismissible
              >
                {{ confirmAlert }}
              </v-alert>



          <v-card-text>
            <v-form ref="form" @submit.prevent="submitForm">
              <v-text-field
                v-model="administrador.nombre"
                label="Nombre(s)"
                placeholder="Ingrese su nombre..."
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="administrador.apellidoPaterno"
                label="Apellido paterno"
                placeholder="Ingrese su apellido paterno..."
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="administrador.apellidoMaterno"
                label="Apellido materno"
                placeholder="Ingrese su apellido materno..."
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="administrador.correo"
                label="Correo electrónico"
                placeholder="Ingrese su correo..."
                :error-messages="emailErrors"
                @input="validateEmail"
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

              <v-text-field
                v-model="administrador.contrasenia"
                label="Contraseña"
                placeholder="..."
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :error-messages="passwordErrors"
                @input="validatePassword"
                :rules="[v => !!v || 'Este campo es requerido']"
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
                :rules="[v => !!v || 'Este campo es requerido']"
                required
              ></v-text-field>

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
const SPECIAL_CHARACTERS = ["#","$","%","&","@"];
const NUMBERS_PASSWORD = ['0','1','2','3','4','5','6','7','8','9'];

export default {
  name: 'App',
  data: () => ({
    administrador: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      correo: '',
      contrasenia: '',
    },
    confirmAlert: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    emailErrors: [],
    passwordErrors: [],
    confirmPasswordErrors: [],
    submitError: '',
    submitSuccess: '',
    loading: false,
  }),
  methods: {
    validateEmail() {
      if (!this.administrador.correo.includes("@") || !this.administrador.correo.split('@')[1].includes('.')) {
        this.emailErrors = ["Ingrese un correo electrónico válido"];
        return false;
      } else {
        this.emailErrors = [];
        return true;
      }
    },
    validatePassword() {
      let errors = [];
      
      if (this.administrador.contrasenia.length < 8) {
        errors.push("La contraseña debe tener al menos 8 dígitos");
      }
      
      if (!this.includesFromArray(this.administrador.contrasenia, NUMBERS_PASSWORD) || 
          !this.includesFromArray(this.administrador.contrasenia, SPECIAL_CHARACTERS)) {
        errors.push("La contraseña debe tener al menos un caracter especial (#,$,%,&,@) y un número (0-9)");
      }
      
      this.passwordErrors = errors;
      this.validateConfirmPassword();
      return errors.length === 0;
    },
    validateConfirmPassword() {
      if (this.confirmPassword !== this.administrador.contrasenia) {
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
      this.submitError = '';
      this.submitSuccess = '';
      
      // Validate form
      const isFormValid = this.$refs.form.validate();
      const isEmailValid = this.validateEmail();
      const isPasswordValid = this.validatePassword();
      const isConfirmPasswordValid = this.validateConfirmPassword();
      
      if (!isFormValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        this.submitError = "Por favor complete todos los campos correctamente";
        return;
      }

            const response = await fetch("http://localhost:3000/api/administrador/correo/"+this.administrador.correo,{
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
        const response = await fetch("http://localhost:3000/api/administrador/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.administrador),
        });
        
        await response.json();
        if(response.ok)
        this.submitSuccess = 'Registro exitoso';

        this.$refs.form.reset();
        this.confirmPassword = '';
        this.confirmAlert = '';
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