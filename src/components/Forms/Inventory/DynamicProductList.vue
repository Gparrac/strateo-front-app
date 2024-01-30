<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex">
        <v-autocomplete
          label="Productos relacionados"
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
                <span class="d-block">{{ item.raw.description }}</span>
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
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" v-for="record in records" :key="record.code">
          <v-card :title="record.name" :subtitle="'Consecutivo: '+record.consecutive">
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
              <v-chip class="mx-2">{{record.measure.symbol}}</v-chip>
              <v-chip class="mx-2">{{record.brand.name}}</v-chip>
              <span class="text-overline">{{ record.product_code }}</span>
            </template>
            <v-card-text>
              <h4 class="text-center pb-3 text-overline">
                {{}}
              </h4>
              <v-row >
                <v-col
                  cols="12" sm="6" lg="4"
                >
                    <v-text-field
                      :maxlength="rulesValidation.price.length"
                      label="Costo"
                      :rules="rulesValidation.price.rules"
                      :loading="loading"
                      prepend-inner-icon="mdi-cash"
                      v-model="record.cost"
                    ></v-text-field>

                </v-col>
                <v-col
                  cols="12" sm="2" lg="4"
                >
                    <v-text-field
                      :maxlength="rulesValidation.quantity.length"
                      label="Cantidad"
                      :rules="rulesValidation.quantity.rules"
                      :loading="loading"
                      v-model="record.quantity"
                    ></v-text-field>
                </v-col>
                <v-col
                  cols="12" sm="4" lg="4"
                >
                <h3 class="text-h4 font-weight-light text-right">{{  record.quantity *  record.cost }}</h3>
                <h4 class="text-subtitle-2 text-right font-weight-light">Costo total</h4>
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
      >Total de productos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
    }}</span>
  </div>
  <span v-if="errorMessage.type && errorMessage.type == 'services'" class="text-error text-caption">
  {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import ServiceApi from "@/services/Forms/ServiceApi";
const serviceApi = new ServiceApi();
const fieldText = [
(value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
];
const fieldFile = [
(value) =>
        !value ||
        !value.length ||
        value[0].size < 2000000 ||
        "La imagen debe pesar menos de 2 MB",
];
export default {
  props: {
    records: Array,
    errorMessage: Object
  },
  data: () => ({
    itemSelected: null,
    options: [],
    searchItem: "",
    loading:false,
    rulesValidation: RulesValidation,
  }),
  computed:{
    totalProducts(){
      return (this.products && this.products.lenght > 0) ?
        this.products.map( item => item.cost * item.quantity)
        .this.products.reduce((total, unitCost) => total + unitCost, 0)
        : 0;
    }
  },
  watch: {
    async searchItem(to) {
      if (to.length > 3 && to.length < 5) {
        this.loadItems(to);
      }
    },
  },
  methods: {
    async loadItems(name = null) {
      // const query = name
      //   ? `keyword=${name}&typeKeyword=name&format=short`
      //   : "format=short";
      // this.options = (await serviceApi.read(query)).data;
      this.options = [
        {
          name: 'Nombre producto',
          consecutive:123232,
          product_code: '#2342dsdfsdf',
          quantity: 0,
          cost:0,
          measure:{
            symbol:'kg',
            id:12
          },
          brand:{
            name:'adidas',
            id:12
          }
        }
      ]
    },
    appendItem() {
      this.emitRecords([this.itemSelected, ...this.records]);
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
    handleFileFields(event, item){
      const files = event.target.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        item.pathFile = selectedFile;
        this.$emit(item);
      }
    },
    getFileUrl(file) {
      if (!file) return "";
      if (typeof file === "string") return file;
      if (typeof file === "object") return URL.createObjectURL(file);
      return;
    },

  },
  async mounted() {
    if(this.records && this.records.length > 0 )
    this.records.map( item => {
      this.addRules(item.fields);
  })
    await this.loadItems();

  },
};
</script>
<style>
.max-w-custom {
  max-height: 230px;
  overflow-y: scroll;
}
</style>
