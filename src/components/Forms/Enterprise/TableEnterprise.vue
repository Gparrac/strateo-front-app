<template>
    <div>
        <div class="d-flex pb-5">
            <h2 class="flex-grow-1">Registros actuales</h2>
            <div>
                <v-btn icon="mdi-plus" class="mr-3" color="primary" variant="tonal"
                    @click="routePush('/create')"> </v-btn>
                <v-btn icon="mdi-delete" color="warning" variant="tonal"
                    :disabled="selectedItems.length == 0 ? true : false"> </v-btn>
            </div>
        </div>
        <v-data-table :headers="headers" :items="records" items-per-page="5" item-value="id"
            item-selectable="selectable" v-model="selectedItems" show-select>
            <template v-slot:[`item.actions`]="{ item }">
                <div>
                    <v-icon size="small" class="me-2" @click="routePush(`/edit/${item.id}`)">
                        mdi-pencil
                    </v-icon>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import EnterpriseApi from '@/services/Forms/EnterpriseApi';

const api = new EnterpriseApi();
export default {
    name: 'TableEnterprise',
    data: () => ({
        localPath: 'enterprises',
        headers: [
            {
                title: "ID",
                align: "start",
                key: "id",
            },
            { title: "Identificación", align: "end", key: "identification" },
            { title: "Código de Verificación", align: "end", key: "verification_id" },
            { title: "Nombre de Empresa", align: "end", key: "business_name" },
            { title: "Dirección", align: "end", key: "address" },
            { title: "Acciones", align: "end", key: "actions" },
        ],
        selectedItems: [],
        records: []
    }),
    components: {
    },
    methods: {
        async getDataTable() {
            const response = await api.read();
            if (response.data && response.statusResponse == 200) {
                this.records = response.data.data;
            }
        },
        routePush(route){
            this.$router.push(this.localPath + route);
        }
    },
    async mounted() {
        await this.getDataTable();
    }
}
</script>
