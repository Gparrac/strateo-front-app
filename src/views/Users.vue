<template>
<div>


  <div class="d-flex pb-5">

  <h1 class="flex-grow-1">Hello Users! {{ modalStore.checkSelected }}</h1>
  <div >
          <v-btn icon="mdi-plus" class="mr-3" color="primary" variant="tonal" @click="modalStore.activeModal('create')"> </v-btn>
          <v-btn icon="mdi-delete" color="warning" variant="tonal" :disabled="modalStore.checkSelected" @click="modalStore.activeModal('delete',{})"> </v-btn>
        </div>
      </div>
  <table-users ></table-users>
  <form-modal-users ></form-modal-users>
</div>
 </template>

 <script setup>

import TableUsers from '../components/users/TableUsers.vue';
import FormModalUsers from '../components/users/FormModalUsers.vue';
import { useModalStore } from "@/store/users";

const modalStore = useModalStore();

 </script>
