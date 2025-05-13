<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar flat color="white" elevation="1">
      <v-spacer />
      <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
      <v-btn icon><v-icon>mdi-cog</v-icon></v-btn>
      <v-divider vertical class="mx-2" />
      <v-list-item
        title="Howard Hamlin"
        subtitle="Administrador"
        class="px-2"
      />
    </v-app-bar>

    <!-- Main Layout -->
    <v-main>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <!-- Sidebar -->
          <v-col cols="2" class="blue-darken-3 text-white" style="height: 100vh;">
            <v-container>
              <h2 class="font-weight-bold white--text">SCITRACK</h2>
              <p class="text-caption">Instituto de Ciencia, Tecnología e Innovación</p>
              <v-divider class="my-3" />

              <v-list dense nav>
                <v-list-item prepend-icon="mdi-home" title="Inicio" />
                <v-list-item prepend-icon="mdi-file-document" title="Convocatorias" />
                <v-list-item prepend-icon="mdi-format-list-checks" title="Rúbricas" />
                <v-list-item prepend-icon="mdi-account-group" title="Proyectos y Usuarios" />
                <v-list-item prepend-icon="mdi-chart-bar" title="Reportes" />
              </v-list>
            </v-container>
          </v-col>

          <!-- Dashboard Content -->
          <v-col cols="10" class="pa-4">
            <h2 class="text-h5 mb-4">¡Bienvenid@!<br /><strong>Howard Hamlin</strong></h2>

            <v-row>
              <!-- Cards -->
              <v-col cols="3" v-for="item in dashboardItems" :key="item.title">
                <v-card color="#e3edff" rounded="lg" class="pa-4">
                  <div class="font-weight-bold mb-2">{{ item.title }}</div>
                  <div v-for="(value, label) in item.data" :key="label">{{ label }}: {{ value }}</div>
                  <v-btn color="primary" class="mt-3" block>Revisar</v-btn>
                </v-card>
              </v-col>

              <!-- Filter -->
              <v-col cols="3">
                <v-card color="#e3edff" rounded="lg" class="pa-4">
                  <div class="font-weight-bold mb-2">Filtrar por convocatoria:</div>
                  <v-checkbox
                    v-for="conv in convocatorias"
                    :key="conv.name"
                    v-model="conv.checked"
                    :label="conv.name"
                    hide-details
                    density="compact"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

const dashboardItems = ref([
  {
    title: 'Equipos',
    data: { Inscritos: 30, Aprobados: 25, Pendientes: 5 },
  },
  {
    title: 'Proyectos',
    data: { Inscritos: 30, Aprobados: 25, Pendientes: 5 },
  },
  {
    title: 'Participantes',
    data: { Inscritos: 132, Aprobados: 84, Pendientes: 48 },
  },
  {
    title: 'Investigadores',
    data: { Inscritos: 25, Aprobados: 22, Pendientes: 3 },
  },
]);

const convocatorias = ref([
  { name: 'InovaTEC', checked: true },
  { name: 'PLEXO', checked: false },
]);
</script>

<style scoped>
.v-application {
  background-color: #f0f4ff;
}
</style>
