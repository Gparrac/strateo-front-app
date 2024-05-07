<template>
  <div>
    <modal-edit-tax
      :active="toggleCreate"
      :savedRecord="editItem"
      @record-saved="loadItems({})"
      @update:active="(item) => {toggleCreate = item; ; editItem = null}"
      @new-value ="loadItems({sortBy: startSortBy})"
    ></modal-edit-tax>
    <header-table
      :showFilter="false"
      :loading="loading"
      :typeskeyword="typeskeyword"
      :path="path"
      :modalHandler="true"
      :filterCleaner="filterCleaner"
      :disableDelete="selectedItems.length == 0 ? true : false"
      @load-items="(data) => loadItems({}, data?.keyword, data?.typeKeyword)"
      @clean-filter="loadItems({})"
      @toggle-delete="() => {toggleDelete = true}"
      @show-modal="() => {toggleCreate = true}"
      :show-status-label="false"

      :title="title"
    ></header-table>
    <modal-delete
      v-if="toggleDelete"
      @confirm-delete="deleteItems"
      :toggleDelete="toggleDelete"
      :deleteItems="selectedItems"
      :mainKey="mainKeyDelete"
      :secondKey="secondKeyDelete"
      :title="title"
      titleKey="ID: "
      subtitleKey="Porcentaje: "
    ></modal-delete>
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
      :sort-by="startSortBy"
    >
      <template v-slot:[`item.fields_count`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.fields_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.taxes`]="{ item }">
        <div>
          <v-chip v-for="tax in item.taxes" :key="item.id +'-'+tax.id +'-tax'" variant="tonal" color="primary">
            {{ tax.acronym }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-icon size="small" class="me-2" @click="updateItem(item)">
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

import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

import ModalEditTax from "./ModalEditTax.vue";
import TaxValueApi from "@/services/Forms/TaxValueApi";
const taxValueApi = new TaxValueApi();
export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    ModalDelete,
    HeaderTable,
    ModalEditTax
  },
  data: () => ({
    //required data
    records: [],
    title: 'Porcentajes por impuesto',
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
    keyQueryDelete: "tax_value_ids",
    mainKeyDelete: ["id"],
    secondKeyDelete: ["percent"],
    selectedItems: [],
    toggleDelete: false,
    toggleCreate: false,
    editItem: {},
    //optional data
    startSortBy: [{ key: "id", order: "desc" }],
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      { title: "Valor", align: "end", key: "percent", sortable: false },
      {
        title: "Impuestos relacionados",
        align: "end",
        key: "taxes",
        sortable: false,
      },
      { title: "Acciones", align: "end", key: "actions", sortable: false },
    ],
  }),
  methods: {

    updateAttributes(data) {
      this.editItem[data.key] = data.item;
    },
    async loadItems(
      {
        page = this.currentlyPage,
        itemsPerPage = this.recordsPerPage,
        sortBy = [],
      },
      keyword = null,
      typeKeyword = null
    ) {
      this.idEditForm = null;
      this.loading = true;
      const params = new URLSearchParams();
      if (typeKeyword && keyword) {
        this.filterCleaner = true;
        params.append("typeKeyword", typeKeyword);
        params.append("keyword", keyword);
      } else {
        this.filterCleaner = sortBy.length !== 0;
      }
      console.log('passing', sortBy);
      params.append("page", page);
      params.append("pagination", itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      // api call ⚠️
      const response = await taxValueApi.read(params.toString());
      if (response.data && response.data.data)
        this.records = response.data.data;
      console.log('response',this.records)
      this.currentlyPage = page;
      this.recordsPerPage = response.data.per_page;
      this.totalRecords = response.data.total;
      this.loading = false;
    },
    updateItem(item) {
      this.editItem = item;
      this.toggleCreate = true;
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (data.confirm && this.selectedItems.length !== 0) {
        const params = new URLSearchParams({});
        this.selectedItems.forEach((item,i) =>
          params.append(`${this.keyQueryDelete}[${i}]`, item.id)
        );
        const response = await taxValueApi.delete(`?${params.toString()}`);
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
            `${this.nameTable} eliminados exitosamente`
          );
          await this.loadItems({sortBy: this.startSortBy});
          this.selectedItems = [];
        }
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
