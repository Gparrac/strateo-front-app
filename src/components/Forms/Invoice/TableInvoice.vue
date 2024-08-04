<template>
  <div>
    <header-table
      :loading="loading"
      :path="path"
      :disableDelete="selectedItems.length == 0 ? true : false"
      @clean-filter="loadItems({})"
      :showDelete="false"
      :showStatusLabel="false"
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
    <template v-slot:[`item.client.third`]="{ item }">
        <div>
          <span class="block text-subtitle-2">
            {{
              `${item?.client?.third?.id} - ${item?.client?.third?.fullname}`

          }}</span
          ><br />
          <span class="block text-body-2 text-blue-grey-lighten-3">
            {{ item?.client?.third?.fullid }}
          </span>
        </div>
      </template>
      <template v-slot:[`item.seller`]="{ item }">
        <div>
          <span class="text-primary">{{ item.seller.name }}</span> <br/>
          <span class="block text-subtitle-2">
            {{
              `${item?.seller?.third?.id} - ${item?.seller?.third?.fullname}`

          }}</span
          ><br />
          <span class="block text-body-2 text-blue-grey-lighten-3">
            {{ item?.client?.third?.fullid }}
          </span>
        </div>
      </template>
      <template v-slot:[`item.sale_type`]="{ item }">
    <div >
      <v-chip
            variant="tonal"
            class="ma-1 "
            size="small"
            :prepend-icon="item.sale_type.id == 'P' ? 'mdi-ray-start-arrow' : 'mdi-source-branch'"
            :color="item.sale_type.id == 'P' ? 'pink' : 'purple'"
          >
          {{ item.sale_type.name }}
          </v-chip>
        </div>
  </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div class="pa-3">
          <v-icon
            size="small"
            class="my-2"
            @click="() => $router.push(`${path}/edit/${item.id}`)"
          >
            mdi-pencil
          </v-icon>
          <btn-invoice-download :invoiceId="item.id" size="x-small"></btn-invoice-download>
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
import BtnInvoiceDownload from "@/components/blocks/BtnInvoiceDownload.vue";
const invoiceApi = new InvoiceApi();
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
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "invoices_id",
    mainKeyDelete: ["third", "names"],
    secondKeyDelete: ["date"],
    selectedItems: [],
    toggleDelete: false,
    furtherFilterKey: 0,

    //optional data
    startSortBy:[{key:'id', order:'desc'}],
    headers: [
      {
        title: "ID",
        align: "left",
        key: "id",
        sortable: true,
      },
      {
        title: "Cliente",
        align: "start",
        key: "client.third",
        sortable: false,
      },
      {
        title: "Documento",
        align: "end",
        key: "client.third.identification",
        sortable: false,
      },
      { title: "Fecha de la transacción", align: "center", key: "date", sortable: true },
      { title: "Vendedor", align: "start", key: "seller", sortable: false },
      {
        title: "Tipo",
        align: "center",
        key: "sale_type",
        sortable: false,
      },
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
      },
      filters
    ) {
      this.loading = true;
      const params = new URLSearchParams();
      if (filters && filters.length > 0) {
        filters.forEach((item,index) => {
          params.append(`filters[${index}][key]`, item.key);
          params.append(`filters[${index}][value]`, item.value);
        });
      }
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
      { name: "Nombre del cliente", key:'client', select: false, validation: RulesValidation.shortTextNull },
      { name: "Identificación del cliente", key:'client_id', select: false, validation: RulesValidation.shortTextNull },
      { name: "ID", key:'id', select: false, validation: RulesValidation.optionalPrice },
      { name: "Vendedor", key:'seller', select: false, validation: RulesValidation.shortTextNull},
    ]);
    this.$subscribe((mutation, state) => {
      if(mutation.storeId == 'filterTable' && state.furtherFilterKey != this.furtherFilterKey){
        this.furtherFilterKey = state.furtherFilterKey;
          this.loadItems({}, state.filterCleanList)
      }
    });

  },
};
</script>
