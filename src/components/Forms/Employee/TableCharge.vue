<template>
  <div>
    <modal-edit-charge
      :toggle="toggleCreate"
      :editItem="editItem"
      @record-saved="loadItems({})"
      @update-attribute="updateAttributes"
      @update-toggle=" closeModal"
    ></modal-edit-charge>
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
      @toggle-delete="() => (toggleDelete = true)"
      @show-modal="() => (toggleCreate = true)"
      :sort-by="startSortBy"
      title="Cargos para planeaciones"
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
      :headers="headers"
      :items="records"
      item-selectable="selectable"
      v-model="selectedItems"
      @update:options="loadItems"
      :items-length="totalRecords"
      v-model:items-per-page="recordsPerPage"
      :items-per-page-options="[5, 10, 20, 50]"
      :loading="loading"
      items-per-page-text="Items por Página"
      show-select
      return-object
    >
      <template v-slot:[`item.fields_count`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.fields_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.services_count`]="{ item }">
        <div>
          <v-chip variant="tonal" color="primary">
            {{ item.services_count }}
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
import { castDate } from "@/utils/cast";
import ModalEditCharge from "./ModalEditCharge.vue";
import ChargeApi from "@/services/Forms/ChargeApi";
const chargeApi = new ChargeApi();
export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    ModalDelete,
    HeaderTable,
    ModalEditCharge
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
    keyQueryDelete: "charge_ids",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["description"],
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
      { title: "Nombre", align: "end", key: "name", sortable: false },
      {
        title: "Descripción",
        align: "end",
        key: "description",
        sortable: false,
      },
      { title: "Status", align: "end", key: "status", sortable: false },
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
    closeModal(item){
      this.toggleCreate = item;
      this.editItem = {};
    },
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

      params.append("page", page);
      params.append("pagination", itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      // api call ⚠️
      const response = await chargeApi.read(params.toString());
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
    updateItem(item) {
      this.editItem = item;
      this.toggleCreate = true;
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (data.confirm && this.selectedItems.length !== 0) {
        const params = new URLSearchParams({});
        this.selectedItems.forEach((item) =>
          params.append(`${this.keyQueryDelete}[]`, item.id)
        );
        const response = await chargeApi.delete(`?${params.toString()}`);
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
    ...mapStores(useAlertMessageStore),
  },
};
</script>
