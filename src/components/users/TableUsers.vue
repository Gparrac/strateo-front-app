<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      items-per-page="5"
      item-value="id"
      item-selectable="selectable"
      v-model="selectedItems"
      show-select
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            size="small"
            class="me-2"
            @click="editItem(item)"
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
import { useModalStore } from "@/store/users";

const modalStore = useModalStore();
let headers = [
  {
    title: "ID",
    align: "start",
    key: "id",
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
function editItem(item) {
  const temp = Object.assign({},{
        userId: item.id,
        name:item.name,
        typeDocument:item.typeDocument,
        identification:item.third.identification,
        names:item.third.names,
        surnames:item.third.surnames,
        address:item.third.address,
        mobile:item.third.mobile,
        email:item.third.email,
        city:item.third.city,
        status:item.status,
        role:item.role
      });

  modalStore.activeModal('update',temp);
}
watch(selectedItems,(newV)=>{
  modalStore.setSelected(newV);

})
onMounted(async () => {
  users.value = await getUsers();
  console.log('users',users.value)

});
</script>
