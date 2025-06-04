<template>
  <v-main>
    <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
    <div class="d-flex">
      <SideBarBase :options="sideBarSettings" style="min-height: 100vh" />
      <div class="flex-grow-1" style="background-color: #c4cef2">
        <HeaderBase :options="headerSettings" />
        <div
          id="content"
          class="py-3 px-3"
          style="background-color: #c4cef2; margin: 0; padding: 0"
        >
          <div
            class="actual-content"
            style="background-color: #C4CEF2"
          >
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </v-main>
</template>

<script>
import HeaderBase from "@/components/HeaderBase.vue";
import SideBarBase from "@/components/SideBarBase.vue";
import api from "@/services/api";


export default {
  name: "App",
  components: {
    HeaderBase,
    SideBarBase,
  },
  data() {
    return {
      headerSettings: {
        userName: "Cargando...", // Valor inicial
        userRole: "Investigador",
        notificationStatus: true,
        notis: []
      },
      sideBarSettings: [], // Menú básico inicial
      loading: false,
      investigador: JSON.parse(localStorage.getItem('userData')) || null,
      Notificaciones: [],
      notification: false
    };
  },async mounted(){

  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }, async created() {
        const response = await api.get('/api/notificacion/investigador/'+this.investigador.idInvestigador);
    this.Notificaciones.push (...JSON.parse(JSON.stringify(response.data)));
    if(this.Notificaciones.filter(s=> s.esLeido!='T').length>=1)
    this.notification = true;

    
    this.notis = this.Notificaciones;
      
      if (!this.investigador) {
        // Redirige si no hay datos
        this.$router.push('/login');
      }
      this.headerSettings = {
        userName: this.investigador?.nombre || "Usuario", // Safe navigation
        userRole: "Investigador",
        notificationStatus: this.notification,
        notis: this.notis
      };
      
      this.sideBarSettings = [
        {
          message: "Inicio",
          id: "btnInicio",
          icon: "mdi-home",
          onClick: () => this.navigateTo("/invmenu"),
        },
        {
          message: "Proyectos",
          id: "btnProyectosInv",
          icon: "mdi-lightbulb-outline",
          onClick: () => this.navigateTo("/invmenu/proyectos"),
        }
      ];
    }
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

