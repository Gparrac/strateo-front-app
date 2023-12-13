<template>
<div>

    <!-- <div class="d-flex justify-end">
      <Transition name="slide-fade">
      <div class="pb-10" v-if="userStore.toggleAlert.modal">
        <v-alert
        class="text-subtitle-1"

        height="70"
        width="400"
        border="start"
  :icon="userStore.toggleAlert.type ? 'success' : 'error'"
  :title="userStore.title"
  :text="userStore.toggleAlert.type ? 'Consesión exitosa!' : 'Error en la creación...'"
  :color="userStore.toggleAlert.type ? 'info' : 'warning'"
  variant="tonal"
></v-alert>

</div>
</Transition>
    </div> -->



  <div class="d-flex pb-5">

  <h1 class="flex-grow-1">Usuarios registrados</h1>
  <div >
          <v-btn icon="mdi-plus" class="mr-3" color="primary" variant="tonal" to="/user-form/"> </v-btn>
          <v-btn icon="mdi-delete" color="warning" variant="tonal" :disabled="userStore.checkSelected" @click="userStore.activeModal('delete',{})"> </v-btn>
        </div>
      </div>
  <table-users ></table-users>
</div>
 </template>

 <script setup>

import TableUsers from '@/components/users/TableUsers.vue';
// import FormModalUsers from '@/components/users/FormModalUsers.vue';
import { useUserStore } from "@/store/users";

const userStore = useUserStore();
 </script>
<style>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(40px);
  opacity: 0;
}
</style>
