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
    </v-data-table-server>
  </div>
</template>

<script>
import TaxApi from "@/services/Forms/TaxApi";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate } from "@/utils/cast";
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
    //search word
    filterCleaner: false,
    typeskeyword: [
      { title: "id", label: "ID" },
      { title: "name", label: "Nombre" },
      { title: "acronym", label: "Acrónimo" },
    ],
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
      { title: "Nombre", align: "end", key: "name", sortable:true},
      { title: "Acrónimo", align: "end", key: "acronym", sortable:false},
      { title: "Porcentaje", align: "end", key: "default_percent", sortable:false},
      { title: "Contexto", align: "center", key: "context", sortable:false},
      { title: "Tipo", align: "center", key: "type", sortable:false},
      { title: "Estado", align: "end", key: "status", sortable:false},
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
        await this.loadItems({});
        this.alertMessageStore.show(
          true,
          `${this.nameTable} desactivados exitosamente`
        );
      } else {
        this.alertMessageStore.show(false, "Error en el servidor");
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
