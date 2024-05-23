<template>
  <div>
    <header-table
      :loading="loading"
      :path="path"
      :disableDelete="selectedItems.length == 0 ? true : false"
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
    <v-data-table-server
      :sort-by="startSortBy"
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
      :items-per-page-options="[5, 10, 20, 50]"
    >
      <template v-slot:[`item.children_products_count`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.children_products_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.type.name`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :prepend-icon="item.type.icon"
            size="x-small"
            :color="item.type.id == 'I' ? 'blue' : 'pink'"
          >
            {{ item.type.name }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.measure.symbol`]="{ item }">
        <div>
          <v-chip
            variant="outlined"
            class="ma-1"
            label
            :prepend-icon="item.type.icon"
            size="x-small"
            color="grey"
          >
            {{ item.measure.symbol }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.subproducts_count`]="{ item }">
        <div>
          <v-chip
            variant="outlined"
            class="ma-1"
            :prepend-icon="item.type.icon"
            color="primary"
          >
            {{ item.subproducts_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.type`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.children_products_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.categories_count`]="{ item }">
        <div>
          <v-chip variant="tonal" color="primary">
            {{ item.categories_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.cost`]="{ item }">
        <div>
          {{ moneyFormat(item.cost) }}
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
      <template v-slot:[`item.status`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :color="item.status == 'A' ? 'orange' : 'primary'"
          >
            {{ item.status }}
          </v-chip>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import ProductApi from "@/services/Forms/ProductApi";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate, formatNumberToColPesos, statusAllowed } from "@/utils/cast";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const productApi = new ProductApi();
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
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "product_ids",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["consecutive"],
    selectedItems: [],
    toggleDelete: false,
    startSortBy: [{ key: "id", order: "desc" }],
    //optional data
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      { title: "Producto", align: "left", key: "name", sortable: true },
      { title: "Tipo", align: "center", key: "type.name", sortable: false },
      {
        title: "Clasificación",
        align: "center",
        key: "type_content.name",
        sortable: false,
      },
      { title: "Estado", align: "end", key: "status", sortable: false },
      { title: "Costo", align: "start", key: "cost", sortable: false },
      {
        title: "Medida",
        align: "center",
        key: "measure.symbol",
        sortable: false,
      },
      { title: "Marca", align: "left", key: "brand.name", sortable: false },
      {
        title: "Categorias",
        align: "center",
        key: "categories_count",
        sortable: false,
      },
      {
        title: "Productos",
        align: "center",
        key: "subproducts_count",
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
    ...mapActions(useFilterTableStore, ["$subscribe"]),
    moneyFormat(item) {
      return formatNumberToColPesos(item);
    },
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

      //filtering information 🚥
      if (filters && filters.length > 0) {
        filters.forEach((item, index) => {
          params.append(`filters[${index}][key]`, item.key);
          if (item.key == "status") {
            item.value.forEach((item, iindex) => {
              params.append(`filters[${index}][value][${iindex}]`, item);
            });
          } else {
            params.append(`filters[${index}][value]`, item.value);
          }
        });
      }

      params.append("page", page);
      params.append("pagination", itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      const response = await productApi.read(params.toString());
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

    async deleteItems(data) {
      this.toggleDelete = false;
      if (data.confirm && this.selectedItems.length !== 0) {
        const params = new URLSearchParams({});
        this.selectedItems.forEach((item, i) =>
          params.append(`${this.keyQueryDelete}[${i}]`, item.id)
        );
        const response = await productApi.delete(`?${params.toString()}`);
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
          await this.loadItems({ sortBy: this.startSortBy });
          this.selectedItems = [];
        }
      }
    },
  },
  mounted() {
    try {
      this.filterTableStore.setFilterList([
        {
          name: "Nombre",
          key: "name",
          select: false,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "ID",
          key: "id",
          select: false,
          validation: RulesValidation.optionalPrice,
        },
        {
          name: "Estado",
          key: "status",
          options: statusAllowed(),
          label: "label",
          itemValue: "name",
          select: true,
          multiple: true,
          validation: RulesValidation.shortTextNull,
        },
      ]);
      this.$subscribe((mutation, state) => {
        if (
          mutation.storeId == "filterTable" &&
          state.furtherFilterKey != this.furtherFilterKey
        ) {
          this.furtherFilterKey = state.furtherFilterKey;
          this.loadItems(
            { page: 1, sortBy: this.startSortBy },
            state.filterCleanList
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
  computed: {
    ...mapStores(useAlertMessageStore, useFilterTableStore),
  },
};
</script>
