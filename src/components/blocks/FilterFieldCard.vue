<template>
  <v-form ref="filterForm">
  <v-card title="Filtros" variant="flat" >

      <v-card-subtitle class="text-wrap">

        Adiciona filtros para obtener una mejor busqueda
      </v-card-subtitle>


    <template v-slot:prepend>
      <v-btn
        icon="mdi-close"
        size="x-small"

        variant="tonal"
        class="mr-3"
        @click="filterTableStore.close"
      >
      </v-btn>
    </template>
    <v-card-text>
      <div v-for="(field, i) in filterTableStore.filtersList" :key="`${i}-field`">
        <v-text-field
          v-if="!field.select"
          :maxlength="field.validation.maxLength"
          :label="field.name"
          variant="solo"
          density="compact"
          v-model="field.value"
          :rules="field.validation.rules"
        ></v-text-field>
        <v-select
          v-else
              :multiple="field.multiple"
              :label="field.name"
              :items="field.options"
              :item-title="field.label"
              variant="solo"
              density="compact"
              v-model="field.value"
              :item-value="field.itemValue"
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
        @click="filterRecords"
      >
      Filtrar
      </v-btn>
      <v-btn
        v-if="filterTableStore.activeFilter"
        prepend-icon="mdi-filter-off"
        size="small"
        color="red"
        variant="tonal"
        class="mr-3"
        @click="filterTableStore.clean"
      >
      Limpiar
      </v-btn>

    </v-card-actions>
  </v-card>
</v-form>
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
  }),
  methods:{
    async filterRecords(){
      const { valid } = await this.$refs.filterForm.validate();
      if(valid)
        this.filterTableStore.filter()
    }
  }
};
</script>
