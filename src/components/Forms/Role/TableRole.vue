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
    >
      <template v-slot:[`item.users_count`]="{ item }">
        <div>
          <v-chip variant="outlined" color="orange">
            {{ item.users_count }}
          </v-chip>
        </div>
      </template>
      <template v-slot:[`item.permissions_count`]="{ item }">
        <div>
          <v-chip variant="tonal" color="primary">
            {{ item.permissions_count }}
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
import RoleApi from "@/services/Forms/RoleApi";
import { castDate, statusAllowed } from "@/utils/cast";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import { RulesValidation } from "@/utils/validations";
import { useFilterTableStore } from '@/store/filterTables';
const roleApi = new RoleApi();
export default {
  name: "TableUser",
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
      { title: "name", label: "Usuario" },
    ],
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "roles_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["description"],
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
      { title: "Role", align: "start", key: "name" },
      { title: "Descripción", align: "start", key: "description" },
      { title: "Número de usuarios", align: "center", key: "users_count" },
      {
        title: "Número de permisos",
        align: "center",
        key: "permissions_count",
      },
      { title: "Ultima actualización", align: "center", key: "updated_at" },
      { title: "Acciones", align: "end", key: "actions" },
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
      console.log('filters', filters)
      if (filters && filters.length > 0) {
        filters.forEach((item, index) => {
          params.append(`filters[${index}][key]`, item.key);
          if(item.key == 'status'){
            item.value.forEach((item,iindex) => {
              params.append(`filters[${index}][value][${iindex}]`, item);
            });
          }else{
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
      const response = await roleApi.read(params.toString());
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
        this.selectedItems.forEach((item) =>
          params.append(`${this.keyQueryDelete}[]`, item.id)
        );
        const response = await roleApi.delete(`?${params.toString()}`);
        if (response.statusResponse == 200) {
          await this.loadItems();
          this.alertMessageStore.show(
            true,
            `${this.nameTable} desactivados exitosamente`
          );
        } else {
          this.alertMessageStore.show(false, "Error en el servidor");
        }
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore, useFilterTableStore),
  },
  async mounted() {
    try {
    this.filterTableStore.setFilterList([
      {
        name: "Nombre del Role",
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
      { name: "Estado", key:'status', options:statusAllowed(), label:'name', itemValue: 'id', select: true, multiple:true},
    ]);

    this.$subscribe((mutation, state) => {
      if(mutation.storeId == 'filterTable' && state.furtherFilterKey != this.furtherFilterKey){
        this.furtherFilterKey = state.furtherFilterKey;
          this.loadItems({}, state.filterCleanList)
      }
    });
  } catch (error) {
     console.error(error);
    }
  }
};

</script>
