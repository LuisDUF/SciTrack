<template>
  <v-app style="background-color: rgba(14, 73, 201, 0.24)">
    <v-app-bar app color="#062A78" dark>
      <v-img
        alt="Vuetify Name"
        class="shrink mt-1 hidden-sm-and-down"
        contain
        @click="goToLanding()"
        min-width="200"
        src="../SCITRACK.png"
        width="100"
      />
    </v-app-bar>

    <v-main>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center"
  >
    <v-card style="width: 100%; max-width: 90vw; border-radius: 6px; overflow: hidden;">
      <v-row class="pa-0 ma-0" style="width: 100%">
        <v-col
          cols="12"
          md="7"
          class="pa-0 ma-0 d-none d-lg-flex"
          style="position: relative; background-color: #062a78"
        >
          <img
            src="../logins.png"
            alt=""
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
            "
          />
        </v-col>
        <v-col cols="12" lg="5" class="pa-4 pa-lg-8">
              <h1 class="text-center mt-5" style="color: #0b40b2">Inicia Sesión</h1>

              <v-btn-toggle
                v-model="userType"
                class="my-6 custom-toggle full-width-toggle"
                group
              >
                <v-btn value="1" class="toggle-btn flex-btn"
                  >Participantes</v-btn
                >
                <v-btn value="2" class="toggle-btn flex-btn">Jueces</v-btn>
                <v-btn value="3" class="toggle-btn flex-btn"
                  >Administrativo</v-btn
                >
              </v-btn-toggle>

              <p class="mt-12" style="color: #062a78; font-weight: bold">
                Correo electrónico
              </p>
              <v-text-field
                v-model="email"
                placeholder="correo@email.com"
                class="pa-3 mt-4"
                style="
                  background-color: #ebefff;
                  border-radius: 6px;
                  width: 100%;
                "
                :rules="emailRules"
                dense
                hide-details="auto"
              ></v-text-field>

              <p class="mt-12" style="color: #062a78; font-weight: bold">
                Contraseña
              </p>
              <v-text-field
                v-model="password"
                type="password"
                placeholder="..."
                class="pa-3 mt-4"
                style="
                  background-color: #ebefff;
                  border-radius: 6px;
                  width: 100%;
                "
                :rules="passwordRules"
                dense
                hide-details="auto"
              ></v-text-field>

              <v-btn
                @click="iniciaSesion"
                class="mt-10"
                style="width: 100%; color: aliceblue; background-color: #062a78"
                :loading="loading"
              >
                Iniciar Sesión
              </v-btn>
              <v-btn
                @click="registro"
                v-if="showLoginButton"
                class="mt-10"
                style="width: 100%; color: aliceblue; background-color: #062a78"
              >
                {{ loginButtonText }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>

    <v-dialog v-model="showErrorDialog" max-width="400">
      <v-card>
        <v-card-title class="error white--text"> Error </v-card-title>
        <v-card-text class="pa-4">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showErrorDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import api from "@/services/api";

export default {
  name: "LoginPage",
  data() {
    return {
      userType: "1",
      email: "",
      password: "",
      loading: false,
      emailRules: [
        (v) => !!v || "El correo es requerido",
        (v) => /.+@.+\..+/.test(v) || "El correo debe ser válido",
      ],
      passwordRules: [
        (v) => !!v || "La contraseña es requerida",
        (v) => (v && v.length >= 6) || "Mínimo 6 caracteres",
      ],
      showErrorDialog: false,
      errorMessage: "",
    };
  },
  computed: {
    loginButtonText() {
      switch (this.userType) {
        case "1":
          return "Registro";
        case "2":
          return "Postularse al PIIM";
        case "3":
          return "";
        default:
          return "Iniciar Sesión";
      }
    },
    showLoginButton() {
      return this.userType !== "3"; // Mostrar solo si NO es admin (case 3)
    },
  },
  methods: {
    showError(message) {
      this.errorMessage = message;
      this.showErrorDialog = true;
    },
    async iniciaSesion() {
      if (!this.email || !this.password) {
        this.showError("Por favor complete todos los campos");
        return;
      }

      this.loading = true;

      try {
        const response = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
          userType: this.userType,
        });

        // Guardar token y redirigir
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Redirección según tipo de usuario
        switch (this.userType) {
          case "1":
            this.$router.push({ name: "UserMenu" });
            break;
          case "2":
            this.$router.push({ name: "InvMenu" });
            break;
          case "3":
            this.$router.push({ name: "AdminMenu" });
            break;
          default:
            this.$router.push("/");
        }
      } catch (error) {
        this.loading = false;
        this.showError("Credenciales incorrectas");
        console.error("Error en login:", error);
      }
    },

    goToAdmin() {
      this.$router.push({ name: "AdminMenu" });
    },
    goToUser() {
      this.$router.push({ name: "UserMenu" });
    },
    goToInvest() {
      this.$router.push({ name: "InvMenu" });
    },
    goToLanding() {
      this.$router.push({ name: "Landing" });
    },
    registro() {
      switch (this.userType) {
        case "1":
          this.$router.push({ name: "RegisterPart" });
          break;
        case "2":
          this.$router.push({ name: "RegisterInv" });
          break;
        default:
          this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.hero {
  background: url("../pdro.png");
  background-size: cover;
  height: 73.5vh;
  width: 100vh;
}
.hammersmith-one-regular {
  font-family: "Hammersmith One", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.custom-toggle {
  background-color: #c4cef2;
  border-radius: 6px;
}

.toggle-btn {
  color: #062a78;
}

.toggle-btn.v-btn--active {
  background-color: #062a78 !important;
  border-radius: 6px;
  color: white !important;
}

.full-width-toggle {
  width: 100%;
  display: flex;
}

.flex-btn {
  flex: 1;
  justify-content: center;
}
</style>
