<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      items-per-page="5"
      item-value="name"
      item-selectable="selectable"
      v-mode="SelectedItems"
      show-select
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            size="small"
            class="me-2"
            @click="$emit('toggleForm', {item:item,kindModal:'edit'})"
          >
            mdi-pencil
          </v-icon>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { getUsers } from "@/services/userService";

const emit = defineEmits(['inFocus', 'submit'])

let headers = [
  {
    title: "ID",
    align: "start",
    key: "name",
  },
  { title: "Nombres", align: "end", key: "third.names" },
  { title: "Apellidos", align: "end", key: "third.surnames" },
  { title: "Email", align: "end", key: "third.email" },
  { title: "Telefono", align: "end", key: "third.mobile" },
  { title: "Role", align: "end", key: "role_id" },
  { title: "Acciones", align: "end", key: "actions" },
];
let users = ref([]);
let selectedItems = ref([]);
watch(selectedItems,(newV)=>{
  console.log(newV)
  emit('show-delete',{selectedItems:newV});
})
onMounted(async () => {
  users.value = await getUsers();

});
</script>
