<template>
  <div class="d-flex pb-5 flex-wrap">
    <h2 class="flex-grow-1 d-flex flex-column my-2 my-md-0">
      Registros actuales
      <div v-if="showStatusLabel">
        <v-chip variant="tonal" class="ma-1" label :color="'primary'">
          Inactivo
        </v-chip>
        <v-chip variant="tonal" class="ma-1" label color="orange">
          Activo
        </v-chip>
      </div>
    </h2>

    <div class="d-flex align-center justify-center flex-wrap">
      <v-select
        :loading="loading"
        density="compact"
        variant="solo"
        class="mr-3 my-2 my-md-0"
        label="Atributo"
        item-value="title"
        item-title="label"
        :items="typeskeyword"
        single-line
        hide-details
        v-model="typeKeyword"
      />

      <v-text-field
        :loading="loading"
        :disabled="typeKeyword && typeKeyword.length > 0 ? false : true"
        density="compact"
        variant="solo"
        class="mr-3 min-w-20"
        label="Palabra clave"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        @click:append-inner="filtrate"
        v-model="keyword"
      ></v-text-field>
      <v-btn
        :icon="'mdi-filter-remove'"
        color="success"
        variant="tonal"
        class="mr-3"
        :disabled="!filterCleaner"
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
import Petition from '@/services/PetitionStructure/Petition';
const petition = new Petition();
export default {
  props: {
    loading: Boolean,
    typeskeyword: Array,
    path: String,
    disableDelete: Boolean,
    filterCleaner: Boolean,
    showDelete: {
      type: Boolean,
      default: true
    },
    showExport: {
      type: Boolean,
      default: true
    },
    showStatusLabel: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    keyword: "",
    typeKeyword: "",
  }),
  methods:{
    async exportExcelFile(){
      console.log('export Excel',this.path)
     await petition.getFile(`/export-data/${this.path}`,undefined, true);


    },
    filtrate(){
      this.$emit('load-items',{typeKeyword:this.typeKeyword, keyword:this.keyword});
    },
    cleanFilter(){
      this.keyword='';
      this.typeKeyword='';
      this.$emit('load-items');
    }
  }
};
</script>
<style scoped>
.min-w-20 {
  min-width: 150px;
}
</style>
