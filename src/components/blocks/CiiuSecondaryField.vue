<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
            :options="ciiuCodes"
            :itemSaved="ciiu"
            @update:options="setCiiuCodes"
            @update:itemSelected="appendCiiu"
            mainLabel="description"
            title="Codigos secundarios CIIU"
          >
          </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row>
        <v-col cols="12" md="6" v-for="record in records" :key="record.code">
          <v-card :title="record.code" :subtitle="record.description">
            <template v-slot:prepend>
              <v-btn
                icon="mdi-delete"
                color="warning"
                variant="tonal"
                @click="deleteItem(record)"
              >
              </v-btn>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Total de registros seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
</template>
<script>
import Petition from "@/services/PetitionStructure/Petition.js";
import DynamicSelectField from '@/components/blocks/DynamicSelectField.vue';
const petition = new Petition();
export default {
  props: {
    records: Array,
  },
  data: () => ({
    ciiu: null,
    ciiuCodes: [],
  }),
  components:{
    DynamicSelectField
  },
  methods: {
    async setCiiuCodes(name = null) {
      const query = name ? `name=${name}` : "";
      this.ciiuCodes = (await petition.get("/ciiu-codes", query)).data;
    },
    appendCiiu(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    deleteItem(ciiu) {
      this.emitRecords(this.records.filter((item) => item.id != ciiu.id));
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    await this.setCiiuCodes();
  },
};
</script>
<style>
.max-w-custom {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
