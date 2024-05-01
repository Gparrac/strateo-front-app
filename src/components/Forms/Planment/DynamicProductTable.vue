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
          @update:itemSelected="(item) =>checkInvoiceStepStore.handleUpdateInvoiceData(productPlanmentStore.addEvent(item))"
          mainLabel="name"
          :secondLabel="['consecutive']"
          :title="titleField"
          subtitle="Consecutivo: "
          class="pr-5"
        >
        </dynamic-select-field>
        <modal-new-product
          @new-product="productPlanmentStore.addEvent"
          type="T"
        ></modal-new-product>
      </div>
    </v-col>
    <v-col class="px-5">
      <v-data-table :items="productPlanmentStore.productEvents" :headers="headersTable">
        <template v-slot:[`item.id`]="{ item }">
          <div class="d-flex py-2 align-center">
          <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="checkInvoiceStepStore.handleUpdateInvoiceData(productPlanmentStore.deleteEvent(item))"
                  >
                  </v-btn>
          <div class="d-flex flex-column pl-3">
            <h6 class="text-subtitle-1">{{ item.id + ' - ' + item.name }}</h6>
            <span class="d-flex text-overline font-weight-regular text-blue-grey-lighten-3">
              COD: {{ item.product_code }}</span
            >
            <span class="d-flex text-overline font-weight-regular text-blue-grey-lighten-3">
              CON: {{ item.consecutive }}</span
            >
            <div>
            <v-chip class=" mt-1" size="small">
              {{`${item.size} ${item.measure.symbol}`}}

            </v-chip>
          </div>

          </div>
        </div>
        </template>
        <template  v-slot:[`item.attributes`]="{ item }">
          <v-row class="text-start pt-3 my-0">
            <v-col cols="12" lg="4">
              <v-text-field
                :maxlength="rulesValidation.quantity.maxLength"
                label="Cantidad"
                :rules="rulesValidation.quantity.rules"
                :loading="loading"
                variant="outlined"
                v-model="item.amount"
                :disabled="editable"
                density="compact"
                persistent-hint
                @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="8">
              <v-text-field
                :maxlength="rulesValidation.price.maxLength"
                label="Precio"
                :rules="rulesValidation.price.rules"
                :loading="loading"
                prepend-inner-icon="mdi-cash"
                v-model="item.cost"
                variant="outlined"
                :disabled="editable"
                density="compact"
                persistent-hint
                :hint="'Precio fijado: ' + item.defaultCost"
                @change=checkInvoiceStepStore.handleUpdateInvoiceData()
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :maxlength="rulesValidation.price.maxLength"
                label="Descuento"
                :rules="rulesValidation.optionalPrice.rules"
                :loading="loading"
                prepend-inner-icon="mdi-cash"
                v-model="item.discount"
                variant="outlined"
                :disabled="editable"
                @change="checkInvoiceStepStore.handleUpdateInvoiceData()"
                density="compact"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.taxes`]="{ item }">
          <div
            class="d-flex flex-column mt-4 text-start"
            style="min-width: 200px"
          >
            <dynamic-select-field
              :options="taxes"
              @update:options="setTaxes"
              density="compact"
              @update:itemSelected="(value) => checkInvoiceStepStore.handleUpdateInvoiceData(appendItemAttribute(value, item, 'taxes'))"
              mainLabel="acronym"
              :secondLabel="['name']"
              title="Impuestos"
              subtitle=""
              class="w-100"
            >
            </dynamic-select-field>

            <template v-if="item.taxes && item.taxes.length">
              <v-divider thickness="3" class="mb-4"></v-divider>
              <div v-for="(tax, i) in item.taxes" :key="item.id + '-i-t-' + i" class="d-flex  flex-nowrap w-full">
                <div class="flex-grow-1 mr-2">
                <v-select
                  :label="tax.acronym"
                  variant="outlined"
                  v-model="tax.percent"
                  :items="tax.tax_values"
                  @update:model-value="checkInvoiceStepStore.handleUpdateInvoiceData()"
                  item-title="percent"
                  item-value="percent"
                  prepend-inner-icon="mdi-brightness-percent"
                  :rules="rulesValidation.select.rules"
                  :loading="loading"
                  density="compact"

                ></v-select>
              </div>

                <v-btn
                    v-show="!editable"
                    icon="mdi-minus-circle-outline"
                    size="small"
                    color="warning"
                    variant="plain"
                    @click="deleteTax(item.taxes,i)"
                  >
                  </v-btn>

              </div>
            </template>
          </div>
        </template>

        <template v-slot:[`item.total`]="{ item }">
          <total-records :record="item"></total-records>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Total de productos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      productPlanmentStore.productEvents.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'products'"
    class="text-error text-caption"
  >
    {{ errorMessage.message }}
  </span>
</template>
<script>
import { RulesValidation } from "@/utils/validations";
import ProductApi from "@/services/Forms/ProductApi";
import WarehouseApi from "@/services/Forms/WarehouseApi";
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import InventoryApi from "@/services/Forms/InventoryApi";
import ModalNewProduct from "@/components/blocks/ModalNewProduct.vue";
import TaxApi from "@/services/Forms/TaxApi";
import TotalRecords from "@/components/blocks/TotalRecords.vue";
import { mapStores } from "pinia";
import { useProductPlanmentStore } from "@/store/productPlanment";
import { useCheckInvoiceStep } from "@/store/checkInvoiceStep";
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
const inventoryApi = new InventoryApi();
const taxApi = new TaxApi();
export default {
  props: {
    errorMessage: Object,
    editable: Boolean,
    kindProduct: {
      type: String,
      required: false,
      default: 'P',
    },
  },
  components: {
    DynamicSelectField,
    ModalNewProduct,
    TotalRecords,
  },
  data: () => ({
    titleField: 'Productos',
    options: [],
    loading: false,
    rulesValidation: RulesValidation,
    taxes: [],
    warehouses: [],
    headersTable: [
      { title: "Producto", align: "start", sortable: false, key: "id" },
      {
        title: "Propiedades",
        align: "center",
        sortable: false,
        key: "attributes",
      },
      { title: "Impuestos", align: "center", sortable: false, key: "taxes" },
      { title: "Total", align: "center", sortable: false, key: "total" },
    ],
  }),
 computed: {
  ...mapStores(useProductPlanmentStore, useCheckInvoiceStep)
 },
  methods: {
    deleteTax(taxes, index){

      taxes.splice(index, 1);
      this.checkInvoiceStepStore.handleUpdateInvoiceData();
    },
    async setProductInventory(item, product) {
      product.warehouse = item;
      product.stock = (
        await inventoryApi.read(
          `product_id=${product.id}&warehouse_id=${item.id}`
        )
      ).data;
    },
    async loadItems(name = null) {
      let query =  this.kindProduct == 'E' ? `&types[0]=I&` : `&types[0]=T&`;
      query =
        query + (name ? `filters[0][key]=name&filters[0][value]=${name}` : "");

      const response = await productApi.read(`format=short${query}`);
      this.options = response.data;
    },
    async setWarehouses(name = null) {

      const query = name
        ? `&filters[0][key]=address&filters[0][value]=${name}`
        : "";
      this.warehouses = (await warehouseApi.read(`format=short${query}`)).data;
    },
    async setTaxes(name = null) {
      let query = `&filters[0][key]=context&filters[0][value]=P`;
      query += name ? `&filters[0][key]=tax&filters[0][value]=${name}` : "";
      const response = await taxApi.read(`format=short${query}`);
      this.taxes = response.data;
    },
    totalData(array, key){
      return (array) ? array.reduce((total, item) =>
        ( (!isNaN(item[key])) ? total + (+item[key]) : total + 0)
      , 0) : 0;
    },

    appendItemAttribute(value, item, key) {
      if (item[key]) {
        const index = item[key].findIndex(function (objeto) {
          return objeto.id === value.id;
        });

        if (index === -1) item[key].push(value);
      } else {
        item[key] = [value];
      }
    },

  },
  async mounted() {

    this.loading = true;
    try {
      await Promise.all([
        this.loadItems(),
        this.setWarehouses(),
        this.setTaxes(),
      ]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }

    if(this.kindProduct == 'E'){
      this.headersTable[0].title = 'Eventos';
      this.titleField = 'Eventos'
    }
    this.loading = false;
  },
  updated(){
  }
};
</script>
<style scoped>
.max-w-custom {
  max-height: 430px;
  overflow-y: scroll;
}
.input-table {
  width: 300px;
}
</style>
