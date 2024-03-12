<template>
  <v-card title="Filtros" variant="flat" :subtitle="filterTableStore.filtersList.length">
    <v-card-text>
      <div v-for="(field, i) in filterTableStore.filtersList" :key="`${i}-field`">
        <v-text-field
          v-if="!field.select"
          :maxlength="field.validation.maxLength"
          :label="field.name"
          variant="solo"
          v-model="field.value"
          :rules="field.validation.rules"
        ></v-text-field>
        <v-select
          v-else
              :label="field.name"
              :items="field.options"
              :item-title="field.label"
              variant="solo"
              v-model="field.value"
              return-object
            ></v-select>
      </div>
      <h5 v-if="!filterTableStore.filtersList ||  filterTableStore.filtersList.length == 0">No hay filtros disponibles</h5>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        prepend-icon="mdi-filter"
        size="small"
        color="success"
        variant="tonal"
        class="mr-3"
        @click="filterTableStore.filter"
      >
      Filtrar
      </v-btn>
      <v-btn
        prepend-icon="mdi-close"
        size="small"
        color="error"
        variant="tonal"
        class="mr-3"
        @click="filterTableStore.close"
      >
      Cerrar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapStores } from "pinia";
import { useFilterTableStore } from "@/store/filterTables";
import { RulesValidation } from "@/utils/validations";
export default {
  computed: {
    ...mapStores(useFilterTableStore),
  },
  data:() => ({
    rulesValidation: RulesValidation
  })
};
</script>
