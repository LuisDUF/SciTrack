<template>
  <v-app>
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
        notificationStatus: false,
      },
      sideBarSettings: [], // Menú básico inicial
      loading: false,
      administrador: JSON.parse(localStorage.getItem('userData')) || null
    };
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
  },
  created() {
          if (!this.administrador) {
        // Redirige si no hay datos
        this.$router.push('/login');
      }
    
    this.headerSettings = {
      userName: this.administrador?.nombre || "Usuario",
      userRole: "Administrador",
      notificationStatus: false,
    };

    this.sideBarSettings = [
      {
        message: "Inicio",
        id: "btnInicio",
        icon: "mdi-home",
        onClick: () => {
          this.navigateTo("/adminmenu"); // default child
        },
      },
      {
        message: "Convocatorias",
        id: "btnConvocatorias",
        icon: "mdi-file-document-multiple-outline",
        onClick: () => {
          this.navigateTo("/adminmenu/convocatorias");
        },
      },
      {
        message: "Aministradores",
        id: "btnAdministradores",
        icon: "mdi-account-plus-outline",
        onClick: () => {
          this.navigateTo("/adminmenu/registerAdmin");
        },
      },
      {
        message: "Rúbricas",
        id: "btnRubricas",
        icon: "mdi-file-sign",
        onClick: () => {
          this.navigateTo("/adminmenu/rubricas");
        },
      },
      {
        message: "Proyectos y Usuarios",
        id: "btnProyectos",
        icon: "mdi-lightbulb-outline",
        onClick: () => {
          this.navigateTo("/adminmenu/proyectosyusuarios");
        },
      },
      {
        message: "Reportes",
        id: "btnReportes",
        icon: "mdi-finance",
        onClick: () => {
          this.navigateTo("/adminmenu/reportes");
        },
      },
      {
        message: "PIIM",
        id: "btnPadron",
        icon: "mdi-brain",
        onClick: () => {
          this.navigateTo("/adminmenu/listaInvestigadores");
        },
      },{
        message: "Constancias",
        id: "btnConstancias",
        icon: "mdi-account-file-outline ",
        onClick:()=>{
          this.navigateTo("/adminmenu/constancias");
        }
      },{
        message: "Alertas",
        id: "btnAlertas",
        icon: "mdi-bell-outline",
        onClick:()=>{
          this.navigateTo("/adminmenu/alertas");
        }

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

