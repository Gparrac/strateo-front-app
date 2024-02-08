<template>
  <v-row>
    <v-col cols="12" >
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Campo dinamico. </span> Escribe entre 3 a
        5 letras para completar la busqueda...</strong
      >
      <div class="d-flex" >
        <v-autocomplete

          label="Productos relacionados"
          v-model="itemSelected"
          :items="options"
          class="flex-grow-1 mr-5"
          v-model:search="searchItem"
          item-title="name"
          :return-object="true"
          :loading="loading"
          :disabled="editable"
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
          v-show="!editable"
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
                v-show="!editable"
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
                      variant="outlined"
                      :disabled="editable"
                      persistent-hint
                      :hint="'Precio fijado: '+ record.defaultCost"
                    ></v-text-field>

                </v-col>
                <v-col
                  cols="12" sm="2" lg="4"

                >
                    <v-text-field
                    class="pr-5"
                      :maxlength="rulesValidation.quantity.length"
                      label="Cantidad"
                      :rules="[...rulesValidation.quantity.rules, (v) => (!(record.stock < v && typeTransaction == 'D'))  || 'No hay stock suficiente en inventario.' ]"
                      :loading="loading"
                      variant="outlined"
                      v-model="record.amount"
                      :disabled="editable"
                      persistent-hint
                      :hint="'Stock actual: ' + record.stock "
                    ></v-text-field>

                </v-col>
                <v-col
                  cols="12" sm="4" lg="4"
                >
                <h3 class="text-h4 font-weight-light text-right">{{  (record.amount ?? 0) *  record.cost }}</h3>
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
import ProductApi from "@/services/Forms/ProductApi";
const productApi = new ProductApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
    warehouse: Number,
    typeTransaction: String,
  },
  data: () => ({
    itemSelected: null,
    options: [],
    searchItem: "",
    loading:false,
    rulesValidation: RulesValidation,
  }),
  computed:{

  },
  watch: {
    async searchItem(to) {
      if (to.length > 3 && to.length < 5) {
        this.loadItems(to);
      }
    },
    warehouse(){
      this.resetItems();
    },
    typeTransaction(){
      this.resetItems();
    }
  },
  methods: {
    resetItems(){
      this.itemSelected = null;
      this.emitRecords([]);
    },
    async loadItems(name = null) {
      let query = `warehouseFilter=${this.warehouse}&types[0]=PR&`
        query = query + (name ? `keyword=${name}&typeKeyword=name&format=short`
        : "format=short");

      const response = (await productApi.read(query));
      this.options = response.data

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
  max-height: 230px;
  overflow-y: scroll;
}
</style>
