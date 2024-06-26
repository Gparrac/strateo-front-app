<template>
  <div>
    <header-table
      :loading="loading"
      :path="path"
      :disableDelete="selectedItems.length == 0 ? true : false"
      :showDelete="false"
      :showStatusLabel="false"
      @toggle-delete="() => (toggleDelete = true)"
      :showCreate="false"
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
      :sort-by="startSortBy"
      v-model:items-per-page="recordsPerPage"
      :loading="loading"
      items-per-page-text="Items por Página"
      show-select
      return-object
      :items-per-page-options="[5, 10, 20, 50]"

    >
      <template v-slot:[`item.actions`]="{ item }">
        <div class="pa-2 flex justify-center text-center">

            <v-icon
              size="small"
              class="my-2 "
              @click="() => $router.push(`${path}/edit/${item.id}`)"
            >
              mdi-pencil
            </v-icon>


          <btn-invoice-download :invoiceId="item.id" size="x-small" :exportProductPlanment="true"></btn-invoice-download>
        </div>
      </template>
      <template v-slot:[`item.stage`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :prepend-icon="'mdi-file-tree'"
            :color="item?.planment?.stage?.color"
          >
            {{ item?.planment?.stage?.name }}
          </v-chip>
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
import Petition from "@/services/PetitionStructure/Petition";
import BtnInvoiceDownload from "@/components/blocks/BtnInvoiceDownload.vue";
const invoiceApi = new InvoiceApi();
const petition = new Petition();
export default {
  props: {
    nameTable: String,
    path: String,
  },
  components: {
    ModalDelete,
    HeaderTable,
    BtnInvoiceDownload
  },
  data: () => ({
    //required data
    records: [],
    //search word
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    filters:[],
    loading: false,
    //delete items
    keyQueryDelete: "invoices_id",
    mainKeyDelete: ["client", "third", "identification"],
    secondKeyDelete: ["date", "description"],
    selectedItems: [],
    toggleDelete: false,
    furtherFilterKey: 0,
    //optional data
    startSortBy:[{key:'id', order:'desc'}],
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      {
        title: "Usuario",
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
      { title: "Fecha de orden", align: "end", key: "date", sortable: true },
      {
        title: "Fecha de inicio",
        align: "end",
        key: "planment.start_date",
        sortable: false,
      },
      {
        title: "Fecha de finalización",
        align: "planment.end_date",
        key: "date",
        sortable: false,
      },
      { title: "Etapa", align: "center", key: "stage", sortable: false },
      { title: "Vendedor", align: "end", key: "seller.name", sortable: false },
      {
        title: "Ultima actulización",
        align: "center",
        key: "updated_at",
        sortable: true,
      },

      { title: "Acciones", align: "center", key: "actions", sortable: false },
    ],
  }),
  methods: {
    ...mapActions(useFilterTableStore, ['$subscribe']),
    async loadItems(
      {
        page = this.currentlyPage,
        itemsPerPage = this.recordsPerPage,
        sortBy = [],
      } = {},
      filters = this.filters
    ) {
      this.loading = true;
      const params = new URLSearchParams();
      if (filters && filters.length > 0) {
        filters.forEach((item, index) => {
          params.append(`filters[${index}][key]`, item.key);
          if(item.key == 'stages'){
            item.value.forEach((item,iindex) => {
              params.append(`filters[${index}][value][${iindex}]`, item);
            });
          }else{
            params.append(`filters[${index}][value]`, item.value);
          }
        });
      }
      params.append("type", "E");
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
      this.filters = filters;
      this.loading = false;
    },
    async setStages() {
      const rta = (await petition.get("/type-invoices", `planment_stage=FIN`))
        .data;
      return rta || [];
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
          await this.loadItems({sortBy: this.startSortBy});
          this.selectedItems = [];
        }
      }
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore, useFilterTableStore),
  },
  async mounted() {
    try {
    const stagesOptions = await this.setStages();
    this.filterTableStore.setFilterList([
      {
        name: "Nombre del cliente",
        key: "client",
        select: false,
        validation: RulesValidation.shortTextNull,
      },
      {
        name: "Identificación del cliente",
        key: "client_id",
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
        name: "Vendedor",
        key: "seller",
        select: false,
        validation: RulesValidation.shortTextNull,
      },
      {
        name: "Etapas",
        key: "stages",
        itemValue: "id",
        multiple: true,
        label: "name",
        select: true,
        validation: RulesValidation.shortTextNull,
        options: stagesOptions,
      },
    ]);

    this.$subscribe((mutation, state) => {
      if(mutation.storeId == 'filterTable' && state.furtherFilterKey != this.furtherFilterKey){
        this.furtherFilterKey = state.furtherFilterKey;
          this.loadItems({page:1, sortBy: this.startSortBy}, state.filterCleanList)
      }
    });
  } catch (error) {
     console.error(error);
    }
  },
};
</script>
