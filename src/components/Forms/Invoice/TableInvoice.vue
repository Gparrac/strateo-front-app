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
      @toggle-delete="() => (toggleDelete = true)"
    ></header-table>

    <modal-delete
      v-if="toggleDelete"
      @confirm-delete="deleteItems"
      :toggleDelete="toggleDelete"
      :deleteItems="selectedItems"
      :mainKey="mainKeyDelete"
      :secondKey="secondKeyDelete"
      :title="nameTable"
    ></modal-delete>
    <v-btn
      :icon="'mdi-filter-remove'"
      color="success"
      variant="tonal"
      class="mr-3"
      @click="filterTest"
    >
    </v-btn>
    <v-data-table-server
      :headers="headers"
      :items="records"
      item-selectable="selectable"
      v-model="selectedItems"
      @update:options="loadItems"
      :items-length="totalRecords"
      v-model:items-per-page="recordsPerPage"
      :loading="loading"
      items-per-page-text="Items por Página"
      show-select
      return-object
    >
      <template v-slot:[`item.products_count`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.products_count }}
          </v-chip>
        </div>
      </template>

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
    </v-data-table-server>
  </div>
</template>

<script>
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import InvoiceApi from "@/services/Forms/InvoiceApi";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate } from "@/utils/cast";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const invoiceApi = new InvoiceApi();
export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    ModalDelete,
    HeaderTable,
  },
  data: () => ({
    //required data
    records: [],
    //search word
    filterCleaner: false,
    typeskeyword: [
      { title: "id", label: "ID" },
      { title: "name", label: "Provedor" },
    ],
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "suppliers_id",
    mainKeyDelete: ["third", "supplier"],
    secondKeyDelete: ["commercial_registry"],
    selectedItems: [],
    toggleDelete: false,

    //optional data
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      {
        title: "Cliente",
        align: "end",
        key: "client.third.names",
        sortable: false,
      },
      {
        title: "Documento",
        align: "end",
        key: "client.third.identification",
        sortable: false,
      },
      { title: "Fecha de evento", align: "end", key: "date", sortable: false },
      { title: "Vendedor", align: "end", key: "seller.name", sortable: false },
      {
        title: "Productos",
        align: "end",
        key: "products_count",
        sortable: false,
      },
      {
        title: "Ultima actulización",
        align: "center",
        key: "updated_at",
        sortable: true,
      },

      { title: "Acciones", align: "end", key: "actions", sortable: false },
    ],
  }),
  methods: {
    ...mapActions(useFilterTableStore, ['$subscribe']),
    async loadItems(
      {
        page = this.currentlyPage,
        itemsPerPage = this.recordsPerPage,
        sortBy = [],
      },
      filters
    ) {
      this.loading = true;
      const params = new URLSearchParams();
      if (filters && filters.length > 0) {
        this.filterCleaner = true;
        console.log('filters', filters);
        filters.forEach((item,index) => {
          params.append(`filters[${index}][key]`, item.key);
          params.append(`filters[${index}][value]`, item.value);
        });

        console.log('filters', filters)
      } else {
        this.filterCleaner = sortBy.length !== 0;
      }
      params.append("type", "P");
      params.append("page", page);
      params.append("pagination", itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      const response = await invoiceApi.read(params.toString());
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
    filterTest() {
      this.filterTableStore.show();
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (data.confirm && this.selectedItems.length !== 0) {
        const params = new URLSearchParams({});
        this.selectedItems.forEach((item) =>
          params.append(`${this.keyQueryDelete}[]`, item.id)
        );
        const response = await invoiceApi.delete(`?${params.toString()}`);
        // logic to show alert 🚨
        if (response.statusResponse != 200) {
          if (response.error && typeof response.error === "object") {
            this.alertMessageStore.show(
              false,
              "Error en la solicitud.",
              response.error
            );
          } else {
            this.alertMessageStore.show(false, "Error en el servidor.");
          }
        } else {
          this.alertMessageStore.show(
            true,
            `${this.nameTable} desactivados exitosamente`
          );
          await this.loadItems({});
          this.selectedItems = [];
        }
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore, useFilterTableStore),
  },
  mounted() {
    this.filterTableStore.setFilterList([
      { name: "Cliente", key:'client', select: false, validation: RulesValidation.shortTextNull },
      { name: "ID", key:'id', select: false, validation: RulesValidation.optionalPrice },
      { name: "Vendedor", key:'seller', select: false, validation: RulesValidation.shortTextNull},
    ]);

    this.$subscribe((mutation, state) => {
      if(mutation.events.key == 'filterCleanList'){
        if(mutation.events.newValue.length ){
          console.log('value', state);
          this.loadItems({}, state.filterCleanList)
        }
      }
    })

  },
};
</script>
