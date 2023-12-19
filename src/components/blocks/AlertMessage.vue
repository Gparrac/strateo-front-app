<template>
  <v-expand-transition>
    <v-alert
      v-show="alertMessageStore.toggleAlert"
      :type="alertMessageStore.them"
      :icon="alertMessageStore.kind ? 'mdi-check-circle' : 'mdi-block-helper'"
      :text="alertMessageStore.message || 'hola cris'"
      variant="tonal"
      :title="alertMessageStore.kind ? 'Exito' : 'Error'"
      border="start"
      class="custom-alert"
    ></v-alert>
  </v-expand-transition>
</template>
<script>
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

export default {
  data: () => ({}),
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>

<style scoped>
.custom-alert {
  position: fixed;
  right: 20px;
  top: 80px;
  z-index: 1000000;
}
.custom {
  position: absolute;
  height: 100vh;
  width: 100vw;
}
</style>
