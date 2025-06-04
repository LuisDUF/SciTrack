<template>
  <v-dialog v-model="internalValue" max-width="600">
    <v-card>
      <v-card-title class="headline">
        Subir documento
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          Por favor suba un documento de identificación oficial
          (credencial de institución, INE, pasaporte, etc).
        </p>

        <v-file-input
          v-model="file"
          accept=".pdf"
          :rules="[fileRule]"
          show-size
          truncate-length="25"
          label="Seleccionar archivo PDF"
          outlined
          dense
          class="mt-2"
        >
        </v-file-input>

        <v-alert v-if="fileError" type="error" dense class="mt-2">
          {{ fileError }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red" @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="submit">Subir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UploadDocumentDialog",
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      file: null,
      fileError: ""
    };
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    fileRule() {
      return () => {
        if (!this.file) return true;
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (this.file.size > maxSize) {
          this.fileError = "El archivo no debe superar los 10 MB.";
          return false;
        }
        this.fileError = "";
        return true;
      };
    }
  },
  methods: {
    close() {
      this.file = null;
      this.fileError = "";
      this.$emit("input", false);
    },
    submit() {
      this.$emit("submit", this.file);
      this.close();
    }
  }
};
</script>

<style scoped>
.v-file-input .v-input__control {
  font-size: 18px;
}
.v-icon.mdi-file-pdf {
  color: red;
  font-size: 36px;
}
</style>
