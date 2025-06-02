<template>
    <v-main>
      <div class="d-flex">
        <SideBarBase :options="sideBarSettings" style="min-height: 100vh;" />
        <div class="flex-grow-1" style="background-color: #C4CEF2;">
          <HeaderBase :options="headerSettings" />
          <div id="content" class="py-3 px-3" style="background-color: #C4CEF2; margin: 0; padding: 0;">
            <div class="actual-content px-4 py-4 rounded" style="background-color: #C4CEF2">
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
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
  },
  async created() {
    try{
        const response = await api.get('/api/notificacion/participante/'+this.participante.idParticipante);
    this.Notificaciones.push (...JSON.parse(JSON.stringify(response.data)));
    if(this.Notificaciones.length>=1)
    this.notification = true;

    this.notis = this.Notificaciones;
    }catch{
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

