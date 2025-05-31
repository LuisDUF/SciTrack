<template>
    <v-main>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <div class="d-flex">
        <SideBarBase :options="sideBarSettings" style="min-height: 100vh;" />
        <div class="flex-grow-1" style="background-color: #C4CEF2;">
          <HeaderBase :options="headerSettings" />
          <div id="content" class="py-3 px-3" style="background-color: #C4CEF2; margin: 0; padding: 0;">
            <div class="actual-content " style="background-color: #C4CEF2;">
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </v-main>
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
      }
    ];
  },
};
</script>

