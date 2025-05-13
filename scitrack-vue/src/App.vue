<template>
  <v-app>
    <v-app-bar
      app
      color=#062A78
      dark
    >
      <div class="d-flex justify-center py-2 px-3 my-2 hidden-sm-and-down">

        <v-img
          alt="Vuetify Name"
          class="mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="./assets/SCITRACK-logo-white.png"
          width="100"
        />

      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <SideBarBase/>
    </v-main>
  </v-app>
</template>

<script setup>
import SideBarBase from '@/components/SideBarBase.vue';
</script>
