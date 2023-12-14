<template>
    <div>
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
    },
    methods: {
      async fetchUser(){
        const respose = await userApi.read();
        if(respose.data) this.records = respose.data;
      }
    },
    async mounted(){
      await this.fetchUser();
    }
}
</script>
