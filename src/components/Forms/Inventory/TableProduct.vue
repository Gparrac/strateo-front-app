<template>
  <div>
    <div class="d-flex pb-5">
      <div>
        <v-btn
          icon="mdi-plus"
          class="mr-3"
          color="primary"
          variant="tonal"
          @click="addItem"
        >
        </v-btn>
        <v-btn
          icon="mdi-delete"
          color="warning"
          variant="tonal"
          :disabled="selectedItems.length == 0 ? true : false"
          @click="deleteItem"
        >
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="records"
      items-per-page="5"
      item-selectable="selectable"
      v-model="selectedItems"
      show-select
      return-object
      items-per-page-text="Items por Página"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="pt-5">
          <v-autocomplete
          class="w-min-custom"
          v-model="item.name"
          item-title="label"
          item-value="name"
          :items="products"
          :rules="rulesValidation.select.rules"
          :loading="loading"
        ></v-autocomplete>
        </div>
      </template>
      <template v-slot:[`item.reference`]="{ item }">
        <div class="pt-5">
          <v-text-field
          class="w-min-custom"
          v-model="item.reference"
          :rules="rulesValidation.text.rules"
          :loading="loading"
        ></v-text-field>
        </div>

      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        <div class="pt-5">
          <v-text-field
          type="number"

          v-model="item.quantity"
          :maxlength="rulesValidation.quantity.maxLength"
          :rules="rulesValidation.quantity.rules"
          :loading="loading"
        ></v-text-field>
        </div>

      </template>
      <template v-slot:[`item.price`]="{ item }">
        <div class="pt-5">
          <v-text-field
          type="number"
          v-model="item.price"
          :maxlength="rulesValidation.price.maxLength"
          :rules="rulesValidation.price.rules"
          :loading="loading"
          append-inner-icon="mdi-currency-usd"
          @input="emmitItems"
        ></v-text-field>
        </div>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import { RulesValidation } from "@/utils/validations";

export default {
  data: () => ({
    rulesValidation: RulesValidation,
    selectedItems: [],
    records: [],
    products: [],
    headers: [
      {
        title: "Producto",
        align: "start",
        key: "name",
      },
      { title: "Referencia", align: "center", key: "reference" },
      { title: "Cantidad", align: "center", key: "quantity" },
      { title: "Precio", align: "center", key: "price" },
    ],
  }),
  methods: {
    async fetchScores() {},
    deleteItem() {
      this.records = this.records.filter((element) =>
        !this.selectedItems.includes(element)
      );
      this.selectedItems = []
    },
    addItem() {
      this.records.push({id:this.records.length,name:'',reference:'',quantity:1,price:0});
    },
    emmitItems(){
      this.$emit("set-items", { items: this.records });
    }
  },
  async mounted() {
    await this.fetchScores();
  },
};
</script>

<style scoped>
.w-min-custom{
  min-width: 200px;
}
</style>
