<template>
  <div>
    <h1>
    Aquí va la landing page, dado que la landing page y el resto de la
    plataforma tiene interfaz diferente, no tiene caso usar la otra.
    En lo que se hace la landing page nadamás denle a este botón
  </h1>
  <button @click="goToLogin">Ir a Login</button>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 100px;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
