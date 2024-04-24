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
          :title="titleField"
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
      <v-data-table :items="records" :headers="headersTable">
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
        <template  v-slot:[`item.attributes`]="{ item }">
          <v-row class="text-start pt-3 my-0">
            <v-col cols="12" lg="4">
              <v-text-field
                :maxlength="rulesValidation.quantity.maxLength"
                label="Cantidad"
                :rules="[...rulesValidation.quantity.rules]"
                :loading="loading"
                variant="outlined"
                v-model="item.amount"
                :disabled="editable"
                density="compact"
                persistent-hint
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
                density="compact"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-if="kindProduct == 'P'" v-slot:[`item.inventory`]="{ item }">
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
        <template v-slot:[`item.subproducts`]="{ item }">
          <span class="text-h4">

            {{ item.subproducts?.length }}
          </span>
        </template>
        <template v-slot:[`item.taxes`]="{ item }">
          <div
            class="d-flex flex-column mt-4 text-start"
            style="min-width: 140px"
          >
            <dynamic-select-field
              :options="taxes"
              @update:options="setTaxes"
              density="compact"
              @update:itemSelected="(value) => appendItemAttribute(value, item, 'taxes')"
              mainLabel="acronym"
              :secondLabel="['name']"
              title="Impuestos"
              subtitle=""
              class="w-100"
            >
            </dynamic-select-field>
            <template v-if="item.taxes && item.taxes.length">
              <v-divider thickness="3" class="mb-4"></v-divider>
              <div v-for="(tax, i) in item.taxes" :key="item.id + '-i-t-' + i">
                <v-select
                  :label="tax.acronym"
                  variant="outlined"
                  v-model="tax.percent"
                  :items="tax.tax_values"
                  item-title="percent"
                  item-value="percent"
                  prepend-inner-icon="mdi-brightness-percent"
                  :rules="rulesValidation.select.rules"
                  :loading="loading"
                  density="compact"
                ></v-select>
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
      records.length
    }}</span>
  </div>
  <span
    v-if="errorMessage.type && errorMessage.type == errorKey"
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
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
const inventoryApi = new InventoryApi();
const taxApi = new TaxApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
    kindProduct: {
      type: String,
      required: false,
      default: 'P',
    },
    events: {
      type: Array,
      required: false,
    },
    errorKey: {
      type: String,
      required: false,
      dafault: 'furtherProduct'
    }


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
    productEvents: [],
    headersTable: [
      { title: "Producto", align: "start", sortable: false, key: "id" },
      {
        title: "Propiedades",
        align: "center",
        sortable: false,
        key: "attributes",
      },
      {
        title: "Inventario",
        align: "center",
        sortable: false,
        key: "inventory",
      },
      { title: "Impuestos", align: "center", sortable: false, key: "taxes" },
      { title: "Total", align: "center", sortable: false, key: "total" },
    ],
  }),

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
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
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
      this.emitRecords(
        this.records.filter((item) => item.id != itemSelected.id)
      );
    },
    emitRecords(newRecords) {
      this.$emit("update:records", newRecords);
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
      this.headersTable[2].title = 'Productos';
      this.headersTable[2].key = 'subproducts';
      this.titleField = 'Eventos'
    }
    this.loading = false;
  },
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
