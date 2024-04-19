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
          subtitle="Consecutivo: "
          class="pr-5"
        >
        </dynamic-select-field>
        <modal-new-product
          @new-product="appendItem"
          type="T"
        ></modal-new-product>
      </div>
    </v-col>
    <v-col class="px-5">
      <v-data-table :items="productPlanmentStore.subproducts" :headers="headersTable">
        <template v-slot:[`item.id`]="{ item }">
          <div class="d-flex py-2 align-center">
          <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    size="small"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(item)"
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

        <template v-slot:[`item.inventory`]="{ item }">
          <div class="d-flex flex-column justify-center align-center flex-wrap">
            <v-checkbox
              v-model="item.tracing"
              color="primary"
              label="Requiere inventario"
              :value="1"
              hide-details
            ></v-checkbox>
            <dynamic-select-field
              class="w-100 text-start"
              v-if="item.tracing"
              :options="warehouses"
              :itemSaved="item.warehouse"
              @update:options="setWarehouses"
              @update:itemSelected="(value) => setProductInventory(value, item)"
              mainLabel="address"
              :secondLabel="['city', 'name']"
              title="Bodega"
              subtitle="Ciudad:"
              :key="warehouses.length"
              density="compact"
              :hint="
                item.tracing && item.warehouse
                  ? 'Stock actual: ' + item.stock
                  : ''
              "
              persistent-hint
            >
            </dynamic-select-field>
          </div>
        </template>
        <template v-slot:[`item.events`]="{ item }">
          <div
            class="d-flex flex-column mt-4 text-start"
            style="min-width: 140px"
          >
          <dynamic-select-field
              :options="productPlanmentStore.productEventsAllowed"
              density="compact"
              @update:itemSelected="(value) => appendItemAttribute(value, item, 'events')"
              mainLabel="name"
              title="Eventos"
              class="w-100"
            >
            </dynamic-select-field>
            <template v-if="item.events && item.events.length">
              <v-divider thickness="3" class="mb-4"></v-divider>
              <div v-for="(event, i) in item.events" :key="item.id + '-i-t-' + i">
                <v-text-field
                  :label="event.name"
                  variant="outlined"
                  v-model="event.amount"
                  :rules="rulesValidation.quantity.rules"
                  :loading="loading"
                  density="compact"
                  placeholder="Digita una cantidad apropiada..."
                >
                </v-text-field>
              </div>
            </template>
          </div>
        </template>
        <template v-slot:[`item.total`]="{ item }">

          <span  class="text-h4">
          {{ totalData(item.events, 'amount') }}
          </span>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <strong class="text-overline d-block mt-3"
      >Total de productos seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      productPlanmentStore.subproducts.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == 'subproducts'"
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
import { mapStores } from "pinia";
import { useProductPlanmentStore } from "@/store/productPlanment";
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
const inventoryApi = new InventoryApi();
const taxApi = new TaxApi();
export default {
  name: 'DynamicSubproductTable',
  props: {
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
    ModalNewProduct,
  },
  data: () => ({
    titleField: 'Productos',
    options: [],
    loading: false,
    rulesValidation: RulesValidation,
    taxes: [],
    warehouses: [],
    productEvents: [],
    headersTable: [
      { title: "Producto", align: "start", sortable: false, key: "id" },
      {
        title: "Eventos",
        align: "center",
        sortable: false,
        key: "events",
      },
      {
        title: "Inventario",
        align: "center",
        sortable: false,
        key: "inventory",
      },
      { title: "Total", align: "center", sortable: false, key: "total" },
    ],
  }),
  computed:{
    ...mapStores(useProductPlanmentStore)
  },
  methods: {
    async setProductInventory(item, product) {
      product.warehouse = item;
      product.stock = (
        await inventoryApi.read(
          `product_id=${product.id}&warehouse_id=${item.id}`
        )
      ).data;
    },
    async loadItems(name = null) {
      let query =  `&types[0]=T&`;
      query =
        query + (name ? `filters[0][key]=name&filters[0][value]=${name}` : "");

      const response = await productApi.read(`format=short${query}`);
      this.options = response.data;
    },
    async setWarehouses(name = null) {
      console.log();
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
      console.log("taxes", this.taxes);
    },
    totalData(array, key){
      return (array) ? array.reduce((total, item) =>
        ( (!isNaN(item[key])) ? total + (+item[key]) : total + 0)
      , 0) : 0;
    },
    appendItem(item) {
      const index = this.productPlanmentStore.subproducts.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      if (index === -1) this.productPlanmentStore.subproducts.push(item);

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
    deleteItem(itemSelected) {
      this.productPlanmentStore.subproducts = this.productPlanmentStore.subproducts.filter((item) => item.id != itemSelected.id)
    }
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

    this.loading = false;
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
