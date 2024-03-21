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
          title="Servicios"
          :thirdkey="{ id: 'product_code', label: 'Cod: ' }"
          class="pr-5"
        >
        </dynamic-select-field>
        <modal-new-product
          @new-product="appendItem"
          type="I"
        ></modal-new-product>
      </div>
    </v-col>
    <v-col class="max-w-custom px-5">
      <v-row v-if="records && records.length > 0">
        <v-col cols="12" v-for="record in records" :key="record.code">
          <v-card
            :title="record.name"
            :subtitle="record.description"
            variant="outlined"
          >
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
              <v-chip class="mx-2">{{ record.measure.symbol }}</v-chip>
              <v-chip class="mx-2">{{ record.brand.name }}</v-chip>
              <span class="text-overline">{{ record.product_code }}</span>
            </template>
            <v-card-text>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :maxlength="rulesValidation.price.maxLength"
                        label="Costo"
                        :rules="rulesValidation.price.rules"
                        :loading="loading"
                        prepend-inner-icon="mdi-cash"
                        v-model="record.cost"
                        variant="outlined"
                        :disabled="editable"
                        persistent-hint
                        :hint="'Precio fijado: ' + record.defaultCost"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        class=""
                        :maxlength="rulesValidation.quantity.maxLength"
                        label="Cantidad"
                        :rules="[...rulesValidation.quantity.rules]"
                        :loading="loading"
                        variant="outlined"
                        v-model="record.amount"
                        :disabled="editable"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :maxlength="rulesValidation.price.maxLength"
                        label="Descuento"
                        :rules="rulesValidation.price.rules"
                        :loading="loading"
                        prepend-inner-icon="mdi-cash"
                        v-model="record.discount"
                        variant="outlined"
                        :disabled="editable"
                        persistent-hint
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row>
                    <v-col cols="12">
                      <dynamic-tax-list
                        :records="record.taxes"
                        :editable="editable"
                        :errorMessage="{}"
                        @update:records="(item) => (record.taxes = item)"
                      ></dynamic-tax-list>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <!-- ------------------------SUBPRODUCTS----------------------- -->
              <dynamic-subproduct-list
                :records="record.subproducts"
                :editable="editable"
                :errorMessage="errorMessage"
                @update:records="(item) => (record.subproducts = item)"
              ></dynamic-subproduct-list>
              <!-- ------------------------END SUBPRODUCTS----------------------- -->
              <total-records :record="record"></total-records>
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
import DynamicTaxList from "@/components/blocks/DynamicTaxList.vue";
import DynamicSubproductList from "./DynamicSubproductList.vue";
import InventoryApi from "@/services/Forms/InventoryApi";
import ModalNewProduct from "@/components/blocks/ModalNewProduct.vue";
import TotalRecords from "@/components/blocks/TotalRecords.vue";
import { formatNumberToColPesos } from "@/utils/cast";
const productApi = new ProductApi();
const warehouseApi = new WarehouseApi();
const inventoryApi = new InventoryApi();
export default {
  props: {
    records: Array,
    errorMessage: Object,
    editable: Boolean,
  },
  components: {
    DynamicSelectField,
    DynamicTaxList,
    DynamicSubproductList,
    ModalNewProduct,
    TotalRecords,
  },
  data: () => ({
    options: [],
    searchItem: "",
    loading: false,
    rulesValidation: RulesValidation,
    warehouses: [],
  }),

  methods: {
    totalCost(record) {
      const tamount = record.amount ?? 0;
      const tcost = record.cost ?? 0;
      const tDiscount = +(record.discount ?? 0);
      record.ctotal = (+tamount ?? 0) * tcost - tDiscount;
      return formatNumberToColPesos(record.ctotal);
    },
    totalTaxes(record) {
      const totalPercentTaxes =
        record.taxes.reduce((total, item) => total + (+item.percent ?? 0), 0) ??
        0;
      record.ctaxes = (totalPercentTaxes * record.ctotal) / 100;
      return formatNumberToColPesos(record.ctaxes);
    },
    netTotal(record) {
      const tDiscount = record.ctaxes;
      const tTotalCost = record.ctotal;
      return formatNumberToColPesos(tTotalCost - tDiscount);
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
      let query = `&types[0]=I&`;
      query =
        query + (name ? `filters[0][key]=name&filters[0][value]=${name}` : "");

      const response = await productApi.read(`format=short${query}`);
      this.options = response.data;
    },
    async setWarehouses(name = null) {
      const query = name ? `&name=${name}` : "";
      this.warehouses = (await warehouseApi.read(`format=short&${query}`)).data;
    },
    appendItem(item) {
      const index = this.records.findIndex(function (objeto) {
        return objeto.id === item.id;
      });
      let newArray = this.records;
      if (index === -1) newArray.push(item);
      this.emitRecords(newArray);
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
  max-height: 827.2px;
  overflow-y: scroll;
}
</style>
