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
      @toggle-delete="() => ((kindModal = false), (toggleDelete = true))"
      :showCreate="false"
      :showDelete="false"
      :show-status-label="false"
      :showExport="true"
    >
      <template v-slot:custom-button>
        <v-btn
          @click="() => ((kindModal = true), (toggleDelete = true))"
          :disabled="selectedItems.length == 0 ? true : false"
          icon="mdi-account-convert"
          color="deep-purple-accent-4"
          class="ml-3"
          variant="tonal"
        >
        </v-btn>
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
      <template v-slot:[`item.employee`]="{ item }">
        <div>
          <span class="block text-subtitle-2">{{
            item?.employee?.third?.fullname
          }}</span
          ><br />
          <span class="block text-body-2 text-blue-grey-lighten-3">
            {{ item?.employee?.third?.fullid }}
          </span>
        </div>
      </template>
      <template v-slot:[`item.charges`]="{ item }">
        <div
          v-for="(charge, i) in item?.charges"
          :key="`p-${charge.id}-${i}`"
          class="text-center"
        >
          <span>{{ charge.name }}</span>
          <v-divider v-if="i != item.charges.length - 1"></v-divider>
        </div>
      </template>
      <template v-slot:[`item.planment_info`]="{ item }">
        <div class="my-2">
          <v-chip color="blue">ID: {{ item?.planment.id }}</v-chip>
        </div>
        <span class="block text-subtitle-2">{{
          item?.planment?.invoice?.client?.third?.fullname
        }}</span
        ><br />
        <span class="block text-body-2 text-blue-grey-lighten-3">
          {{ item?.employee?.third?.fullid }}
        </span>
      </template>
      <template v-slot:[`item.salary`]="{ item }">
        {{ formatSalary(item.salary) }}
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
      <template v-slot:[`item.settled`]="{ item }">
        <div>
          <v-chip
            variant="tonal"
            class="ma-1"
            label
            :color="item.settled ? 'success' : 'purple'"
          >
            {{ item.settled ? "Liquidado" : "Pendiendte" }}
          </v-chip>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
import PaymentApi from "@/services/Forms/PaymentApi";
import HeaderTable from "@/components/blocks/HeaderTable.vue";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapActions, mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";

import { castDate, formatNumberToColPesos } from "@/utils/cast";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
const paymentApi = new PaymentApi();
export default {
  name: "TableWarehouse",
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
      { title: "name", label: "Usuario" },
    ],
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //delete items
    keyQueryDelete: "payment_planment_ids",
    mainKeyDelete: ["employee", "third", "fullname"],
    secondKeyDelete: ["employee", "third", "fullid"],
    selectedItems: [],
    toggleDelete: false,
    kindModal: false,
    furtherFilterKey: 0,
    //optional data
    startSortBy: [{ key: "id", order: "desc" }],

    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      { title: "Empleado", align: "left", key: "employee", sortable: true },
      {
        title: "Planeación",
        align: "center",
        key: "planment_info",
        sortable: true,
      },
      { title: "Cargos", align: "center", key: "charges", sortable: false },
      { title: "Estado", align: "center", key: "settled", sortable: false },
      { title: "Salario", align: "center", key: "salary", sortable: false },
      {
        title: "Metodo de pago",
        align: "center",
        key: "payment_method.name",
        sortable: false,
      },
      { title: "Referencia", align: "end", key: "reference", sortable: false },
      {
        title: "Ultima actulización",
        align: "center",
        key: "updated_at",
        sortable: true,
      },
    ],
  }),
  mounted() {
    try {
      const stagesOptions = [
        { id: 0, name: "Pendiente" },
        { id: 1, name: "Liquidado" },
      ];
      this.filterTableStore.setFilterList([
      {
          name: "ID",
          key: "id",
          select: false,
          validation: RulesValidation.optionalPrice,
        },
        {
          name: "Empleado",
          key: "employee",
          select: false,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "ID de planeación",
          key: "planment",
          select: false,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "Cliente",
          key: "client",
          select: false,
          validation: RulesValidation.shortTextNull,
        },
        {
          name: "Etapas",
          key: "settled",
          itemValue: "id",
          multiple: true,
          label: "name",
          select: true,
          validation: RulesValidation.shortTextNull,
          options: stagesOptions,
        },
      ]);
      this.$subscribe((mutation, state) => {
        if (
          mutation.storeId == "filterTable" &&
          state.furtherFilterKey != this.furtherFilterKey
        ) {
          this.furtherFilterKey = state.furtherFilterKey;
          this.loadItems({}, state.filterCleanList);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    ...mapActions(useFilterTableStore, ["$subscribe"]),
    handleButtonClick() {

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
          if (item.key == "stages" || item.key == "settled") {
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
      const response = await paymentApi.read(params.toString());
      if (response.data && response.data.data) {
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
      if (!data.confirm || this.selectedItems.length == 0) return;
      let response = null;
      if (this.kindModal) {
        const formData = new FormData();

        this.selectedItems.map((element, index) => {
          formData.append(
            `employee_planments[${index}][employee_planment_id]`,
            element.id
          );
          formData.append(
            `employee_planments[${index}][settled]`,
            element.settled
          );
        });
        response = await paymentApi.update(formData);
      } else {
        response =
          this.selectedItems.length == 1
            ? await paymentApi.delete(
                `?warehouse_id=${this.selectedItems[0].id}`
              )
            : await paymentApi.delete(
                `?${this.selectedItems
                  .map((element) => `warehouse_ids[]=${element.id}&`)
                  .join("")}`
              );
      }

      if (response.statusResponse == 200) {
        await this.loadItems({});
        this.alertMessageStore.show(
          true,
          `${this.nameTable} desactivados exitosamente`
        );
        this.selectedItems = [];
      } else {
        this.alertMessageStore.show(false, "Error en el servidor");
      }
    },
    formatSalary(number) {
      return formatNumberToColPesos(number);
    },
  },
  computed: {
    ...mapStores(useAlertMessageStore, useFilterTableStore),
  },
};
</script>
