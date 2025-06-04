<template>
  <v-app>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="headline">Editar Participante</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="formData.nombre" label="Nombre(s)" required></v-text-field>
            <v-text-field v-model="formData.apellidoPaterno" label="Apellido paterno" required></v-text-field>
            <v-text-field v-model="formData.apellidoMaterno" label="Apellido materno" required></v-text-field>

            <v-text-field v-model="formData.correo" label="Correo electrónico" :error-messages="emailError"
              required></v-text-field>

            <v-text-field v-model="formData.contrasenia" label="Contraseña" type="password"
              :error-messages="passwordError" required></v-text-field>
            <v-text-field v-model="formData.confirmPassword" label="Confirmar contraseña" type="password"
              :error-messages="confirmPasswordError" required></v-text-field>

            <v-text-field v-model="formData.telefono" label="Teléfono" type="number"
              :rules="[v => !/e/i.test(v) || 'Número inválido']" required></v-text-field>

            <v-select v-model="formData.genero" :items="generos" item-text="nombre" item-value="idGenero" label="Género"
              required></v-select>

            <v-select v-model="formData.institucion" :items="instituciones" item-text="nombre"
              item-value="idInstitucion" label="Institución" required @change="onInstitutionChange"></v-select>

            <v-select v-if="showDependencies" v-model="formData.dependencia" :items="dependenciasFiltradas"
              item-text="nombre" item-value="idDependencia" label="Dependencia" required></v-select>

            <v-alert v-if="alertText" type="error" class="mt-4">{{ alertText }}</v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="submit">Confirmar</v-btn>
          <v-btn color="grey" text @click="dialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-main class="main-wrapper">
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <div class="d-flex full-height">
        <SideBarBase :options="sideBarSettings" class="sidebar" />
        <div class="flex-grow-1 d-flex flex-column" style="background-color: #C4CEF2;">
          <HeaderBase :options="headerSettings" />
          <div id="content" class="flex-grow-1 py-3 px-3" style="background-color: #C4CEF2;">
            <div class="actual-content full-height" style="background-color: #C4CEF2;">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import HeaderBase from '@/components/HeaderBase.vue'
import SideBarBase from '@/components/SideBarBase.vue'
import api from "@/services/api";

export default {
  name: "App",
  components: {
    HeaderBase,
    SideBarBase,
  },
  data() {
    return {
      dialog: false,
      formData: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        contrasenia: '',
        confirmPassword: '',
        telefono: '',
        genero: null,
        institucion: null,
        dependencia: null,
      },
      alertText: '',
      instituciones: [],
      dependencias: [],
      dependenciasFiltradas: [],
      generos: [],
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      showDependencies: false,
      headerSettings: {
        userName: "Cargando...", // Valor inicial
        userRole: "Participante",
        notificationStatus: false,
        notis: []
      },
      sideBarSettings: [], // Menú básico inicial
      loading: false,
      participante: JSON.parse(localStorage.getItem('userData')) || null,
      Notificaciones: [],
      notification: false
    };
  },
  mounted() {
    //this.fetchInitialData();
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    async fetchInitialData() {
      const pToEdit = JSON.parse(localStorage.getItem("userData")).idParticipante;

      const [instituciones, generos, dependencias, participanteData] = await Promise.all([
        fetch('http://localhost:3000/api/institucion/').then(r => r.json()),
        fetch('http://localhost:3000/api/genero/').then(r => r.json()),
        fetch('http://localhost:3000/api/dependencia/').then(r => r.json()),
        fetch(`http://localhost:3000/api/participante/${pToEdit}`).then(r => r.json()),
      ]);

      this.instituciones = instituciones;
      this.generos = generos;
      this.dependencias = dependencias;

      const participante = participanteData[0];
      this.formData = {
        nombre: participante.nombre,
        apellidoPaterno: participante.apellidoPaterno,
        apellidoMaterno: participante.apellidoMaterno,
        correo: participante.correo,
        contrasenia: participante.contrasenia,
        confirmPassword: participante.contrasenia,
        telefono: participante.telefono,
        genero: participante.Genero_idGenero,
        institucion: null,
        dependencia: participante.Dependencia_idDependencia,
      };

      const foundDep = dependencias.find(d => d.idDependencia === participante.Dependencia_idDependencia);
      this.formData.institucion = foundDep?.Institucion_idInstitucion || null;
      this.onInstitutionChange();
    },
    onInstitutionChange() {
      if (!this.formData.institucion) {
        this.showDependencies = false;
        return;
      }
      this.dependenciasFiltradas = this.dependencias.filter(
        dep => dep.Institucion_idInstitucion === this.formData.institucion
      );
      this.showDependencies = this.dependenciasFiltradas.length > 0;
    },
    validateEmail(email) {
      return email.includes('@') && email.split('@')[1]?.includes('.')
    },
    validatePassword(password) {
      return password.length >= 8 && /[0-9]/.test(password) && /[#$%&@]/.test(password);
    },
    submit() {
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.alertText = '';

      const { nombre, apellidoPaterno, apellidoMaterno, correo, contrasenia, confirmPassword, telefono, genero, institucion, dependencia } = this.formData;

      if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !contrasenia || !confirmPassword || !telefono || !genero || !institucion || (this.showDependencies && !dependencia)) {
        this.alertText = '¡Debe llenar todos los campos correctamente!';
        return;
      }
      if (!this.validateEmail(correo)) {
        this.emailError = '* Ingrese un correo electrónico válido';
        return;
      }
      if (!this.validatePassword(contrasenia)) {
        this.passwordError = '* La contraseña debe tener al menos 8 dígitos, un número y un caracter especial (#, $, %, &, @)';
        return;
      }
      if (contrasenia !== confirmPassword) {
        this.confirmPasswordError = '* Las contraseñas no coinciden';
        return;
      }

      const participante = {
        nombre, apellidoPaterno, apellidoMaterno, correo, contrasenia, telefono,
        Genero_idGenero: genero,
        Dependencia_idDependencia: this.showDependencies ? dependencia : null
      };

      fetch("http://localhost:3000/api/participante/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participante }),
      })
        .then(response => response.json())
        .then(() => {
          //alert('Se han enviado sus datos.');
          location.reload();
        })
        .catch(error => console.error("Error:", error));
    },
  },
  async created() {
    try {
      const response = await api.get('/api/notificacion/participante/' + this.participante.idParticipante);
      this.Notificaciones.push(...JSON.parse(JSON.stringify(response.data)));
      if (this.Notificaciones.filter(s => s.esLeido != 'T').length >= 1)
        this.notification = true;

      this.notis = this.Notificaciones;
    } catch {
      console.log("");
    }

    if (!this.participante) {
      // Redirige si no hay datos
      this.$router.push('/login');
    }
    this.headerSettings = {
      userName: this.participante?.nombre || "Usuario",
      userRole: "Participante",
      notificationStatus: this.notification,
      notis: this.notis
    };
    this.sideBarSettings = [
      {
        message: "Inicio",
        id: "btnInicio",
        icon: "mdi-home",
        onClick: () => {
          this.navigateTo("/usermenu"); // default child
        },
      },
      {
        message: "Proyectos y Equipos",
        id: "btnProyectosEquipos",
        icon: "mdi-lightbulb-outline",
        onClick: () => {
          this.navigateTo("/usermenu/equiposproyectos");
        },
      }
    ];
  },
};
</script>


<style scoped>
.full-height {
  height: 100%;
  min-height: 100vh;
}

.main-wrapper {
  height: 100%;
}

.sidebar {
  min-height: 100vh;
}
</style>

