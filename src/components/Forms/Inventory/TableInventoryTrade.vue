<template>
  <div>
    <header-table
      :loading="loading"
      :typeskeyword="typeskeyword"
      :path="path"
      :filterCleaner="filterCleaner"
      :disableDelete="selectedItems.length == 0 ? true : false"
      @load-items="(data) => loadItems({}, data?.keyword, data?.typeKeyword)"
      @clean-filter="loadItems({})"
      :showDelete="false"
      :showExport="true"
      :showStatusLabel="false"
    >
  <template v-slot:listMenuChips>
    <div >
          <!-- Contenido predeterminado si no se proporciona ningún contenido al slot -->
          <v-chip variant="tonal" class="ma-1" label :color="'success'" @click="loadItems({},'E', 'transaction_type')">
            Entrada
          </v-chip>
          <v-chip variant="tonal" class="ma-1" label color="error" @click="loadItems({},'D', 'transaction_type')">
            Salida
          </v-chip>
        </div>
  </template>
  </header-table>
    <modal-delete
      v-if="toggleDelete"
      @confirm-delete="deleteItems"
      :toggleDelete="toggleDelete"
      :deleteItems="selectedItems"
      :mainKey="mainKeyDelete"
      :secondKey="secondKeyDelete"
      :title="nameTable"
    ></modal-delete>
    <v-data-table-server
    :sort-by="startSortBy"
    :headers="headers"
      :items="records"
      @update:options="loadItems"
      :items-length="totalRecords"
      v-model:items-per-page="recordsPerPage"
      :loading="loading"
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

    </v-data-table-server>
  </div>
</template>

<script>

import ModalDelete from "@/components/blocks/ModalDelete.vue";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import InventoryApi from '@/services/Forms/InventoryApi';
import { castDate } from '@/utils/cast';
const inventoryApi = new InventoryApi()
export default {
  name: "TableOffice",
  props: {
    nameTable: String,
    path: String,
  },
  data: () => ({
    //required data
    records: [],
    //search word
    filterCleaner: false,
    typeskeyword: [
      { title: "id", label: "ID" },
      { title: "transaction_type", label: "Tipo de transacción" }
    ],

    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,

    //delete items
    keyQueryDelete: "inventory_trades_id",
    mainKeyDelete: ["supplier","third", "name"],
    secondKeyDelete: ["transaction_date"],
    selectedItems: [],
    toggleDelete: false,

    //optional data
    startSortBy:[{key:'id', order:'desc'}],
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      { title: "Registro comercial provedor", align: "center", key: "supplier.commercial_registry", sortable: false},
      { title: "Contacto", align: "center", key: "supplier.third.business_name", sortable: false},
      { title: "Costo total", align: "center", key: "total_cost", sortable: false},
      { title: "Cantidad total", align: "center", key: "total_amount", sortable: false},
      { title: "Tipo de transacción", align: "center", key: "transaction_type.name", sortable: false},
      { title: "Proposito", align: "center", key: "purpose.name", sortable: false},
      { title: "Fecha", align: "center", key: "transaction_date", sortable: false},
      { title: "Acciones", align: "center", key: "actions", sortable: false }
    ],
  }),
  components: {
    ModalDelete,
    HeaderTable
  },
  methods: {
    async loadItems(
      {
        page = this.currentlyPage,
        itemsPerPage = this.recordsPerPage,
        sortBy = [],
      },
      keyword = null,
      typeKeyword = null
    ) {
      this.loading = true;
      const params = new URLSearchParams();
      if (typeKeyword && keyword) {
        this.filterCleaner = true;
        params.append("typeKeyword", typeKeyword);
        params.append("keyword", keyword);
      } else {
        this.filterCleaner = sortBy.length !== 0;
      }

      params.append("page", page);
      params.append("pagination", itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      const response = await inventoryApi.read(params.toString());
      if (response.data && response.data.data)
        this.records = response.data.data.map((item) => {
          item.updated_at = castDate(item.updated_at);
          return item;
        });
      this.currentlyPage = page;
      this.recordsPerPage = response.data.per_page;
      this.totalRecords = response.data.total;
      this.loading = false;
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
