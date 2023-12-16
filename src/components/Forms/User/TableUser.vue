<template>
    <div>
      <modal-delete @confirm-delete="deleteItems"></modal-delete>
      <div class="d-flex pb-5">

<h2 class="flex-grow-1">Registros actuales</h2>
<div >
        <v-btn icon="mdi-plus" class="mr-3" color="primary" variant="tonal" @click="() => $router.push(`users/create`)"> </v-btn>
        <v-btn icon="mdi-delete" color="warning" variant="tonal" :disabled="selectedItems.length == 0 ? true : false"> </v-btn>
      </div>
    </div>
        <v-data-table
            :headers="headers"
            :items="records"
            items-per-page="5"
            item-value="id"
            item-selectable="selectable"
            v-model="selectedItems"
            show-select
        >
            <template v-slot:[`item.actions`]="{ item }">
                <div>
                    <v-icon size="small" class="me-2" @click="() => $router.push(`users/edit/${item.id}`)">
                        mdi-pencil
                    </v-icon>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import UserApi from '@/services/Forms/UserApi';
import ModalDelete from '@/components/blocks/ModalDelete.vue';
import { mapStores } from 'pinia';
import { useAlertMessageStore } from '@/store/alertMessage';
const userApi = new UserApi();
export default {
    name: 'TableUser',
    data: () => ({
        headers: [
            {
                title: "ID",
                align: "start",
                key: "id",
            },
            { title: "Nombres", align: "end", key: "third.names" },
            { title: "Apellidos", align: "end", key: "third.surnames" },
            { title: "Email", align: "end", key: "third.email" },
            { title: "Telefono", align: "end", key: "third.mobile" },
            { title: "Role", align: "end", key: "role.name" },
            { title: "Acciones", align: "end", key: "actions" },
        ],
        selectedItems: [],
        records: []
    }),
    components: {
      ModalDelete
    },
    methods: {
      async fetchUser(){
        const respose = await userApi.read();
        if(respose.data) this.records = respose.data;
      },
      async deleteItems(data){
        if(data.confirm && this.selectedItems.length !== 0 ){
          const formData = new FormData();
          formData.append('users_id', this.selectedItems);
          const response = await userApi.delete(formData);
          if(response.data && response.statusResponse == 200){
            await this.fetchUser();
            this.alertMessageStore.show(true,'Usuarios eliminados exitosamente');
          }else{
            this.alertMessageStore.show(false,'Error en el servidor');
          }
        }
      }
    },
    async mounted(){
      await this.fetchUser();
    },
    computed:{
      ...mapStores(useAlertMessageStore),
    }
}
</script>
