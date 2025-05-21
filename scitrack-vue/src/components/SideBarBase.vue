<template>
  <v-navigation-drawer color="#2C58B5" dark permanent app fixed>
    
    <div class="d-flex justify-center py-0 px-0 mb-2 hidden-sm-and-down">

      <v-container>

        <v-row class="">
          <v-col cols="12" style="background-color: #062A78;" class="hidden-xs-only" >
            <v-img src="../assets/SCITRACK-logo-white.png" style="min-height: 5vh;" alt="SCITRACK Logo" class="" contain width="100%" />
          </v-col>
          <v-col cols="12" style="background-color: #062A78;" class="hidden-sm-and-up" >
            <v-img src="../assets/SCITRACK-icon.png" style="min-height: 5vh;" alt="SCITRACK Icon" class="" contain width="100%" />
          </v-col>
          <v-col cols="12" style="background-color: #18439E;" class="hidden-xs-only">
            <v-img src="../assets/ICTI-logo-white.png" alt="ICTI Logo" contain width="100%" />
          </v-col>

        </v-row>
      </v-container>

    </div>


    <v-list dense>
      <template v-for="(item, idx) in props.options">
        <v-list-item :key="`item-${idx}`" link @click="item.onClick">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="red--white text-subtitle-1">
            {{ item.message }}
          </v-list-item-title>
        </v-list-item>
        <v-divider v-if="idx < props.options.length - 1" :key="`divider-${idx}`" />
      </template>
    </v-list>

  </v-navigation-drawer>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  }
})
</script>
