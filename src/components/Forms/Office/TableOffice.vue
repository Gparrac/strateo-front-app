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
      <div>
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
    <v-data-table
      :headers="headers"
      :items="records"
      items-per-page="5"
      item-selectable="selectable"
      v-model="selectedItems"
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
    </v-data-table>
  </div>
</template>

<script>
import OfficeApi from "@/services/Forms/OfficeApi";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
const officeApi = new OfficeApi();
export default {
  name: "TableOffice",
  props: {
    nameTable: String,
    path: String,
  },
  data: () => ({
    //required data
    keyQueryDelete: "office_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["address"],
    selectedItems: [],
    records: [],
    toggleDelete: false,
    //optional data
    headers: [
      {
        title: "ID",
        align: "start",
        key: "id",
      },
      { title: "Nombre", align: "end", key: "name" },
      { title: "Dirección", align: "end", key: "address" },
      { title: "Teléfono", align: "end", key: "phone" },
      { title: "Ciudad", align: "end", key: "city.name" },
      { title: "Estado", align: "end", key: "status" },
      { title: "Acciones", align: "end", key: "actions" },
    ],
  }),
  components: {
    ModalDelete,
  },
  methods: {
    async fetchScores() {
      const respose = await officeApi.read();
      if (respose.statusResponse == 200) {
        this.records = respose.data.data;
      }
    },
    async deleteItems(data) {
      this.toggleDelete = false;
      if (!data.confirm && this.selectedItems.length == 0) return;
      const response =
        this.selectedItems.length == 1
          ? await officeApi.delete(`?office_id=${this.selectedItems[0].id}`)
          : await officeApi.delete(
              `?office_ids=[${this.selectedItems.map((element) => element.id)}]`
            );

      if (response.statusResponse == 200) {
        await this.fetchScores();
        this.alertMessageStore.show(
          true,
          `${this.nameTable} eliminados exitosamente`
        );
      } else {
        this.alertMessageStore.show(false, "Error en el servidor");
      }
    },
  },
  async mounted() {
    await this.fetchScores();
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
