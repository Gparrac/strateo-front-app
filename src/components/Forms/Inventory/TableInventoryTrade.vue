<template>
  <div>
    <header-table
      :loading="loading"
      :path="path"
      :disableDelete="selectedItems.length == 0 ? true : false"
      :showDelete="false"
      :showExport="true"
      :showStatusLabel="false"
    >
      <template v-slot:listMenuChips>
        <div>
          <!-- Contenido predeterminado si no se proporciona ningún contenido al slot -->
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :color="'success'"
            @click="loadItems({}, 'E', 'transaction_type')"
          >
            Entrada
          </v-chip>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            color="error"
            @click="loadItems({}, 'D', 'transaction_type')"
          >
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
      :items-per-page-options="[5, 10, 20, 50]"
    >
    <template v-slot:[`item.supplier`]="{ item }">
        <div>
          <span class="block text-subtitle-2">{{
            item?.supplier?.third?.fullname
          }}</span
          ><br />
          <span class="block text-body-2 text-blue-grey-lighten-3">
            {{ item?.supplier?.third?.fullid }}
          </span>
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
      <template v-slot:[`item.total_cost`]="{ item }">
        <div>
          {{ moneyFormat(item.total_cost) }}
        </div>
      </template>
      <template v-slot:[`item.total_amount`]="{ item }">
        <div>
          <v-chip
            variant="outlined"
            class="ma-1"
            :color="item.total_amount != 0 ? 'primary' : 'orange'"
          >
            {{ item.total_amount }}
          </v-chip>
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
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import InventoryApi from "@/services/Forms/InventoryApi";
import { castDate, formatNumberToColPesos } from "@/utils/cast";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const inventoryApi = new InventoryApi();
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

    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,

    //delete items
    keyQueryDelete: "inventory_trades_id",
    mainKeyDelete: ["supplier", "third", "name"],
    secondKeyDelete: ["transaction_date"],
    selectedItems: [],
    toggleDelete: false,

    //optional data
    startSortBy: [{ key: "id", order: "desc" }],
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      {
        title: "Registro comercial provedor",
        align: "center",
        key: "supplier.commercial_registry",
        sortable: false,
      },
      {
        title: "Provedor",
        align: "left",
        key: "supplier",
        sortable: false,
      },
      {
        title: "Costo total",
        align: "center",
        key: "total_cost",
        sortable: false,
      },
      {
        title: "Cantidad total",
        align: "center",
        key: "total_amount",
        sortable: false,
      },
      {
        title: "Tipo de transacción",
        align: "center",
        key: "transaction_type.name",
        sortable: false,
      },
      {
        title: "Proposito",
        align: "center",
        key: "purpose.name",
        sortable: false,
      },
      {
        title: "Fecha",
        align: "center",
        key: "transaction_date",
        sortable: false,
      },
      { title: "Acciones", align: "center", key: "actions", sortable: false },
    ],
  }),
  components: {
    ModalDelete,
    HeaderTable,
  },
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
      if (filters && filters.length > 0) {
        filters.forEach((item, index) => {
          params.append(`filters[${index}][key]`, item.key);
          if (item.key == "status" || item.key == "transaction_type") {
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
  mounted() {
    const transactionTypes = [
      { name: "Entrada", id: "E" },
      { name: "Salida", id: "D" },
    ];
    try {
      this.filterTableStore.setFilterList([
        {
          name: "Provedor",
          key: "supplier",
          select: false,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "Tipo de transacción",
          key: "transaction_type",
          options: transactionTypes,
          label: "name",
          itemValue: "id",
          select: true,
          multiple: true,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "ID",
          key: "id",
          select: false,
          validation: RulesValidation.optionalPrice,
        },
        // {
        //   name: "Estado",
        //   key: "status",
        //   options: statusAllowed(),
        //   label: "label",
        //   itemValue: "name",
        //   select: true,
        //   multiple: true,
        //   validation: RulesValidation.shortTextNull,
        // },
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
