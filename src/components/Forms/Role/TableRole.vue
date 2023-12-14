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
        <template v-slot:[`item.users_count`]="{ item }">
                <div>
                    <v-chip variant="outlined" color="orange">
                      {{item.users_count}}
                    </v-chip>
                </div>
            </template>
            <template v-slot:[`item.permissions_count`]="{ item }">
                <div>
                    <v-chip variant="tonal" color="primary">
                      {{item.permissions_count}}
                    </v-chip>
                </div>

            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <div>
                    <v-icon size="small" class="me-2" @click="() => $router.push(`roles/edit/${item.id}`)">
                        mdi-pencil
                    </v-icon>
                </div>
            </template>

        </v-data-table>
    </div>
</template>

<script>
import RoleApi from '@/services/Forms/RoleApi';
import { castDate } from "@/utils/cast";

const roleApi = new RoleApi();
export default {
    name: 'TableUser',
    data: () => ({
        headers: [
            {
                title: "ID",
                align: "start",
                key: "id",
            },
            { title: "Role", align: "start", key: "name" },
            { title: "Descripción", align: "start", key: "description" },
            { title: "Número de usuarios", align: "center", key: "users_count" },
            { title: "Número de permisos", align: "center", key: "permissions_count" },
            { title: "Ultima actualización", align: "center", key: "updated_at" },
            { title: "Acciones", align: "end", key: "actions" },
        ],
        selectedItems: [],
        records: []
    }),
    components: {
    },
    methods: {
      async fetchUser(){
        const respose = await roleApi.read();
        if(respose.data) this.records = respose.data.map((item) => {
          item.updated_at = castDate(item.updated_at);
          return item;
        });
      }
    },
    async mounted(){
      await this.fetchUser();
    }
}
</script>
