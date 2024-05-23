<template>
  <div>
      <header-table
      :loading="loading"
      :typeskeyword="typeskeyword"
      :path="path"
      :disableDelete="selectedItems.length == 0 ? true : false"
      @load-items="(data) => loadItems({}, data?.keyword, data?.typeKeyword)"
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
      :sort-by="startSortBy"
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
import CategoryApi from "@/services/Forms/CategoryApi";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate, statusAllowed } from '@/utils/cast';
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const categoryApi = new CategoryApi();
export default {
  name: "TableCategory",
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    ModalDelete,
    HeaderTable
  },
  data: () => ({
    //required data
    records: [],
    //search word
    filterCleaner: false,
    typeskeyword: [
      { title: "id", label: "ID" },
      { title: "name", label: "Nombre" },
    ],
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "category_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["code"],
    selectedItems: [],
    toggleDelete: false,
    //optional data
    startSortBy:[{key:'id', order:'desc'}],
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true
      },
      { title: "Nombre", align: "center", key: "name", sortable:true },
      { title: "Código", align: "center", key: "code", sortable:true },
      { title: "Estado", align: "end", key: "status", sortable:false },
      { title: "Acciones", align: "end", key: "actions", sortable:false },
    ],
  }),
  methods: {
    ...mapActions(useFilterTableStore, ["$subscribe"]),
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
      const response = await categoryApi.read(params.toString());
      if (response.data && response.data.data){
        this.records = response.data.data.map((item) => {
          item.updated_at = castDate(item.updated_at);
          return item;
        });
      }
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
          ? await categoryApi.delete(`?category_id=${this.selectedItems[0].id}`)
          : await categoryApi.delete(
              `?${this.selectedItems.map((element) => `category_ids[]=${element.id}&`).join("")}`
            );

      if (response.statusResponse == 200) {
        await this.loadItems({ sortBy: this.startSortBy });
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
          name: "Codigo",
          key: "code",
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
