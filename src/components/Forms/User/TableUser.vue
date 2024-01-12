<template>
  <div>
    <div class="d-flex pb-5">
      <h2 class="flex-grow-1 d-flex flex-column">
        Registros actuales
        <div>
          <v-chip variant="tonal" class="ma-1" label :color="'primary'">
            Inactivo
          </v-chip>
          <v-chip variant="tonal" class="ma-1" label color="orange">
            Activo
          </v-chip>
        </div>
      </h2>

      <div class="d-flex align-center justify-center">
        <v-select
        :loading="loading"
        density="compact"
        variant="solo"
        class="mr-3 "
        label="Atributo"
        item-value="title"
        item-title="label"
        :items="typeskeyword"
        v-model="typeKeyword"
        single-line
        hide-details
        />


        <v-text-field
        :loading="loading"
        density="compact"
        variant="solo"
        class="mr-3 min-w-20"
        label="Palabra clave"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        v-model="keyword"
        @click:append-inner="loadItems"
      ></v-text-field>
        <v-btn

          :icon="'mdi-filter-remove'"
          color="success"
          variant="tonal"
          class="mr-3"
          :disabled="!filter"
          @click="cleanFilter"
        >
        </v-btn>
        <v-btn
          icon="mdi-plus"
          class="mr-3"
          color="primary"
          variant="tonal"
          @click="() => $router.push(`${path}/create`)"
        >
        </v-btn>
        <v-btn
          icon="mdi-delete"
          color="warning"
          variant="tonal"
          :disabled="selectedItems.length == 0 ? true : false"
          @click="() => (toggleDelete = true)"
        >
        </v-btn>

      </div>
    </div>
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
import UserApi from "@/services/Forms/UserApi";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
import { castDate } from "@/utils/cast";
const userApi = new UserApi();
export default {
  name: "TableUser",
  props: {
    nameTable: String,
    path: String,
  },
  data: () => ({
    //required data
    records: [],
    //search word
    filter:false,
    keyword: "",
    typeKeyword:"",
    typeskeyword:[{title:'id',label:'ID'},{title:'name',label:'Usuario'}],
    //delete items
    keyQueryDelete: "users_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["third", "email"],
    selectedItems: [],
    toggleDelete: false,
    //pagination
    totalRecords: 0,
    recordsPerPage: 5,
    currentlyPage: 1,
    loading: false,
    //optional data
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
        sortable: true,
      },
      { title: "Usuario", align: "end", key: "name", sortable: true },
      { title: "Email", align: "end", key: "third.email", sortable: false },
      { title: "Estado", align: "end", key: "status", sortable: false },
      { title: "Telefono", align: "end", key: "third.mobile", sortable: false },
      { title: "Role", align: "end", key: "role.name", sortable: false },
      {
        title: "Ultima actulización",
        align: "center",
        key: "updated_at",
        sortable: true,
      },
      { title: "Acciones", align: "end", key: "actions", sortable: false },
    ],
  }),
  components: {
    ModalDelete,
  },
  methods: {
    async cleanFilter(){
      this.filter = '';
      this.typeKeyword = '';
      this.keyword = '';
      await this.loadItems({});
    },
    async loadItems({ page = this.currentlyPage, itemsPerPage = this.recordsPerPage, sortBy = [] }) {
      this.loading = true;
      const params = new URLSearchParams();//loading params
      console.log(this.filter,this.typeKeyword,this.keyword)
      if(this.typeKeyword && this.keyword){
        this.filter = true;
        params.append('typeKeyword', this.typeKeyword);
        params.append('keyword', this.keyword);
      }
      if(sortBy.length != 0) this.filter = true;
      params.append('page',page);
      params.append('pagination',itemsPerPage);
      sortBy.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          params.append(`sorters[${index}][${key}]`, item[key]);
        });
      });
      const response = await userApi.read(params.toString());
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
        const response = await userApi.delete(`?${params.toString()}`);
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
          await this.loadItems();
          this.selectedItems = [];
        }
      }
    },
  },
  async mounted() {},
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
<style scoped>
.min-w-20{
  min-width: 150px;
}
</style>
