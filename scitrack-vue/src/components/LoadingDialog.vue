<template>
  <v-dialog
  style="z-index: 1002;"
    v-model="internalValue"
    max-width="400"
    persistent
    no-click-animation
  >
    <v-card class="text-center pa-5">
      <br />
      <v-progress-circular
        :size="100"
        :width="7"
        color="blue"
        indeterminate
      ></v-progress-circular>
      <br />
      <p class="font-weight-bold text-h4 mt-5">Procesando...</p>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LoadingDialog",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>
