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

      <v-main>
        <v-container class="" style="padding-top: 4vw; padding-bottom: 4vw;">
          <v-card class="pa-0" style="width: 100%;">
            <v-row class="pa-0 ma-0" style="width: 100%; ">
              <v-col cols="7" class="pa-0 ma-0" style="background-color: #062A78;">
                <img src="../logins.png" alt="" style="width: 100%; background-size: cover;" class="pa-0 ma-0">
              </v-col> 
              <v-col cols="5" class="ma-0" style="padding: 3vw;">
        <h1 class="text-center" style="color: #0B40B2; font-size: 3vw; margin-top: 3.5vw; margin-bottom: 2vw;">Inicia Sesión</h1>

             <v-btn-toggle v-model="userType" class="pa-0" group style="color: #062A78;  background-color: #C4CEF2; border-radius: 2vw/4vw; border: 0;">
    <v-btn value="1" style="width: 8vw; font-size: 0.9vw;">Participantes</v-btn>
    <v-btn value="2" style="width: 8vw; font-size: 0.9vw;">Jueces</v-btn>
    <v-btn value="3" style="width: 8vw; font-size: 0.9vw;">Administrativo</v-btn>
  </v-btn-toggle>

  <p class="" style="margin-top: 2.6vw; margin-bottom: 0.3vw; color: #062A78; font-weight: bold; font-size: 0.9vw;">Correo electrónico</p>
  <v-text-field
    v-model="email"
    placeholder="correo@email.com"
    class="pa-2"
    style="background-color: #EBEFFF; border-radius: 1vw/2vw; font-size: 0.9vw; width: 100%;"
    :rules="emailRules"
    outlined
    dense
    hide-details="auto"
  ></v-text-field>
  
  <p class="" style="margin-top: 1.5vw; margin-bottom: 0.3vw; color: #062A78; font-weight: bold; font-size: 0.9vw;">Contraseña</p>
  <v-text-field
    v-model="password"
    type="password"
    placeholder="..."
    class="pa-2"
    style="background-color: #EBEFFF; border-radius: 1vw/2vw; font-size: 0.9vw; width: 100%;"
    :rules="passwordRules"
    outlined
    dense
    hide-details="auto"
  ></v-text-field>

  <v-btn 
    @click="iniciaSesion" 
    style="margin: 0; margin-top: 1.5vw; width: 100%; font-size: 0.9vw; color: aliceblue; background-color: #062A78;"
    :loading="loading"
  >
    Iniciar Sesión
  </v-btn>
            <v-btn @click="registro" v-if="showLoginButton" class="" style="margin: 0; margin-top: 2vw; width: 100%; font-size: 0.9vw; color: aliceblue; background-color: #062A78;">  {{ loginButtonText }}</v-btn>

              </v-col>
            </v-row>

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
  import api from '@/services/api'; 


export default {

  name: "LoginPage",
  data() {
    return {
      userType: '1',
      email: '',
      password: '',
      loading: false,
      emailRules: [
        v => !!v || 'El correo es requerido',
        v => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 6) || 'Mínimo 6 caracteres'
      ],
    showErrorDialog: false,
    errorMessage: ''
    }
  },computed: {
  loginButtonText() {
    switch(this.userType) {
      case '1': return 'Registro';
      case '2': return 'Postularse al PIIM';
      case '3': return '';
      default: return 'Iniciar Sesión';
    }
  },  showLoginButton() {
    return this.userType !== '3'; // Mostrar solo si NO es admin (case 3)
  }
},
  methods: {
    showError(message) {
    this.errorMessage = message;
    this.showErrorDialog = true;
  },
    async iniciaSesion() {
      if (!this.email || !this.password) {
        this.showError('Por favor complete todos los campos');
        return;
      }

      this.loading = true;
      
      try {
          const response = await api.post('/auth/login', {
            email: this.email,
            password: this.password,
            userType: this.userType
        });

     
        // Guardar token y redirigir
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
          
          // Redirección según tipo de usuario
          switch(this.userType) {
            case '1':
              this.$router.push({ name: 'UserMenu' });
              break;
            case '2':
              this.$router.push({ name: 'InvMenu' });
              break;
            case '3':
              this.$router.push({ name: 'AdminMenu' });
              break;
            default:
              this.$router.push('/');
          }
      

      } catch (error) {
        this.loading = false;
        this.showError('Credenciales incorrectas');
        console.error('Error en login:', error);
      }
    },
    
    goToAdmin() {
      this.$router.push({ name: "AdminMenu" });
    },
    goToUser() {
      this.$router.push({ name: "UserMenu" });
    },
    goToInvest() {
      this.$router.push({ name: "InvMenu" });
    },registro(){
            switch(this.userType) {
            case '1':
              this.$router.push({ name: 'RegisterParticipante' });
              break;
            case '2':
              this.$router.push({ name: 'RegisterInv' });
              break;
            default:
              this.$router.push('/');
          }
    }
  }
};

</script>

<style scoped>


      .hero {
        background: url('../pdro.png');
        background-size: cover;
        height: 73.5vh;
        width: 100vw;
      }
      .hammersmith-one-regular {
      font-family: "Hammersmith One", sans-serif;
      font-weight: 400;
      font-style: normal;
    }

</style>
