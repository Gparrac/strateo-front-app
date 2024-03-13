<template>
  <div class="d-flex pb-5 flex-wrap">
    <div class="flex-grow-1 d-flex flex-column my-2 my-md-0">
      Registros actuales
      <slot name="listMenuChips">
      <div v-if="showStatusLabel">
          <!-- Contenido predeterminado si no se proporciona ningún contenido al slot -->
          <v-chip variant="tonal" class="ma-1" label :color="'primary'">
            Inactivo
          </v-chip>
          <v-chip variant="tonal" class="ma-1" label color="orange">
            Activo
          </v-chip>
        </div>
        </slot>
    </div>


    <div class="d-flex align-center justify-center flex-wrap">

      <v-btn
        :icon="'mdi-filter'"
        color="success"
        variant="tonal"
        class="mr-3"
        @click="filterTableStore.show"
      >
      </v-btn>
      <v-btn
        v-if="filterTableStore.activeFilter"
       icon="mdi-filter-off"
        size="small"
        color="red"
        variant="tonal"
        class="mr-3"
        @click="filterTableStore.clean"
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
        v-if="showDelete"
        icon="mdi-delete"
        color="warning"
        variant="tonal"
        :disabled="disableDelete"
        @click="() => $emit('toggle-delete')"
      >
      </v-btn>
      <v-btn
        v-if="showExport"
        icon="mdi-cloud-download"
        color="deep-purple-accent-4"
        variant="tonal"
        @click="exportExcelFile"
      >
      </v-btn>
    </div>
  </div>
</template>
<script>
import Petition from "@/services/PetitionStructure/Petition";
import { useFilterTableStore } from "@/store/filterTables";
import { mapStores } from 'pinia';
const petition = new Petition();
export default {
  props: {
    loading: Boolean,
    path: String,
    disableDelete: Boolean,
    showDelete: {
      type: Boolean,
      default: true,
    },
    showExport: {
      type: Boolean,
      default: false,
    },
    showStatusLabel: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
  }),
  computed:{
    ...mapStores(useFilterTableStore)
  },
  methods: {
    async exportExcelFile() {
      await petition.getFile(`/export-data/${this.path}`, undefined, true);
    },


  },
};
</script>
<style scoped>
.min-w-20 {
  min-width: 150px;
}
</style>
