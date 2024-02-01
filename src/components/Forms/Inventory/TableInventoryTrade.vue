<template>
  <div>
    <div class="d-flex pb-5">
      <h2 class="flex-grow-1 d-flex flex-column">
        Registros actuales
        <div>
          <v-chip variant="tonal" class="ma-1" label :color="'success'" prepend-icon="mdi-login">
            Entrada
          </v-chip>
          <v-chip variant="tonal" class="ma-1" label color="error" prepend-icon="mdi-logout">
            Salida
          </v-chip>
        </div>
      </h2>
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
      items-per-page-text="Items por Página"
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
      <template v-slot:[`item.transaction_type.name`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :prepend-icon="item.transaction_type.icon"
            :color="item.transaction_type.id == 'E' ? 'success' : 'error'"
          >
            {{ item.transaction_type.name }}
          </v-chip>
        </div>
      </template>

    </v-data-table>
  </div>
</template>

<script>

import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import InventoryApi from '@/services/Forms/InventoryApi';
const inventoryApi = new InventoryApi()
export default {
  name: "TableOffice",
  props: {
    nameTable: String,
    path: String,
  },
  data: () => ({
    //required data
    keyQueryDelete: "inventory_trades_id",
    mainKeyDelete: ["supplier","third", "name"],
    secondKeyDelete: ["transaction_date"],
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
      { title: "Registro comercial", align: "center", key: "supplier.commercial_registry" },
      { title: "Contacto", align: "center", key: "supplier.third.business_name" },
      { title: "Costo total", align: "center", key: "total_cost" },
      { title: "Tipo de transacción", align: "center", key: "transaction_type.name" },
      { title: "Proposito", align: "center", key: "purpose.name" },
      { title: "Fecha", align: "center", key: "transaction_date" },
      { title: "Acciones", align: "center", key: "actions", sortable: false }
    ],
  }),
  components: {
    ModalDelete,
  },
  methods: {
    async fetchScores() {
      const respose = await inventoryApi.read();
      if (respose.statusResponse == 200) {
        this.records = respose.data.data;
      }
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (!data.confirm && this.selectedItems.length == 0) return;
      // const response =
      //   this.selectedItems.length == 1
      //     ? await inventoryApi.delete(`?office_id=${this.selectedItems[0].id}`)
      //     : await inventoryApi.delete(
      //         `?office_ids=[${this.selectedItems.map((element) => element.id)}]`
      //       );

      // if (response.statusResponse == 200) {
      //   await this.fetchScores();
      //   this.alertMessageStore.show(
      //     true,
      //     `${this.nameTable} desactivados exitosamente`
      //   );
      // } else {
      //   this.alertMessageStore.show(false, "Error en el servidor");
      // }
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
