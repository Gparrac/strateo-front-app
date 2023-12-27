<template>
  <v-expand-transition>
    <v-alert
      v-show="alertMessageStore.toggleAlert"
      :type="alertMessageStore.them"
      :icon="alertMessageStore.kind ? 'mdi-check-circle' : 'mdi-block-helper'"
      variant="tonal"
      border="start"
      class="custom-alert">
      <template v-slot:title>
      <p class="text-h6">{{alertMessageStore.message}}</p>
     </template>
      <div class="pt-2">
        <small
          v-for="(error, index) in alertMessageStore.listErrors"
          :key="index"
          class="text-orange"
        >
          {{ index + 1 + ". " + error }} <br />
        </small>
      </div>
    </v-alert>
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
