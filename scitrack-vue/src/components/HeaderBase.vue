<template>
  <v-row class="px-6 py-3 position-fixed" style="background-color: aliceblue; min-height: 6%" >
    <v-col cols="10" lg="10" md="10" sm="12"> </v-col>
    <v-col
      cols="2"
      lg="2"
      md="2"
      sm="12"
      class="d-flex justify-end align-center"
    >
     

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" v-if="options.notificationStatus" class="mx-5"
            >mdi-bell-badge</v-icon
          >
          <v-icon v-bind="attrs" v-on="on" v-else class="mx-5">mdi-bell</v-icon>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title v-if="options.notificationStatus"><b>Atención: </b>Tienes nuevas notificaciones, <br>revisa tu correo electrónico</v-list-item-title>
            <v-list-item-title v-else>No hay notificaciones nuevas</v-list-item-title>

          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-icon 
            class="mx-5"
            v-bind="attrs"
            v-on="on"
          >mdi-cog</v-icon>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in userSettings"
            :key="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <h4 class="text-subtitle-1 mx-5">
        <span class="font-weight-bold mx-0 my-0 py-0 px-0">{{
          options.userName
        }}</span
        ><br />{{ options.userRole }}
      </h4>
      <v-img
        src="../assets/default-user-pfp.png"
        alt="User Profile"
        class="rounded-circle"
        max-width="40px"
        max-height="40px"
        cover
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "HeaderBase",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
};
</script>
