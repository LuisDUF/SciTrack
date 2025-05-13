<template>
  <v-app>

    <v-main>
      <!-- Ensure this container fills the full height -->
      <div class="d-flex">
        <!-- Sidebar -->
        <SideBarBase :options="options" style="min-height: 100vh;"/>

        <!-- Right-side Content -->
        <div class="flex-grow-1" style="background-color: #C4CEF2;">
          <HeaderBase style="min-height: 12vh;"/>
          
            <div id="content" class="py-3 px-3 rounded" style="background-color: #C4CEF2; margin: 0; padding: 0;">
              <div class="actual-content p-4" style="background-color: aliceblue;">
                <p>Grok is this true</p>
              </div>
            </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import HeaderBase from '@/components/HeaderBase.vue';
import SideBarBase from '@/components/SideBarBase.vue';




const options = [
  {
    message: 'Inicio', id: 'btnInicio', icon: 'mdi-home', onClick: function clickInicio() {
      console.log('HOLA1');
    }
  },
  {
    message: 'Convocatorias', id: 'btnConvocatorias', icon: 'mdi-file-document-multiple-outline', onClick: function clickConvocatorias() {
      console.log('HOLA2');
    }
  },
  {
    message: 'Rúbricas', id: 'btnRubricas', icon: 'mdi-file-sign', onClick: function clickRubricas() {
      console.log('HOLA3');
    }
  },
  {
    message: 'Proyectos y Usuarios', id: 'btnProyectos', icon: 'mdi-lightbulb-outline', onClick: function clickProyectos() {
      console.log('HOLA4');
    }
  },
  {
    message: 'Reportes', id: 'btnReportes', icon: 'mdi-finance', onClick:

      function clickReportes() {
        console.log('HOLA5');
      }
  }
];
</script>
