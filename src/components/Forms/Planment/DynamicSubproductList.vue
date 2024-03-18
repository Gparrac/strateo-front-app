<template>
  <v-row>
    <v-col cols="12">
      <strong class="text-caption d-block mb-2"
        >* <span class="text-overline">Subproductos. </span> Escribe entre 3 a
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
          subtitle=""
          class="pr-5"
        >
        </dynamic-select-field>

      </div>
    </v-col>
    <v-col class="max-w-custom">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" lg="6" v-for="record in records" :key="record.code">
          <v-card>
            <v-card-text>
              <v-row justify="end">
                <v-col cols="4" sm="2"  md="2" lg="2">
                  <v-btn
                    v-show="!editable"
                    icon="mdi-delete"
                    color="warning"
                    variant="tonal"
                    @click="deleteItem(record)"
                  >
                  </v-btn>
                </v-col>
                <v-col cols="8" sm="10" md="6" >
                  <h6 class="text-h6">{{ record.name }}</h6>
                  <v-chip class="mx-2">{{ record.measure.symbol }}</v-chip>
                  <v-chip class="mx-2">{{ record.brand.name }}</v-chip>
                  <span class="text-overline">{{ record.product_code }}</span>
                </v-col>
                <v-col cols="12" md="4" >
                  <v-checkbox
                    v-model="record.tracing"
                    color="primary"
                    label="Requiere inventario"
                    :value="1"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="4" lg="5">
                  <dynamic-select-field
                    v-if="record.tracing"
                    :options="warehouses"
                    :itemSaved="record.warehouse"
                    :rules="rulesValidation.select.rules"
                    @update:options="setWarehouses"
                    @update:itemSelected="
                      (item) => setProductInventory(item, record)
                    "
                    mainLabel="address"
                    :secondLabel="['city', 'name']"
                    title="Bodega"
                    subtitle="Ciudad:"
                    density="compact"
                  >
                  </dynamic-select-field>
                </v-col>
                <v-col cols="12" md="4" lg="3">
                  <v-text-field
                    :maxlength="rulesValidation.price.maxLength"
                    label="Cantidad"
                    density="compact"
                    :rules="rulesValidation.price.rules"
                    :loading="loading"
                    append-inner-icon="mdi-delete-variant"
                    v-model="record.amount"
                    variant="outlined"
                    :disabled="editable"
                    persistent-hint
                    :hint="
                      'Por defecto: ' +
                        record.default_amount +
                        record.tracing && record.warehouse
                        ? ' Stock actual: ' + record.stock
                        : ''
                    "
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
      >Subproducts seleccionados:
    </strong>
    <span class="text-primary d-block text-h5 pt-3 pl-3">{{
      records.length
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
import DynamicSelectField from "@/components/blocks/DynamicSelectField.vue";
import WarehouseApi from "@/services/Forms/WarehouseApi";
import InventoryApi from "@/services/Forms/InventoryApi";
const inventoryApi = new InventoryApi();
import ProductApi from "@/services/Forms/ProductApi";
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
  },
  data: () => ({
    options: [],
    loading: false,
    rulesValidation: RulesValidation,
    warehouses: [],
  }),

  methods: {
    async loadItems(name = null) {
      let query = `types[0]=T&format=short&`;
      query = query + (name ? `keyword=${name}&typeKeyword=acronym` : "");

      const response = await productApi.read(query);
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
    async setWarehouses(name = null) {
      const query = name ? `&name=${name}` : "";
      this.warehouses = (await warehouseApi.read(`format=short&${query}`)).data;
    },
    async setProductInventory(item, product) {
      product.warehouse = item;
      product.stock = (
        await inventoryApi.read(
          `product_id=${product.id}&warehouse_id=${item.id}`
        )
      ).data;
    },
  },
  async mounted() {
    this.loading = true;
    try {
      await Promise.all([this.loadItems(), this.setWarehouses()]);
    } catch (error) {
      console.error("Alguna de las funciones falló:", error);
    }
    this.loading = false;
  },
};
</script>
<style scoped>
.max-w-custom {
  max-height: 530px;
  overflow-y: scroll;
}
</style>
