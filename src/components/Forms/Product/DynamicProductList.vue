<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <dynamic-select-field
          :options="options"
          @update:options="loadItems"
          @update:itemSelected="appendItem"
          mainLabel="name"
          :secondLabel="['consecutive']"
          title="Subproductos"
          :thirdkey="{id:'product_code', label:'Cod: '}"
          subtitle="Cons:"
          class="pr-5"
        >
        </dynamic-select-field>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row>
        <v-col cols="12"  v-for="record in records" :key="record.code">
          <v-card
            :title="record.name"
            :subtitle="'Consecutivo: ' + record.consecutive"
          >
            <template v-slot:prepend>
              <v-btn
                icon="mdi-delete"
                color="warning"
                variant="tonal"
                @click="deleteItem(record)"
              >
              </v-btn>
            </template>
            <template v-slot:append>
              <span class="text-overline">{{ record.product_code }}</span>
            </template>
            <v-card-text >
              <v-row >
                <v-col cols="12" sm="8" md="8" lg="9">
                  <v-chip class="mx-2">{{record.measure.symbol}}</v-chip>
              <v-chip class="mx-2">{{record.brand.name}}</v-chip>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field
                  :maxlength="rulesValidation.quantity.maxLength"
                  label="Cantidad"
                  variant="outlined"
                  v-model="record.amount"
                  :rules="rulesValidation.quantity.rules"
                  density="compact"
                  :loading="loading"
                ></v-text-field>
              </v-col>
              </v-row>
            </v-card-text>
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
import { RulesValidation } from "@/utils/validations";
import ProductApi from "@/services/Forms/ProductApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
const productApi = new ProductApi();
export default {
  props: {
    records: Array,
  },
  components:{
    DynamicSelectField,
  },
  data: () => ({
    options: [],
    rulesValidation: RulesValidation,
    loading: false,
  }),

  methods: {
    async loadItems(name = null) {
      let query = `&filters[0][key]=non-subproducts&filters[0][value]=true`;
      query =
        query + (name ? `filters[0][key]=name&filters[0][value]=${name}` : "");
      const response = await productApi.read(`format=short${query}`);
      this.options = response.data;
    },
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
    },
    deleteItem(dropItem) {
      this.emitRecords(this.records.filter((item) => item.id != dropItem.id));
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
    },
  },
  async mounted() {
    await this.loadItems();
  },
};
</script>
<style scoped>
.max-w-custom {
  max-height: 356px;
  overflow-y: scroll;
}
</style>
