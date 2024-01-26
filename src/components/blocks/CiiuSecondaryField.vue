<template>
  <v-row >
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <v-autocomplete
          label="Codigos secundarios CIIU"
          v-model="ciiu"
          :items="ciiuCodes"
          class="flex-grow-1 mr-5"
          v-model:search="searchCiiu"
          item-title="description"
          :return-object="true"
          :loading="loading"
        ></v-autocomplete>
        <v-btn
          icon="mdi-plus-circle"
          color="primary"
          variant="tonal"
          class="mr-3"
          :disabled="ciiu  ? false : true"
          @click="appendCiiu"
        >
        </v-btn>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="record in records"
          :key="record.code"
        >
        <v-card :title="record.code" :subtitle="record.description">
          <template v-slot:prepend>
            <v-btn icon="mdi-delete" color="warning" variant="tonal" @click="deleteItem(record)"> </v-btn>
          </template>
        </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3">Total de registros seleccionados: </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{ records.length }}</span>
  </div>
</template>
<script>
import Petition from "@/services/PetitionStructure/Petition.js";
import { RulesValidation } from "@/utils/validations";
const petition = new Petition();
export default {
  props:{
    records:Array
  },
  data: () => ({
    ciiu: null,
    ciiuCodes: [],
    searchCiiu: "",
    rulesValidation: RulesValidation,
    loading:false
  }),
  watch: {
    async searchCiiu(to) {
      if (to.length > 3 && to.length < 5) {
        this.setCiiuCodes(to);
      }
    },
  },
  methods: {
    async setCiiuCodes(name = null) {
      const query = name ? `?name=${name}` : "";
      this.ciiuCodes = (await petition.get("/ciiu-codes", query)).data;
    },
    appendCiiu(){
      this.emitCiiuRecords([this.ciiu,...this.records]);
      this.ciiu = null;
  },
  deleteItem(ciiu){
    this.emitCiiuRecords(this.records.filter(item => item.id != ciiu.id));
  },
  emitCiiuRecords(newRecords){
    this.$emit('update:records',newRecords);
  }
  },
  async mounted() {
    await this.setCiiuCodes();
  },

};
</script>
<style>
.max-w-custom{
  max-height: 200px;
  overflow-y: scroll;
}
</style>
