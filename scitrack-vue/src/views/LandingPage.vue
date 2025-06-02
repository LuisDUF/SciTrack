<template>
  <v-app>
    <v-app-bar app color="#062A78" dark>
      <v-row class="px-5">
        <div class="d-flex align-center">
          <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            @click="reloadPage()"
            min-width="200"
            src="../SCITRACK.png"
            width="100"
          />
        </div>

        <v-spacer></v-spacer>

        <v-btn
          @click="goToPublicConvs"
          text
          color="#DFFFFF"
          class="mx-2"
          style="background: linear-gradient(to left, #7b2ff7, #4277ff);"
        >
          <span>Convocatorias</span>
          <v-icon>mdi-school</v-icon>
        </v-btn>

        <v-btn
          @click="goToLogin"
          text
          color="#DFFFFF"
          style="background-color: #4277ff"
          class="mx-2"
        >
          <span>Acceder</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-main>
      <component :is="activeComponent" />
    </v-main>
  </v-app>
</template>

<script>
import HomeLanding from "./HomeLanding.vue";

export default {
  name: "App",
  components: {
    HomeLanding,
  },
  data() {
    return {
      activeComponent: "HomeLanding",
    };
  },
  methods: {
    reloadPage()
    {
      window.location.reload();
    },
    goToLogin() {
      this.$router.push({ name: "Login" });
    },

    async goToPublicConvs() {
      const PublicConvocatorias = (await import("./PublicConvocatorias.vue")).default;
      this.activeComponent = PublicConvocatorias;
    }
  }
};
</script>
