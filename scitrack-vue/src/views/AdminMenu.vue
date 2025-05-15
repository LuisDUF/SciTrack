<template>
    <v-main>
      <div class="d-flex">
        <SideBarBase :options="sideBarSettings" style="min-height: 100vh;" />
        <div class="flex-grow-1" style="background-color: #C4CEF2;">
          <HeaderBase :options="headerSettings" />
          <div id="content" class="py-3 px-3" style="background-color: #C4CEF2; margin: 0; padding: 0;">
            <div class="actual-content px-4 py-4 rounded" style="background-color: aliceblue;">
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
      headerSettings: {},
      sideBarSettings: [], // Initialized empty; we'll populate it in `created`
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
    
    this.headerSettings = {
      userName: "Renato Medina",
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
      }
    ];
  },
};
</script>

