<template>
  <div>
    <div class="d-flex pb-5">
      <h2 class="flex-grow-1">Registros actuales</h2>
      <div>
        <v-btn
          icon="mdi-plus"
          class="mr-3"
          color="primary"
          variant="tonal"
          @click="() => $router.push(`${path}/create`)"
        >
        </v-btn>
        <v-btn
          icon="mdi-delete"
          color="warning"
          variant="tonal"
          :disabled="selectedItems.length == 0 ? true : false"
          @click="() => (toggleDelete = true)"
        >
        </v-btn>
      </div>
    </div>
    <modal-delete
      v-if="toggleDelete"
      @confirm-delete="deleteItems"
      :toggleDelete="toggleDelete"
      :deleteItems="selectedItems"
      :mainKey="mainKeyDelete"
      :secondKey="secondKeyDelete"
      :title="nameTable"
    ></modal-delete>
    <v-data-table
      :headers="headers"
      :items="records"
      items-per-page="5"
      item-selectable="selectable"
      v-model="selectedItems"
      show-select
      return-object
    >
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon
            size="small"
            class="me-2"
            @click="() => $router.push(`${path}/edit/${item.id}`)"
          >
            mdi-pencil
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.status`]="{ item }">
                <div>
                    <v-chip variant="tonal" class="ma-1" label :color="item.status == 'A' ? 'orange' : 'primary'">
                      {{item.status}}
                    </v-chip>
                </div>
            </template>
    </v-data-table>
  </div>
</template>

<script>
import EnterpriseApi from '@/services/Forms/EnterpriseApi';
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
const enterpriseApi = new EnterpriseApi();
export default {
  name: "TableEnterprise",
  props:{
    nameTable: String,
    path:String,
  },
  data: () => ({
    //required data
    keyQueryDelete: "enterprise_id",
    mainKeyDelete:['business_name'],
    secondKeyDelete:['identification'],
    selectedItems: [],
    records: [],
    toggleDelete: false,
    //optional data
    headers: [
      {
          title: "ID",
          align: "start",
          key: "id",
      },
      { title: "Tipo de documento", align: "end", key: "type_document" },
      { title: "Identificación", align: "end", key: "identification" },
      { title: "Código de Verificación", align: "end", key: "verification_id" },
      { title: "Nombre de Empresa", align: "end", key: "business_name" },
      { title: "Dirección", align: "end", key: "address" },
      { title: "Acciones", align: "end", key: "actions" },
    ],
  }),
  components: {
    ModalDelete,
  },
  methods: {
    async fetchScores() {
      const respose = await enterpriseApi.read();
      if (respose.data) this.records = respose.data;
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (data.confirm && this.selectedItems.length !== 0) {
        const params = new URLSearchParams({})
        this.selectedItems.forEach(item => params.append(`${this.keyQueryDelete}[]`, item.id));
        const response = await enterpriseApi.delete(`?${params.toString()}`);
        if (!response.error) {
          await this.fetchScores();
          this.alertMessageStore.show(true, `${this.nameTable} eliminados exitosamente`);
        } else {
          this.alertMessageStore.show(false, "Error en el servidor");
        }
      }
    },
  },
  async mounted() {
    await this.fetchScores();
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
