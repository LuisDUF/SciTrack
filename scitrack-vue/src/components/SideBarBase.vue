<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    :permanent="true"
    :width="!mini ? (isMobile ? '80%' : 256) : 64"
    app
    color="#2C58B5"
    dark
    class="sidebar"
  >
    <!-- Collapse/Expand Toggle Button -->
    <v-btn
      icon
      @click="toggleMini"
      class="ma-2"
      color="white"
    >
      <v-icon>{{ mini ? 'mdi-menu' : 'mdi-chevron-left' }}</v-icon>
    </v-btn>

    <!-- Images: Only show when NOT collapsed -->
    <div v-if="!mini">
      <div class="d-flex justify-center py-0 px-0 mb-2 hidden-sm-and-down">
        <v-container>
          <v-row>
            <v-col cols="12" style="background-color: #062A78;" class="hidden-xs-only">
              <v-img src="../assets/SCITRACK-logo-white.png"         @click="goToLanding()"
 style="min-height: 5vh;" alt="SCITRACK Logo" contain width="100%" />
            </v-col>
            <v-col cols="12" class="hidden-sm-and-up">
              <v-img src="../assets/SCITRACK-logo-white.png"         @click="goToLanding()"
 style="min-height: 5vh;" alt="SCITRACK Logo" contain width="100%" />
            </v-col>
            <v-col cols="12" style="background-color: #18439E;" class="hidden-xs-only">
              <v-img src="../assets/ICTI-logo-white.png" alt="ICTI Logo" contain width="100%" />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <!-- Sidebar Options -->
    <v-list dense>
      <template v-for="(item, idx) in props.options">
        <v-list-item :key="`item-${idx}`" link @click="item.onClick">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-if="!mini" class="red--white text-subtitle-1">
            {{ item.message }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="idx < props.options.length - 1" :key="`divider-${idx}`" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  }
})

const drawer = ref(true)
const mini = ref(false)
const isMobile = ref(false)

function toggleMini() {
  mini.value = !mini.value
}

function checkScreen() {
  const nowMobile = window.innerWidth <= 960
  if (nowMobile !== isMobile.value) {
    isMobile.value = nowMobile
    mini.value = nowMobile 
  }
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreen)
})

function goToLanding() {
      
    }

</script>

<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>