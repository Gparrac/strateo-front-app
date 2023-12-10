<template>
<div>


  <div class="d-flex pb-5">

  <h1 class="flex-grow-1">Hello Users!</h1>
  <div >
          <v-btn icon="mdi-plus" class="mr-3" color="primary" variant="tonal" :active="activeDelete"> </v-btn>
          <v-btn icon="mdi-delete" color="primary" variant="tonal"> </v-btn>
        </div>
      </div>
  <table-users @toggle-form="activeForm" @show-delete="showDelte"></table-users>
  <form-modal-users :modal="modal" :item="editItem" :kindModal="kindModal" @hidden-form="hiddenForm"></form-modal-users>
</div>
 </template>

 <script setup>
 import { computed, ref } from 'vue';
import TableUsers from '../components/users/TableUsers.vue';
import FormModalUsers from '../components/users/FormModalUsers.vue';
 let modal = ref(false);
 let editItem = ref({});
 let kindModal = ref('');
 let selectedItems = ref([]);
 let activeDelete = computed(() => selectedItems.value.length > 0 ? false : true);
 function activeForm(data){
  modal.value = true;
  kindModal.value = data.kindModal;
  editItem.value = {
    name:data.item.name,
    typeDocument:data.item.typeDocument,
    identification:data.item.third.identification,
    names:data.item.third.names,
    surnames:data.item.third.surnames,
    address:data.item.third.address,
    mobile:data.item.third.mobile,
    email:data.item.third.email,
    city:data.item.third.city,
    status:data.item.status,
    role:data.item.role
  };
  console.log('active',editItem.value)
 }
 function showDelte(data){
  selectedItems.value = data.selectedItems
 }
 function hiddenForm(){
  modal.value = false;
  editItem.value = {};
  kindModal.value = '';
 }
 </script>
