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
      show-select
      return-object
      items-per-page-text="Items por Página"
      :items-per-page-options="[5, 10, 20, 50]"
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
      <template v-slot:[`item.type`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :prepend-icon="item.type == 'I' ? 'mdi-cart-plus' : 'mdi-cart-minus'"
            :color="item.type == 'I' ? 'pink' : 'purple'"
          >
            {{ item.type == 'I' ? 'Incremento' : 'Decremento' }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.context`]="{ item }">


        {{ item.context == 'I' ? 'Venta' : 'Por producto' }}

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
      <template v-slot:[`item.percent`]="{ item }">
        <div v-for="(percent,i) in item.tax_values" :key="`p-${percent.id}-${i}`" class="text-center ">
          <span>{{ percent.percent }}</span>
          <v-divider v-if="i != item.tax_values.length-1"></v-divider>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
import TaxApi from "@/services/Forms/TaxApi";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate, statusAllowed } from "@/utils/cast";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const taxApi = new TaxApi();
export default {
  name: "TableTax",
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
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "tax_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["acronym"],
    selectedItems: [],
    toggleDelete: false,
    startSortBy:[{key:'id', order:'desc'}],
    //optional data
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable:true
      },
      { title: "Nombre", align: "start", key: "name", sortable:true},
      { title: "Acrónimo", align: "end", key: "acronym", sortable:false},
      { title: "Porcentaje", align: "end", key: "percent", sortable:false},
      { title: "Contexto", align: "center", key: "context", sortable:false},
      { title: "Tipo", align: "center", key: "type", sortable:false},
      { title: "Estado", align: "end", key: "status", sortable:false},
      { title: "Ultima actualización", align: "end", key: "updated_at", sortable:false},
      { title: "Acciones", align: "end", key: "actions", sortable:false},
    ],
  }),

  methods: {
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
      const response = await taxApi.read(params.toString());
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
      if (!data.confirm && this.selectedItems.length == 0) return;
      const response =
        this.selectedItems.length == 1
          ? await taxApi.delete(`?tax_id=${this.selectedItems[0].id}`)
          : await taxApi.delete(
              `?tax_ids=[${this.selectedItems.map((element) => element.id)}]`
            );

      if (response.statusResponse == 200) {
        await this.loadItems({sortBy:this.startSortBy});
        this.alertMessageStore.show(
          true,
          `${this.nameTable} desactivados exitosamente`
        );
      } else {
        this.alertMessageStore.show(false, "Error en el servidor");
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
    ...mapStores(useAlertMessageStore, useFilterTableStore)
  },
};
</script>
