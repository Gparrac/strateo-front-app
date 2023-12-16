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
import EnterpriseApi from '@/services/Forms/EnterpriseApi';

const enterpriseApi = new EnterpriseApi();
export default {
    name: 'TableEnterprise',
    data: () => ({
        headers: [
            {
                title: "ID",
                align: "start",
                key: "id",
            },
            { title: "Identificación", align: "end", key: "third.identification" },
            { title: "Código de Verificación", align: "end", key: "third.verification_id" },
            { title: "Nombre de Empresa", align: "end", key: "third.business_name" },
            { title: "Dirección", align: "end", key: "third.address" },
            { title: "Acciones", align: "end", key: "actions" },
        ],
        selectedItems: [],
        records: []
    }),
    components: {
    },
    methods: {
      async fetchUser(){
        const response = await enterpriseApi.read();
        console.log('enterprise');
        console.log('este es el response: ', response);
        if(response.data) this.records = response.data;
      }
    },
    async mounted(){
      await this.fetchUser();
    }
}
</script>
