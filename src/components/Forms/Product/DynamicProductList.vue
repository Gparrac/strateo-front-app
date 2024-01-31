<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <v-autocomplete
          label="Campos adicionales"
          v-model="itemSelected"
          :items="options"
          class="flex-grow-1 mr-5"
          v-model:search="searchItem"
          item-title="name"
          :return-object="true"
          :loading="loading"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props">
              <v-list-item-subtitle class="d-flex">
                <span class="d-block"
                  >codigo: {{ item.raw.product_code }}
                </span>
                <v-spacer></v-spacer>
                <v-chip class="mx-2 ">{{ item.raw.brand.name }}</v-chip>
                <v-chip>{{  item.raw.size + ' ' + item.raw.measure.symbol}}</v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-btn
          icon="mdi-plus-circle"
          color="primary"
          variant="tonal"
          class="mr-3"
          :disabled="itemSelected ? false : true"
          @click="appendItem"
        >
        </v-btn>
      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row>
        <v-col cols="12" md="6" v-for="record in records" :key="record.code">
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
                <v-col cols="12" sm="8" md="6" lg="4">
                  <v-chip class="mx-2">{{record.measure.symbol}}</v-chip>
              <v-chip class="mx-2">{{record.brand.name}}</v-chip>
                </v-col>
                <v-col cols="12" sm="6" lg="8">
                <v-text-field
                  :maxlength="rulesValidation.quantity.length"
                  label="Cantidad"
                  variant="outlined"
                  v-model="record.amount"
                  :rules="rulesValidation.quantity.rules"
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
const productApi = new ProductApi();
export default {
  props: {
    records: Array,
  },
  data: () => ({
    itemSelected: null,
    options: [],
    searchItem: "",
    rulesValidation: RulesValidation,
    loading: false,
  }),
  watch: {
    async searchItem(to) {
      if (to.length > 3 && to.length < 5) {
        this.loadItems(to);
      }
    },
  },
  methods: {
    async loadItems(name = null) {
      this.loading = true;
      const query = name
        ? `keyword=${name}&typeKeyword=name&format=short`
        : "format=short";
      const response = (await productApi.read(query))
      console.log('responseOptions', response)
      this.options = response.data
      console.log('opitons', this.options);
      this.loading = false;
    },
    appendItem() {
      const idIndex = this.itemSelected.id
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === idIndex;
      });
      let newArray = this.records;
      (index !== -1) ? newArray.splice(index, 1, this.itemSelected) : newArray.push(this.itemSelected);
      this.emitRecords(newArray);
      this.itemSelected = null;
    },
    deleteItem(itemSelected) {
      this.emitRecords(
        this.records.filter((item) => item.id != itemSelected.id)
      );
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
<style>
.max-w-custom {
  max-height: 200px;
  overflow-y: scroll;
}
</style>
