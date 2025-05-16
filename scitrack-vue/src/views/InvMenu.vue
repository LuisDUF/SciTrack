<template>
  <v-main>
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
      userName: "Alonzo Hdalgo",
      userRole: "Investigador",
      notificationStatus: false,
    };
    this.sideBarSettings = [
      {
        message: "Inicio",
        id: "btnInicio",
        icon: "mdi-home",
        onClick: () => {
          this.navigateTo("/invmenu"); // default child
        },
      },
      {
        message: "Proyectos",
        id: "btnProyectosInv",
        icon: "mdi-lightbulb-outline",
        onClick: () => {
          this.navigateTo("/invmenu/proyectos");
        },
      }
    ];
  },
};
</script>
