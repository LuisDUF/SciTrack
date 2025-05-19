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
            class="actual-content px-4 py-4 rounded"
            style="background-color: aliceblue"
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

import api from '@/services/api';


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
      investigador: null
    };
  },

  async mounted() {
    this.loading = true;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No autenticado');
      
      const response = await api.get('/auth/me');
      this.investigador = response.data;
      
      // Actualiza dinámicamente los settings
      this.updateSettings();
      
    } catch (error) {
      console.error('Error:', error);
      this.$router.push('/login');
    } finally {
      this.loading = false;
    }
  },

  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    
    updateSettings() {
      this.headerSettings = {
        userName: this.investigador?.nombre || "Usuario", // Safe navigation
        userRole: "Investigador",
        notificationStatus: false,
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
  }
};
</script>
