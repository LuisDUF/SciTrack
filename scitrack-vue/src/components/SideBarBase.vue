<template>
  <v-navigation-drawer color="#2C58B5" dark>
    <div class="d-flex justify-center py-0 px-0 mb-2 hidden-sm-and-down">
      <v-img
        src="../assets/ICTI-logo-white.png"
        alt="ICTI Logo"
        contain
        width="100"
        style="background-color: #18439E;"
      />
    </div>

     <v-list dense>
      <template v-for="(item, idx) in options">
        <v-list-item
          :key="`item-${idx}`"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.message }}</v-list-item-title>
        </v-list-item>
        <v-divider
          v-if="idx < options.length - 1"
          :key="`divider-${idx}`"
        />
      </template>
    </v-list>
   
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const options = ref([
  { message: 'Inicio', id:'btnInicio', icon:'mdi-home' },
  { message: 'Convocatorias', id:'btnInicio', icon:'mdi-file-document-multiple-outline' },
  { message: 'Rúbricas', id:'btnInicio', icon:'mdi-file-sign' },
  { message: 'Proyectos y Usuarios', id:'btnInicio', icon:'mdi-lightbulb-outline' },
  { message: 'Reportes', id:'btnInicio', icon:'mdi-finance' }

])
</script>
