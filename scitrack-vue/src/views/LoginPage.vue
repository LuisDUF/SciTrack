<template>
  <div>
    <h1>Login Page</h1>
    <h2>Ooops! Otra página vacia por el momento, si quieren saber porque existen estas en primer lugar diganme pero pues equis</h2>
    <h3>Para pasar a la pantalla respectiva de Admin, Participante, o Investigador, den click a la que toque</h3>
    <v-row>
        <v-col cols="12">
            <button @click="goToUser">Entrar como Participante</button>
            <button @click="goToAdmin">Entrar como Administrador</button>
            <button @click="goToInvest">Entrar como Investigador</button>
        </v-col>
    </v-row>
    
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  methods: {
    goToAdmin() {
      this.$router.push({ name: "AdminMenu" });
    },
    goToUser() {
      this.$router.push({ name: "UserMenu" });
    },
    goToInvest() {
      this.$router.push({ name: "InvMenu" });
    },
  },
};
</script>

<style scoped>
div {
  text-align: center;
  margin-top: 100px;
}
</style>
