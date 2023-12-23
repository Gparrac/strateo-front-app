<template>
  <div>
    <div class="d-flex pb-5">
      <h2 class="flex-grow-1">Registros actuales</h2>
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
    </v-data-table>
  </div>
</template>

<script>
import RoleApi from "@/services/Forms/RoleApi";
import { castDate } from "@/utils/cast";
import ModalDelete from "@/components/blocks/ModalDelete.vue";
import { mapStores } from "pinia";
import { useAlertMessageStore } from "@/store/alertMessage";
const roleApi = new RoleApi();
export default {
  name: "TableUser",
  props: {
    nameTable: String,
    path: String,
  },
  data: () => ({
    //required data
    keyQueryDelete: "roles_id",
    mainKeyDelete: ["name"],
    secondKeyDelete: ["description"],
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
  components: {
    ModalDelete,
  },
  methods: {
    async fetchScore() {
      const response = await roleApi.read();
      if (response.data)
        this.records = response.data.map((item) => {
          item.updated_at = castDate(item.updated_at);
          return item;
        });
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
          await this.fetchScore();
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
  async mounted() {
    await this.fetchScore();
  },
  computed: {
    ...mapStores(useAlertMessageStore),
  },
};
</script>
